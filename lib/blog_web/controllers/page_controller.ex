defmodule BlogWeb.PageController do
  use BlogWeb, :controller

  def home(conn, _params) do
    posts = Blog.Cache.list_posts("en") |> Enum.take(4)
    render(conn, :home, posts: posts, lang: "en")
  end

  def home_id(conn, _params) do
    posts = Blog.Cache.list_posts("id") |> Enum.take(4)
    render(conn, :home, posts: posts, lang: "id")
  end

  def about(conn, _params) do
    body_html = Blog.Cache.get_page(:about, "en")
    render(conn, :about, lang: "en", body_html: body_html)
  end

  def about_id(conn, _params) do
    body_html = Blog.Cache.get_page(:about, "id")
    render(conn, :about, lang: "id", body_html: body_html)
  end

  def discography(conn, _params) do
    releases = Blog.Cache.get_page(:music, "en") || []
    render(conn, :discography, releases: releases, lang: "en")
  end

  def discography_id(conn, _params) do
    releases = Blog.Cache.get_page(:music, "id") || []
    render(conn, :discography, releases: releases, lang: "id")
  end
end
