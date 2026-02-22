defmodule Blog.Markdown do
  @moduledoc """
  Parses markdown files with YAML frontmatter.

  Frontmatter is delimited by `---` on its own line. The body is parsed
  to HTML using MDEx (GFM mode). If a file has no frontmatter, the entire
  content is treated as the body.
  """

  @doc """
  Parses raw file content into `{frontmatter_map, body_html}`.

  Returns `{%{}, html}` when no frontmatter is present.
  """
  @spec parse(String.t()) :: {map(), String.t()}
  def parse(raw_content) do
    # Normalize CRLF → LF so delimiter matching works regardless of git
    # checkout settings on the content repository.
    content = String.replace(raw_content, "\r\n", "\n")
    {yaml, body} = split_frontmatter(content)
    frontmatter = parse_yaml(yaml)
    body_html = render_body(body)
    {frontmatter, body_html}
  end

  # Split on the --- delimiters. A valid frontmatter block looks like:
  # ---\n<yaml>\n---\n<body>
  # Splitting "---\n" with parts: 3 yields ["", yaml, body].
  defp split_frontmatter(content) do
    case String.split(content, "---\n", parts: 3) do
      ["", yaml, body] -> {yaml, body}
      _ -> {"", content}
    end
  end

  defp parse_yaml(""), do: %{}

  defp parse_yaml(yaml) do
    case YamlElixir.read_from_string(yaml) do
      {:ok, map} -> map
      {:error, _} -> %{}
    end
  end

  @mdex_opts [
    extension: [
      strikethrough: true,
      tagfilter: true,
      table: true,
      autolink: true,
      tasklist: true,
      footnotes: true,
      description_lists: true
    ],
    parse: [smart: true],
    render: [unsafe: true],
    syntax_highlight: [formatter: {:html_inline, theme: "github"}]
  ]

  @doc """
  Renders a markdown string to HTML using MDEx.
  Passes through content that already looks like HTML (e.g. migrated Disqus comments).
  """
  @spec render_body(String.t()) :: String.t()
  def render_body(body) do
    trimmed = String.trim(body)

    if html_content?(trimmed) do
      trimmed
    else
      case MDEx.to_html(trimmed, @mdex_opts) do
        {:ok, html} -> html
        {:error, _} -> "<p>#{trimmed}</p>"
      end
    end
  end

  # Detect if the body is raw HTML (migrated Disqus comments)
  defp html_content?(content) do
    String.starts_with?(content, "<") and
      (String.contains?(content, "</p>") or
         String.contains?(content, "</div>") or
         String.contains?(content, "<br"))
  end
end
