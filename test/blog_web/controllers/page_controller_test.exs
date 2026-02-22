defmodule BlogWeb.PageControllerTest do
  use BlogWeb.ConnCase

  test "GET / returns 200 with branding", %{conn: conn} do
    conn = get(conn, ~p"/")
    assert html_response(conn, 200) =~ "ASEP BAGJA"
  end

  test "GET /id returns 200", %{conn: conn} do
    conn = get(conn, ~p"/id")
    assert html_response(conn, 200) =~ "ASEP BAGJA"
  end

  test "GET /about returns 200", %{conn: conn} do
    conn = get(conn, ~p"/about")
    assert html_response(conn, 200) =~ "About"
  end

  test "GET /id/tentang returns 200", %{conn: conn} do
    conn = get(conn, ~p"/id/tentang")
    assert html_response(conn, 200) =~ "About"
  end

  test "GET /discography returns 200", %{conn: conn} do
    conn = get(conn, ~p"/discography")
    assert html_response(conn, 200) =~ "Discography"
  end

  test "GET /id/diskografi returns 200", %{conn: conn} do
    conn = get(conn, ~p"/id/diskografi")
    assert html_response(conn, 200) =~ "Discography"
  end
end
