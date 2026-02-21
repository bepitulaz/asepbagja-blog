defmodule BlogWeb.FeedController do
  @moduledoc "Serves RSS feeds and the sitemap."
  use BlogWeb, :controller

  @base_url "https://www.asepbagja.com"

  @doc "RSS feed for English posts."
  def rss_en(conn, _params) do
    posts = Blog.Cache.get_all_posts("en") |> Enum.take(20)
    xml = build_rss(posts, "en")

    conn
    |> put_resp_content_type("application/xml")
    |> send_resp(200, xml)
  end

  @doc "RSS feed for Indonesian posts."
  def rss_id(conn, _params) do
    posts = Blog.Cache.get_all_posts("id") |> Enum.take(20)
    xml = build_rss(posts, "id")

    conn
    |> put_resp_content_type("application/xml")
    |> send_resp(200, xml)
  end

  @doc "XML sitemap covering all posts in both languages."
  def sitemap(conn, _params) do
    en_posts = Blog.Cache.get_all_posts("en")
    id_posts = Blog.Cache.get_all_posts("id")
    xml = build_sitemap(en_posts, id_posts)

    conn
    |> put_resp_content_type("application/xml")
    |> send_resp(200, xml)
  end

  defp build_rss(posts, lang) do
    prefix = if lang == "id", do: "id/", else: ""

    items =
      Enum.map_join(posts, "\n", fn post ->
        url = "#{@base_url}/#{prefix}#{post.category}/#{post.slug}"

        """
            <item>
              <title>#{escape_xml(post.title)}</title>
              <link>#{url}</link>
              <guid>#{url}</guid>
              <pubDate>#{Date.to_iso8601(post.date)}</pubDate>
              <description>#{escape_xml(post.summary)}</description>
            </item>
        """
      end)

    """
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Asep Bagja Blog</title>
        <link>#{@base_url}</link>
        <description>Personal blog about code and music</description>
        <language>#{lang}</language>
        <atom:link href="#{@base_url}/#{lang}/feed.xml" rel="self" type="application/rss+xml" />
        #{items}
      </channel>
    </rss>
    """
  end

  defp build_sitemap(en_posts, id_posts) do
    static_urls = [
      {"#{@base_url}/", "weekly", "1.0"},
      {"#{@base_url}/id", "weekly", "0.9"},
      {"#{@base_url}/about", "monthly", "0.7"},
      {"#{@base_url}/discography", "monthly", "0.7"},
      {"#{@base_url}/workspace", "monthly", "0.6"},
      {"#{@base_url}/blog", "daily", "0.8"}
    ]

    static =
      Enum.map_join(static_urls, "\n", fn {loc, freq, priority} ->
        """
          <url>
            <loc>#{loc}</loc>
            <changefreq>#{freq}</changefreq>
            <priority>#{priority}</priority>
          </url>
        """
      end)

    en =
      Enum.map_join(en_posts, "\n", fn post ->
        """
          <url>
            <loc>#{@base_url}/#{post.category}/#{post.slug}</loc>
            <lastmod>#{Date.to_iso8601(post.date)}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
          </url>
        """
      end)

    id =
      Enum.map_join(id_posts, "\n", fn post ->
        """
          <url>
            <loc>#{@base_url}/id/#{post.category}/#{post.slug}</loc>
            <lastmod>#{Date.to_iso8601(post.date)}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
          </url>
        """
      end)

    """
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    #{static}
    #{en}
    #{id}
    </urlset>
    """
  end

  defp escape_xml(text) do
    text
    |> String.replace("&", "&amp;")
    |> String.replace("<", "&lt;")
    |> String.replace(">", "&gt;")
    |> String.replace("\"", "&quot;")
    |> String.replace("'", "&apos;")
  end
end
