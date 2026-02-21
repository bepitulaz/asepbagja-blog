defmodule BlogWeb.WebhookController do
  @moduledoc "Handles incoming GitHub webhook events."
  use BlogWeb, :controller
  require Logger

  @doc "Receive a GitHub push event and trigger an async content refresh."
  def github(conn, _params) do
    secret = Application.get_env(:blog, :github_webhook_secret, "")
    signature_header = get_req_header(conn, "x-hub-signature-256") |> List.first() || ""

    {:ok, body, conn} = Plug.Conn.read_body(conn)

    if valid_signature?(signature_header, body, secret) do
      Blog.Content.refresh()
      send_resp(conn, 200, "ok")
    else
      Logger.warning("[WebhookController] Invalid or missing webhook signature")
      send_resp(conn, 403, "forbidden")
    end
  end

  # ---------------------------------------------------------------------------
  # Private helpers
  # ---------------------------------------------------------------------------

  defp valid_signature?(_sig, _body, "") do
    # No secret configured — allow all (useful during initial setup)
    true
  end

  defp valid_signature?(sig, body, secret) do
    expected =
      "sha256=" <>
        Base.encode16(:crypto.mac(:hmac, :sha256, secret, body), case: :lower)

    Plug.Crypto.secure_compare(sig, expected)
  end
end
