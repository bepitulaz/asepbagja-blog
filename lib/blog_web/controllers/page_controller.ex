defmodule BlogWeb.PageController do
  @moduledoc "Handles static pages: homepages, about, discography, and workspace."
  use BlogWeb, :controller

  @doc "English homepage."
  def home(conn, _params) do
    recent_posts = Blog.Cache.get_all_posts("en") |> Enum.take(4)
    music = Blog.Cache.get_page(:music, "en") || []

    conn
    |> assign(:meta_title, "Asep Bagja - Code & Music")
    |> assign(
      :meta_description,
      "My personal blog where I share my opinion and topics that I'm interested in — code, music, and life."
    )
    |> assign(:og_image, "https://www.asepbagja.com/images/paljassaare.jpg")
    |> assign(:og_url, "https://www.asepbagja.com")
    |> render(:home, recent_posts: recent_posts, music: music)
  end

  @doc "Indonesian homepage."
  def home_id(conn, _params) do
    recent_posts = Blog.Cache.get_all_posts("id") |> Enum.take(4)
    music = Blog.Cache.get_page(:music, "id") || []

    conn
    |> assign(:meta_title, "Asep Bagja - Kode & Musik")
    |> assign(
      :meta_description,
      "Blog pribadi saya yang berisi pendapat dan topik yang saya minati — kode, musik, dan kehidupan."
    )
    |> assign(:og_image, "https://www.asepbagja.com/images/paljassaare.jpg")
    |> assign(:og_url, "https://www.asepbagja.com/id")
    |> render(:home_id, recent_posts: recent_posts, music: music)
  end

  @doc "English about page."
  def about(conn, _params) do
    content = Blog.Cache.get_page(:about, "en")

    conn
    |> assign(:meta_title, "About | Asep Bagja")
    |> assign(:meta_description, "Learn more about Asep Bagja Priandana.")
    |> assign(:og_image, "https://www.asepbagja.com/images/about.jpg")
    |> assign(:og_url, "https://www.asepbagja.com/about")
    |> render(:about, content: content)
  end

  @doc "Indonesian about page."
  def about_id(conn, _params) do
    content = Blog.Cache.get_page(:about, "id")

    conn
    |> assign(:meta_title, "Tentang | Asep Bagja")
    |> assign(:meta_description, "Lebih lanjut tentang Asep Bagja Priandana.")
    |> assign(:og_image, "https://www.asepbagja.com/images/about.jpg")
    |> assign(:og_url, "https://www.asepbagja.com/id/tentang")
    |> render(:about_id, content: content)
  end

  @doc "English discography page."
  def discography(conn, _params) do
    music = Blog.Cache.get_page(:music, "en") || []

    conn
    |> assign(:meta_title, "Discography | Asep Bagja")
    |> assign(:meta_description, "Music releases by Asep Bagja Priandana.")
    |> assign(:og_image, "https://www.asepbagja.com/images/discography.png")
    |> assign(:og_url, "https://www.asepbagja.com/discography")
    |> render(:discography, music: music)
  end

  @doc "Indonesian discography page."
  def discography_id(conn, _params) do
    music = Blog.Cache.get_page(:music, "id") || []

    conn
    |> assign(:meta_title, "Diskografi | Asep Bagja")
    |> assign(:meta_description, "Rilisan musik oleh Asep Bagja Priandana.")
    |> assign(:og_image, "https://www.asepbagja.com/images/discography.png")
    |> assign(:og_url, "https://www.asepbagja.com/id/diskografi")
    |> render(:discography_id, music: music)
  end

  @doc "English workspace page."
  def workspace(conn, _params) do
    workspace = Blog.Cache.get_page(:workspace, "en") || %{}

    conn
    |> assign(:meta_title, "Workspace | Asep Bagja")
    |> assign(
      :meta_description,
      "The tools and gear I use for software development, music, and video production."
    )
    |> assign(:og_image, "https://www.asepbagja.com/images/paljassaare.jpg")
    |> assign(:og_url, "https://www.asepbagja.com/workspace")
    |> render(:workspace, workspace: workspace)
  end
end
