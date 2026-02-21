defmodule Blog.Github do
  @moduledoc """
  GitHub API client for creating comment files in the content repository via the
  GitHub Contents API.

  Each submitted comment is stored as a markdown file committed to the
  `comments/{lang}/{slug}/` directory. The resulting push triggers the webhook
  and refreshes the ETS cache automatically.
  """

  @doc """
  Create a new comment file for the given post.

  Returns `{:ok, response}` on success or `{:error, reason}` on failure.
  """
  @spec create_comment(String.t(), String.t(), String.t(), String.t()) ::
          {:ok, Req.Response.t()} | {:error, any()}
  def create_comment(lang, slug, author, body) do
    token = Application.get_env(:blog, :github_token)
    owner = Application.get_env(:blog, :github_repo_owner, "asepbagja")
    repo = Application.get_env(:blog, :github_repo_name, "asepbagja-content")

    now = DateTime.utc_now()
    timestamp = Calendar.strftime(now, "%Y-%m-%dT%H-%M-%SZ")
    sequence = next_sequence(lang, slug)
    seq_str = String.pad_leading(to_string(sequence), 3, "0")
    filename = "#{seq_str}_#{timestamp}.md"

    content = build_comment_content(author, body, now)
    encoded = Base.encode64(content)

    path = "comments/#{lang}/#{slug}/#{filename}"
    url = "https://api.github.com/repos/#{owner}/#{repo}/contents/#{path}"

    Req.put(url,
      auth: {:bearer, token},
      json: %{
        message: "Add comment on #{slug}",
        content: encoded
      }
    )
  end

  # ---------------------------------------------------------------------------
  # Private helpers
  # ---------------------------------------------------------------------------

  defp build_comment_content(author, body, now) do
    iso_date = DateTime.to_iso8601(now)
    safe_author = sanitize_author(author)
    safe_body = sanitize_body(body)

    """
    ---
    author: "#{safe_author}"
    date: #{iso_date}
    reply_to: null
    source: web
    ---

    #{safe_body}
    """
  end

  defp sanitize_author(author) do
    author
    |> String.replace(~r/<[^>]+>/, "")
    |> String.replace(~r/"/, "'")
    |> String.slice(0, 100)
  end

  defp sanitize_body(body) do
    body |> String.slice(0, 5000)
  end

  defp next_sequence(lang, slug) do
    comments = Blog.Cache.get_comments(lang, slug)
    length(comments) + 1
  end
end
