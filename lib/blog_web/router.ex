defmodule BlogWeb.Router do
  use BlogWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {BlogWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", BlogWeb do
    pipe_through :browser

    # Homepages
    get "/", PageController, :home
    get "/id", PageController, :home_id

    # Static pages – English
    get "/about", PageController, :about
    get "/discography", PageController, :discography
    get "/workspace", PageController, :workspace
    get "/blog", PostController, :all_posts

    # Static pages – Indonesian
    get "/id/tentang", PageController, :about_id
    get "/id/diskografi", PageController, :discography_id
    get "/id/blog", PostController, :all_posts_id

    # /en/ prefix routes (mirrors of English routes for SEO compatibility)
    get "/en", PageController, :home
    get "/en/about", PageController, :about
    get "/en/discography", PageController, :discography
    get "/en/blog", PostController, :all_posts
    get "/en/:category/:slug", PostController, :show

    # RSS feeds
    get "/en/feed.xml", FeedController, :rss_en
    get "/id/feed.xml", FeedController, :rss_id

    # Sitemap
    get "/sitemap.xml", FeedController, :sitemap

    # Comment submission – must come before the catch-all slug routes
    post "/:category/:slug/comments", CommentController, :create_en
    post "/id/:category/:slug/comments", CommentController, :create_id

    # Indonesian post routes (must precede English catch-all)
    get "/id/:category", PostController, :index_id
    get "/id/:category/:slug", PostController, :show_id

    # English post routes (catch-all)
    get "/:category", PostController, :index
    get "/:category/:slug", PostController, :show
  end

  # GitHub webhook (no CSRF, accepts JSON)
  scope "/api", BlogWeb do
    pipe_through :api

    post "/webhook/github", WebhookController, :github
  end

  if Application.compile_env(:blog, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: BlogWeb.Telemetry
    end
  end
end
