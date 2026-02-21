defmodule BlogWeb.PostController do
  @moduledoc "Handles blog post listing and individual post pages."
  use BlogWeb, :controller

  @doc "English blog listing (all posts across categories)."
  def all_posts(conn, _params) do
    posts = Blog.Cache.get_all_posts("en")

    conn
    |> assign(:meta_title, "Blog | Asep Bagja")
    |> assign(
      :meta_description,
      "All blog posts by Asep Bagja — programming, personal, and more."
    )
    |> assign(:og_image, "https://www.asepbagja.com/images/blog.png")
    |> assign(:og_url, "https://www.asepbagja.com/blog")
    |> render(:all_posts, posts: posts)
  end

  @doc "Indonesian blog listing."
  def all_posts_id(conn, _params) do
    posts = Blog.Cache.get_all_posts("id")

    conn
    |> assign(:meta_title, "Blog | Asep Bagja")
    |> assign(:meta_description, "Semua tulisan blog oleh Asep Bagja.")
    |> assign(:og_image, "https://www.asepbagja.com/images/blog.png")
    |> assign(:og_url, "https://www.asepbagja.com/id/blog")
    |> render(:all_posts_id, posts: posts)
  end

  @doc "English category listing."
  def index(conn, %{"category" => category}) do
    posts = Blog.Cache.get_posts_by_category("en", category)

    if posts == [] do
      conn
      |> put_status(404)
      |> put_view(BlogWeb.ErrorHTML)
      |> render(:"404")
      |> halt()
    else
      og_image =
        case posts do
          [first | _] -> first.featured_image || "https://www.asepbagja.com/images/blog.png"
          _ -> "https://www.asepbagja.com/images/blog.png"
        end

      conn
      |> assign(:meta_title, "#{String.capitalize(category)} | Asep Bagja")
      |> assign(:meta_description, "Posts in the #{category} category on Asep Bagja's blog.")
      |> assign(:og_image, og_image)
      |> assign(:og_url, "https://www.asepbagja.com/#{category}")
      |> render(:index, posts: posts, category: category, lang: "en")
    end
  end

  @doc "Indonesian category listing."
  def index_id(conn, %{"category" => category}) do
    posts = Blog.Cache.get_posts_by_category("id", category)

    if posts == [] do
      conn
      |> put_status(404)
      |> put_view(BlogWeb.ErrorHTML)
      |> render(:"404")
      |> halt()
    else
      og_image =
        case posts do
          [first | _] -> first.featured_image || "https://www.asepbagja.com/images/blog.png"
          _ -> "https://www.asepbagja.com/images/blog.png"
        end

      conn
      |> assign(:meta_title, "#{String.capitalize(category)} | Asep Bagja")
      |> assign(:meta_description, "Tulisan dalam kategori #{category}.")
      |> assign(:og_image, og_image)
      |> assign(:og_url, "https://www.asepbagja.com/id/#{category}")
      |> render(:index_id, posts: posts, category: category, lang: "id")
    end
  end

  @doc "Show a single English blog post."
  def show(conn, %{"slug" => slug}) do
    case Blog.Cache.get_post("en", slug) do
      nil ->
        conn
        |> put_status(404)
        |> put_view(BlogWeb.ErrorHTML)
        |> render(:"404")
        |> halt()

      post ->
        comments = Blog.Cache.get_comments("en", slug)

        conn
        |> assign(:meta_title, "#{post.title} | Asep Bagja")
        |> assign(:meta_description, post.summary || "")
        |> assign(:og_image, post.featured_image || "https://www.asepbagja.com/images/blog.png")
        |> assign(:og_url, "https://www.asepbagja.com/#{post.category}/#{post.slug}")
        |> assign(:og_type, "article")
        |> render(:show, post: post, comments: comments, lang: "en")
    end
  end

  @doc "Show a single Indonesian blog post."
  def show_id(conn, %{"slug" => slug}) do
    case Blog.Cache.get_post("id", slug) do
      nil ->
        conn
        |> put_status(404)
        |> put_view(BlogWeb.ErrorHTML)
        |> render(:"404")
        |> halt()

      post ->
        comments = Blog.Cache.get_comments("id", slug)

        conn
        |> assign(:meta_title, "#{post.title} | Asep Bagja")
        |> assign(:meta_description, post.summary || "")
        |> assign(:og_image, post.featured_image || "https://www.asepbagja.com/images/blog.png")
        |> assign(:og_url, "https://www.asepbagja.com/id/#{post.category}/#{post.slug}")
        |> assign(:og_type, "article")
        |> render(:show_id, post: post, comments: comments, lang: "id")
    end
  end
end
