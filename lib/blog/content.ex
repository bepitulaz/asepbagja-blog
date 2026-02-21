defmodule Blog.Content do
  @moduledoc """
  GenServer responsible for syncing the content repository and populating the ETS cache.

  On startup it clones (or pulls) the content repo defined in application config,
  then parses all markdown posts, comments, and JSON data files into ETS via `Blog.Cache`.

  A `:refresh` cast triggers a `git pull` followed by a full re-parse.
  """
  use GenServer
  require Logger

  # ---------------------------------------------------------------------------
  # Public API
  # ---------------------------------------------------------------------------

  @doc "Start the Content GenServer, linked to the calling process."
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @doc "Trigger an async content refresh (git pull + re-parse)."
  def refresh do
    GenServer.cast(__MODULE__, :refresh)
  end

  # ---------------------------------------------------------------------------
  # GenServer callbacks
  # ---------------------------------------------------------------------------

  @impl true
  def init(_opts) do
    Blog.Cache.init()
    {:ok, %{}, {:continue, :load}}
  end

  @impl true
  def handle_continue(:load, state) do
    sync_content()
    {:noreply, state}
  end

  @impl true
  def handle_cast(:refresh, state) do
    Logger.info("[Blog.Content] Received :refresh — pulling latest content")
    sync_content()
    {:noreply, state}
  end

  # ---------------------------------------------------------------------------
  # Private helpers
  # ---------------------------------------------------------------------------

  defp sync_content do
    local_path = Application.get_env(:blog, :content_local_path, "priv/content")
    repo_url = Application.get_env(:blog, :content_repo_url, "")

    git_dir = Path.join(local_path, ".git")

    if File.exists?(git_dir) do
      Logger.info("[Blog.Content] git pull at #{local_path}")
      {output, code} = System.cmd("git", ["-C", local_path, "pull"], stderr_to_stdout: true)
      Logger.info("[Blog.Content] git pull exited #{code}: #{String.trim(output)}")
    else
      Logger.info("[Blog.Content] Cloning #{repo_url} → #{local_path}")
      File.mkdir_p!(local_path)

      {output, code} =
        System.cmd("git", ["clone", repo_url, local_path], stderr_to_stdout: true)

      Logger.info("[Blog.Content] git clone exited #{code}: #{String.trim(output)}")
    end

    Blog.Cache.clear_all()
    parse_all_content(local_path)
    Logger.info("[Blog.Content] Content sync complete")
  end

  defp parse_all_content(base_path) do
    parse_posts(base_path, "en")
    parse_posts(base_path, "id")
    parse_about(base_path)
    parse_music(base_path)
    parse_workspace(base_path)
    parse_comments(base_path, "en")
    parse_comments(base_path, "id")
  end

  # --- Posts ------------------------------------------------------------------

  defp parse_posts(base_path, lang) do
    dir = Path.join([base_path, "content", "blog", lang])

    case File.ls(dir) do
      {:ok, files} ->
        files
        |> Enum.filter(&String.ends_with?(&1, ".md"))
        |> Enum.each(fn filename ->
          path = Path.join(dir, filename)
          slug = Path.rootname(filename)
          parse_post_file(path, slug, lang)
        end)

      {:error, reason} ->
        Logger.warning("[Blog.Content] Cannot read posts dir #{dir}: #{inspect(reason)}")
    end
  end

  defp parse_post_file(path, slug, lang) do
    with {:ok, raw} <- File.read(path),
         {fm, body_html} <- Blog.Markdown.parse(raw),
         {:ok, date} <- parse_date(fm["date"]),
         [first_category | _] <- fm["categories"] || [] do
      post = %Blog.Post{
        title: fm["title"] || "",
        slug: slug,
        date: date,
        category: String.downcase(first_category),
        lang: lang,
        body_html: body_html,
        summary: fm["summary"] || "",
        featured_image: List.first(fm["images"] || []),
        featured: fm["featured"] || false
      }

      Blog.Cache.put_post(post)
    else
      {:error, reason} ->
        Logger.warning("[Blog.Content] Cannot read #{path}: #{inspect(reason)}")

      [] ->
        Logger.warning("[Blog.Content] Skipping #{path}: missing 'categories' field")

      other ->
        Logger.warning("[Blog.Content] Skipping #{path}: #{inspect(other)}")
    end
  end

  # --- About pages ------------------------------------------------------------

  defp parse_about(base_path) do
    for lang <- ["en", "id"] do
      path = Path.join([base_path, "content", "about", "#{lang}.md"])

      case File.read(path) do
        {:ok, raw} ->
          {_fm, html} = Blog.Markdown.parse(raw)
          Blog.Cache.put_page(:about, lang, html)

        {:error, reason} ->
          Logger.warning("[Blog.Content] Cannot read about/#{lang}.md: #{inspect(reason)}")
      end
    end
  end

  # --- Music releases ---------------------------------------------------------

  defp parse_music(base_path) do
    path = Path.join([base_path, "content", "music", "releases.json"])

    case File.read(path) do
      {:ok, raw} ->
        case Jason.decode(raw) do
          {:ok, %{"records" => records}} ->
            sorted = Enum.sort_by(records, & &1["year"], :desc)
            Blog.Cache.put_page(:music, "en", sorted)
            Blog.Cache.put_page(:music, "id", sorted)

          {:ok, data} ->
            Blog.Cache.put_page(:music, "en", data)
            Blog.Cache.put_page(:music, "id", data)

          {:error, reason} ->
            Logger.warning("[Blog.Content] Cannot parse releases.json: #{inspect(reason)}")
        end

      {:error, reason} ->
        Logger.warning("[Blog.Content] Cannot read releases.json: #{inspect(reason)}")
    end
  end

  # --- Workspace data ---------------------------------------------------------

  defp parse_workspace(base_path) do
    path = Path.join([base_path, "content", "workspace", "en.json"])

    case File.read(path) do
      {:ok, raw} ->
        case Jason.decode(raw) do
          {:ok, data} ->
            Blog.Cache.put_page(:workspace, "en", data)

          {:error, reason} ->
            Logger.warning("[Blog.Content] Cannot parse workspace/en.json: #{inspect(reason)}")
        end

      {:error, reason} ->
        Logger.warning("[Blog.Content] Cannot read workspace/en.json: #{inspect(reason)}")
    end
  end

  # --- Comments ---------------------------------------------------------------

  defp parse_comments(base_path, lang) do
    dir = Path.join([base_path, "comments", lang])

    case File.ls(dir) do
      {:ok, entries} ->
        Enum.each(entries, fn entry ->
          slug_path = Path.join(dir, entry)

          if File.dir?(slug_path) do
            parse_comment_dir(slug_path, entry, lang)
          end
        end)

      {:error, _} ->
        Logger.info("[Blog.Content] No comments directory at #{dir}")
    end
  end

  defp parse_comment_dir(dir_path, slug, lang) do
    case File.ls(dir_path) do
      {:ok, files} ->
        comments =
          files
          |> Enum.filter(&String.ends_with?(&1, ".md"))
          |> Enum.sort()
          |> Enum.map(fn filename ->
            path = Path.join(dir_path, filename)
            id = Path.rootname(filename)
            parse_comment_file(path, id)
          end)
          |> Enum.reject(&is_nil/1)

        Blog.Cache.put_comments(lang, slug, comments)

      {:error, reason} ->
        Logger.warning("[Blog.Content] Cannot read comment dir #{dir_path}: #{inspect(reason)}")
    end
  end

  defp parse_comment_file(path, id) do
    with {:ok, raw} <- File.read(path),
         {fm, body_html} <- Blog.Markdown.parse(raw) do
      %Blog.Comment{
        id: id,
        author: fm["author"] || "Anonymous",
        date: fm["date"],
        reply_to: fm["reply_to"],
        source: fm["source"] || "web",
        body_html: body_html
      }
    else
      _ -> nil
    end
  end

  # --- Date parsing -----------------------------------------------------------

  defp parse_date(%Date{} = d), do: {:ok, d}
  defp parse_date(%NaiveDateTime{} = ndt), do: {:ok, NaiveDateTime.to_date(ndt)}
  defp parse_date(%DateTime{} = dt), do: {:ok, DateTime.to_date(dt)}

  defp parse_date(s) when is_binary(s) do
    # Some frontmatter dates include time components; try date-only first
    case Date.from_iso8601(s) do
      {:ok, d} ->
        {:ok, d}

      _ ->
        case DateTime.from_iso8601(s) do
          {:ok, dt, _} -> {:ok, DateTime.to_date(dt)}
          _ -> {:error, :invalid_date}
        end
    end
  end

  defp parse_date(_), do: {:error, :invalid_date}
end
