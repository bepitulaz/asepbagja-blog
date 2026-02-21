defmodule BlogWeb.CommentController do
  @moduledoc "Handles comment form submission."
  use BlogWeb, :controller

  @doc "Submit a new comment for an English post."
  def create_en(conn, %{"category" => category, "slug" => slug, "comment" => params}) do
    handle_comment(conn, "en", category, slug, params)
  end

  @doc "Submit a new comment for an Indonesian post."
  def create_id(conn, %{"category" => category, "slug" => slug, "comment" => params}) do
    handle_comment(conn, "id", category, slug, params)
  end

  # ---------------------------------------------------------------------------
  # Private helpers
  # ---------------------------------------------------------------------------

  defp handle_comment(conn, lang, category, slug, params) do
    author = Map.get(params, "author", "") |> String.trim() |> String.slice(0, 100)
    body = Map.get(params, "body", "") |> String.trim() |> String.slice(0, 5000)

    post_url = build_post_url(lang, category, slug)

    if author == "" or body == "" do
      conn
      |> put_flash(:error, "Author and comment body are required.")
      |> redirect(to: post_url)
    else
      case Blog.Github.create_comment(lang, slug, author, body) do
        {:ok, _response} ->
          conn
          |> put_flash(:info, "Comment submitted! It will appear shortly.")
          |> redirect(to: post_url)

        {:error, reason} ->
          conn
          |> put_flash(:error, "Failed to submit comment: #{inspect(reason)}")
          |> redirect(to: post_url)
      end
    end
  end

  defp build_post_url("en", category, slug), do: "/#{category}/#{slug}"
  defp build_post_url("id", category, slug), do: "/id/#{category}/#{slug}"
end
