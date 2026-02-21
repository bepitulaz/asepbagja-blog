defmodule BlogWeb.FeedHTML do
  @moduledoc "Templates for FeedController (RSS and sitemap)."
  use BlogWeb, :html

  embed_templates "feed_html/*"
end
