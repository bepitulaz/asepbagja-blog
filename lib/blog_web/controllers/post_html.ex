defmodule BlogWeb.PostHTML do
  @moduledoc "Templates for PostController."
  use BlogWeb, :html

  embed_templates "post_html/*"
end
