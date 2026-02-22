defmodule BlogWeb.PostHTML do
  @moduledoc """
  This module contains pages rendered by PostController.

  See the `post_html` directory for all templates
  available.
  """
  use BlogWeb, :html

  embed_templates "post_html/*"
end
