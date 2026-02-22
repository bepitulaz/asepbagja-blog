defmodule Blog.Post do
  @moduledoc """
  Struct representing a parsed blog post.
  """

  @enforce_keys [:title, :slug, :date, :category, :lang, :body_html]
  defstruct [
    :title,
    :slug,
    :date,
    :category,
    :lang,
    :body_html,
    :summary,
    :featured_image,
    featured: false
  ]

  @type t :: %__MODULE__{
          title: String.t(),
          slug: String.t(),
          date: Date.t(),
          category: String.t(),
          lang: String.t(),
          body_html: String.t(),
          summary: String.t() | nil,
          featured_image: String.t() | nil,
          featured: boolean()
        }
end
