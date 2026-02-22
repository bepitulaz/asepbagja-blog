defmodule Blog.Content do
  @moduledoc """
  GenServer that owns ETS tables and loads all blog content.

  On startup it reads content from the local content path (cloning or
  pulling the git repo if configured). All writes serialize through this
  process; reads bypass it entirely via `Blog.Cache`.

  Cast `:refresh` to trigger a `git pull` + full reload, used by the
  GitHub webhook handler.
  """

  use GenServer
  require Logger

  # ── Public API ──────────────────────────────────────────────────────────────

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @doc "Async reload triggered by the GitHub webhook."
  def refresh, do: GenServer.cast(__MODULE__, :refresh)

  # ── GenServer callbacks ─────────────────────────────────────────────────────

  @impl true
  def init(_opts) do
    # Fast init — delegate heavy work to handle_continue so the supervisor
    # does not time out waiting for this process to start.
    {:ok, %{}, {:continue, :load}}
  end

  @impl true
  def handle_continue(:load, state) do
    Blog.Cache.init_tables()
    load_all_content()
    {:noreply, state}
  end

  @impl true
  def handle_cast(:refresh, state) do
    git_pull()
    load_all_content()
    Logger.info("[Blog.Content] Cache refreshed")
    {:noreply, state}
  end

  # ── Content loading ─────────────────────────────────────────────────────────

  defp load_all_content do
    base = content_path()

    posts = load_posts(base)
    Enum.each(posts, &Blog.Cache.put_post/1)
    Blog.Cache.rebuild_category_index(posts)

    load_comments(base)
    load_about_pages(base)
    load_music(base)
    load_workspace(base)

    Logger.info("[Blog.Content] Loaded #{length(posts)} posts")
  end

  # ── Posts ───────────────────────────────────────────────────────────────────

  defp load_posts(base) do
    Path.wildcard("#{base}/content/blog/**/*.md")
    |> Task.async_stream(&parse_post_file/1, timeout: :infinity)
    |> Enum.flat_map(fn
      {:ok, {:ok, post}} ->
        [post]

      {:ok, :skip} ->
        []

      {:exit, reason} ->
        Logger.warning("[Blog.Content] Post parse error: #{inspect(reason)}")
        []
    end)
  end

  defp parse_post_file(path) do
    lang = lang_from_path(path)
    slug = slug_from_path(path)
    raw = File.read!(path)
    {fm, body_html} = Blog.Markdown.parse(raw)

    case build_post(fm, body_html, lang, slug) do
      {:ok, post} ->
        {:ok, post}

      {:error, reason} ->
        Logger.warning("[Blog.Content] Skipping #{path}: #{reason}")
        :skip
    end
  end

  defp build_post(fm, body_html, lang, slug) do
    with {:ok, title} <- required(fm, "title"),
         {:ok, date} <- parse_date(fm["date"]),
         {:ok, category} <- first_category(fm["categories"]) do
      post = %Blog.Post{
        title: title,
        slug: slug,
        date: date,
        category: category,
        lang: lang,
        body_html: body_html,
        summary: fm["summary"],
        featured_image: first_image(fm["images"]),
        featured: fm["featured"] || false
      }

      {:ok, post}
    end
  end

  defp required(map, key) do
    case Map.get(map, key) do
      nil -> {:error, "missing required field: #{key}"}
      val -> {:ok, to_string(val)}
    end
  end

  defp parse_date(nil), do: {:error, "missing date"}

  defp parse_date(%Date{} = d), do: {:ok, d}

  defp parse_date(val) when is_binary(val) do
    case Date.from_iso8601(val) do
      {:ok, d} -> {:ok, d}
      _ -> {:error, "invalid date: #{val}"}
    end
  end

  # yaml_elixir may return the date as an Erlang date tuple or a Date struct
  defp parse_date({{y, m, d}, _time}), do: Date.new(y, m, d)
  defp parse_date({y, m, d}), do: Date.new(y, m, d)
  defp parse_date(val), do: {:error, "unparseable date: #{inspect(val)}"}

  defp first_category(nil), do: {:error, "missing categories"}
  defp first_category([]), do: {:error, "empty categories"}

  defp first_category([cat | _]) do
    {:ok, cat |> to_string() |> String.downcase()}
  end

  defp first_image(nil), do: nil
  defp first_image([]), do: nil
  defp first_image([img | _]), do: to_string(img)

  # ── Slug / lang helpers ─────────────────────────────────────────────────────

  defp slug_from_path(path) do
    path
    |> Path.basename(".md")
    |> strip_date_prefix()
  end

  # Strip leading YYYY-MM-DD- prefix (e.g. "2023-01-15-my-post" → "my-post")
  defp strip_date_prefix(name) do
    case Regex.run(~r/^\d{4}-\d{2}-\d{2}-(.+)$/, name) do
      [_, rest] -> rest
      _ -> name
    end
  end

  defp lang_from_path(path) do
    cond do
      String.contains?(path, "/blog/en/") -> "en"
      String.contains?(path, "/blog/id/") -> "id"
      true -> "en"
    end
  end

  # ── Comments ────────────────────────────────────────────────────────────────

  defp load_comments(base) do
    Path.wildcard("#{base}/comments/**/*.md")
    |> Enum.group_by(&comment_key_from_path/1)
    |> Enum.each(fn {{lang, slug}, paths} ->
      comments =
        paths
        |> Enum.sort()
        |> Enum.flat_map(fn path ->
          case parse_comment_file(path) do
            {:ok, c} -> [c]
            _ -> []
          end
        end)

      Blog.Cache.put_comments(lang, slug, comments)
    end)
  end

  defp comment_key_from_path(path) do
    # path: .../comments/en/my-post/001_2024-01-01T00-00-00Z.md
    parts = path |> Path.split() |> Enum.reverse()

    case parts do
      [_file, slug, lang | _] -> {lang, slug}
      _ -> {"en", "unknown"}
    end
  end

  defp parse_comment_file(path) do
    raw = File.read!(path)
    {fm, body_html} = Blog.Markdown.parse(raw)

    with {:ok, author} <- required(fm, "author"),
         {:ok, date} <- parse_datetime(fm["date"]) do
      comment = %Blog.Comment{
        author: author,
        date: date,
        source: fm["source"] || "web",
        body_html: body_html,
        reply_to: fm["reply_to"],
        original_disqus_id: fm["original_disqus_id"]
      }

      {:ok, comment}
    end
  end

  defp parse_datetime(nil), do: {:error, "missing date"}
  defp parse_datetime(%DateTime{} = dt), do: {:ok, dt}

  defp parse_datetime(val) when is_binary(val) do
    case DateTime.from_iso8601(val) do
      {:ok, dt, _offset} -> {:ok, dt}
      _ -> {:error, "invalid datetime: #{val}"}
    end
  end

  defp parse_datetime(val), do: {:error, "unparseable datetime: #{inspect(val)}"}

  # ── About pages ─────────────────────────────────────────────────────────────

  defp load_about_pages(base) do
    for lang <- ["en", "id"] do
      path = "#{base}/content/about/#{lang}.md"

      if File.exists?(path) do
        raw = File.read!(path)
        {_fm, body_html} = Blog.Markdown.parse(raw)
        Blog.Cache.put_page(:about, lang, body_html)
      end
    end
  end

  # ── Music ────────────────────────────────────────────────────────────────────

  defp load_music(base) do
    path = "#{base}/content/music/releases.json"

    if File.exists?(path) do
      case File.read!(path) |> Jason.decode() do
        {:ok, %{"records" => records}} ->
          Blog.Cache.put_page(:music, "en", records)
          Blog.Cache.put_page(:music, "id", records)

        _ ->
          Logger.warning("[Blog.Content] Failed to parse releases.json")
      end
    end
  end

  # ── Workspace ────────────────────────────────────────────────────────────────

  defp load_workspace(base) do
    path = "#{base}/content/workspace/en.json"

    if File.exists?(path) do
      case File.read!(path) |> Jason.decode() do
        {:ok, data} ->
          Blog.Cache.put_page(:workspace, "en", data)

        _ ->
          Logger.warning("[Blog.Content] Failed to parse workspace en.json")
      end
    end
  end

  # ── Git operations ────────────────────────────────────────────────────────────

  defp git_pull do
    path = content_path()
    repo_url = Application.get_env(:blog, :content_repo_url)

    cond do
      File.exists?(Path.join(path, ".git")) ->
        case System.cmd("git", ["-C", path, "pull", "--ff-only"], stderr_to_stdout: true) do
          {output, 0} -> Logger.info("[Blog.Content] git pull: #{String.trim(output)}")
          {output, code} -> Logger.warning("[Blog.Content] git pull failed (#{code}): #{output}")
        end

      repo_url != nil ->
        Logger.info("[Blog.Content] Cloning #{repo_url} → #{path}")
        File.mkdir_p!(Path.dirname(path))

        case System.cmd("git", ["clone", repo_url, path], stderr_to_stdout: true) do
          {_, 0} -> :ok
          {output, code} -> Logger.error("[Blog.Content] git clone failed (#{code}): #{output}")
        end

      true ->
        Logger.info("[Blog.Content] No git repo configured, using local path: #{path}")
    end
  end

  defp content_path do
    Application.get_env(:blog, :content_local_path, "priv/content")
  end
end
