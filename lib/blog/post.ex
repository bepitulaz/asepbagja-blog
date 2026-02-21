defmodule Blog.Post do
  @moduledoc "Blog post struct representing a parsed markdown post."

  defstruct [
    :title,
    :slug,
    :date,
    :category,
    :lang,
    :body_html,
    :summary,
    :featured_image,
    :featured
  ]

  @type t :: %__MODULE__{
          title: String.t(),
          slug: String.t(),
          date: Date.t(),
          category: String.t(),
          lang: String.t(),
          body_html: String.t(),
          summary: String.t(),
          featured_image: String.t() | nil,
          featured: boolean()
        }
end
