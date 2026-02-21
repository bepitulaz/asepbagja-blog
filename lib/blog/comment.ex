defmodule Blog.Comment do
  @moduledoc "Comment struct representing a parsed markdown comment file."

  defstruct [:id, :author, :date, :reply_to, :source, :body_html]

  @type t :: %__MODULE__{
          id: String.t(),
          author: String.t(),
          date: DateTime.t() | nil,
          reply_to: String.t() | nil,
          source: String.t(),
          body_html: String.t()
        }
end
