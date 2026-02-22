defmodule BlogWeb.PostController do
  use BlogWeb, :controller

  def index(conn, _params) do
    posts = Blog.Cache.list_posts("en")
    render(conn, :index, posts: posts, lang: "en")
  end

  def index_id(conn, _params) do
    posts = Blog.Cache.list_posts("id")
    render(conn, :index, posts: posts, lang: "id")
  end

  def show(conn, %{"category" => category, "slug" => slug}) do
    case Blog.Cache.get_post("en", slug) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render(:show, post: nil, comments: [], lang: "en")

      post ->
        if post.category != category do
          conn
          |> put_status(:not_found)
          |> render(:show, post: nil, comments: [], lang: "en")
        else
          comments = Blog.Cache.get_comments("en", slug)
          render(conn, :show, post: post, comments: comments, lang: "en")
        end
    end
  end

  def show_id(conn, %{"category" => category, "slug" => slug}) do
    case Blog.Cache.get_post("id", slug) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render(:show, post: nil, comments: [], lang: "id")

      post ->
        if post.category != category do
          conn
          |> put_status(:not_found)
          |> render(:show, post: nil, comments: [], lang: "id")
        else
          comments = Blog.Cache.get_comments("id", slug)
          render(conn, :show, post: post, comments: comments, lang: "id")
        end
    end
  end
end
