defmodule Blog.Comment do
  @moduledoc """
  Struct representing a parsed comment.
  """

  @enforce_keys [:author, :date, :source, :body_html]
  defstruct [
    :author,
    :date,
    :source,
    :body_html,
    reply_to: nil,
    original_disqus_id: nil
  ]

  @type t :: %__MODULE__{
          author: String.t(),
          date: DateTime.t(),
          source: String.t(),
          body_html: String.t(),
          reply_to: String.t() | nil,
          original_disqus_id: String.t() | nil
        }
end
