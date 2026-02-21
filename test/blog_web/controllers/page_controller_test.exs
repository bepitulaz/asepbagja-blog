defmodule BlogWeb.PageControllerTest do
  use BlogWeb.ConnCase

  test "GET / renders English homepage", %{conn: conn} do
    conn = get(conn, ~p"/")
    assert html_response(conn, 200) =~ "ASEP BAGJA"
  end

  test "GET /id renders Indonesian homepage", %{conn: conn} do
    conn = get(conn, ~p"/id")
    assert html_response(conn, 200) =~ "ASEP BAGJA"
  end

  test "GET /about renders about page", %{conn: conn} do
    conn = get(conn, ~p"/about")
    assert html_response(conn, 200) =~ "About"
  end
end
