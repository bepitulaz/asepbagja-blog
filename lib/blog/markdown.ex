defmodule Blog.Markdown do
  @moduledoc "Parse markdown files with YAML frontmatter. Supports plain markdown and frontmatter-delimited files."

  @mdex_opts [
    extension: [table: true, strikethrough: true, autolink: true],
    syntax_highlight: [formatter: {:html_inline, theme: "github"}]
  ]

  @doc """
  Parses a raw markdown string that may contain YAML frontmatter delimited by `---`.

  Returns `{frontmatter_map, body_html}` where `frontmatter_map` is a map of
  parsed YAML keys and `body_html` is the rendered HTML string.

  If no frontmatter is found, returns `{%{}, body_html}`.
  """
  @spec parse(String.t()) :: {map(), String.t()}
  def parse(raw_content) do
    case split_frontmatter(raw_content) do
      {:ok, frontmatter_str, body} ->
        case YamlElixir.read_from_string(frontmatter_str) do
          {:ok, fm} ->
            html = render_body(body)
            {fm, html}

          {:error, _reason} ->
            {%{}, render_body(raw_content)}
        end

      :no_frontmatter ->
        {%{}, render_body(raw_content)}
    end
  end

  @doc """
  Renders a markdown body string to HTML without extracting frontmatter.
  """
  @spec parse_body_only(String.t()) :: String.t()
  def parse_body_only(raw_content) do
    render_body(raw_content)
  end

  # Splits frontmatter from body. The file must start with "---\n" and have a
  # closing "---\n" (or "---" at end of file).
  # Uses binary operations throughout to avoid byte/codepoint offset mismatch
  # when content contains multibyte UTF-8 characters.
  defp split_frontmatter(raw) do
    # Normalise line endings
    raw = String.replace(raw, "\r\n", "\n")

    if String.starts_with?(raw, "---\n") do
      # Remove the leading "---\n" (4 bytes)
      rest = :binary.part(raw, 4, byte_size(raw) - 4)

      case :binary.match(rest, "\n---") do
        {pos, _len} ->
          frontmatter_str = :binary.part(rest, 0, pos)
          # Skip past "\n---" (4 bytes) and any optional trailing newline
          after_start = pos + 4
          after_delimiter = :binary.part(rest, after_start, byte_size(rest) - after_start)

          body =
            if :binary.part(after_delimiter, 0, min(1, byte_size(after_delimiter))) == "\n" do
              :binary.part(after_delimiter, 1, byte_size(after_delimiter) - 1)
            else
              after_delimiter
            end

          {:ok, frontmatter_str, body}

        :nomatch ->
          :no_frontmatter
      end
    else
      :no_frontmatter
    end
  end

  defp render_body(body) do
    MDEx.to_html!(body, @mdex_opts)
  end
end
