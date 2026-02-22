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

    # Indonesian routes first to prevent /:category/:slug conflict
    get "/id", PageController, :home_id
    get "/id/tentang", PageController, :about_id
    get "/id/diskografi", PageController, :discography_id
    get "/id/blog", PostController, :index_id
    get "/id/:category/:slug", PostController, :show_id

    # English routes (root)
    get "/", PageController, :home
    get "/about", PageController, :about
    get "/discography", PageController, :discography
    get "/blog", PostController, :index

    # English /en/ prefix routes (templates generate /en/:category/:slug links)
    get "/en", PageController, :home
    get "/en/about", PageController, :about
    get "/en/discography", PageController, :discography
    get "/en/blog", PostController, :index
    get "/en/:category/:slug", PostController, :show

    # Broadest route last
    get "/:category/:slug", PostController, :show
  end

  # API scope (no CSRF)
  scope "/api", BlogWeb do
    pipe_through :api

    # post "/webhook/github", WebhookController, :github
  end

  # Enable LiveDashboard in development
  if Application.compile_env(:blog, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: BlogWeb.Telemetry
    end
  end
end
