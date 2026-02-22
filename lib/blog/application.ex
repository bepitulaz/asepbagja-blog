defmodule Blog.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      BlogWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:blog, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Blog.PubSub},
      # Content GenServer must start before the web endpoint so ETS tables
      # exist when the first request arrives. Uses handle_continue internally
      # so init/1 returns immediately without blocking the supervisor.
      Blog.Content,
      # Start to serve requests, typically the last entry
      BlogWeb.Endpoint
    ]

    # :one_for_one — children are independent. If Content crashes it restarts
    # on its own; the web endpoint keeps serving (from ETS or empty state).
    opts = [strategy: :one_for_one, name: Blog.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    BlogWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
