defmodule Blog.Cache do
  @moduledoc """
  ETS-backed read cache for blog content.

  All reads bypass the GenServer entirely via direct ETS lookups.
  `Blog.Content` (the GenServer) is the sole writer to these tables.

  Tables:
  - `:blog_posts`            key: `{lang, slug}`        value: `%Post{}`
  - `:blog_posts_by_category` key: `{lang, category}`   value: `[%Post{}]` (date desc)
  - `:blog_comments`         key: `{lang, slug}`        value: `[%Comment{}]` (date asc)
  - `:blog_pages`            key: `{type, lang}`        value: any (about html, music/workspace maps)
  """

  @tables [:blog_posts, :blog_posts_by_category, :blog_comments, :blog_pages]

  @doc "Creates all ETS tables. Called by Blog.Content on startup."
  def init_tables do
    Enum.each(@tables, fn name ->
      if :ets.info(name) == :undefined do
        :ets.new(name, [:named_table, :set, :public, read_concurrency: true])
      end
    end)
  end

  # ── Posts ──────────────────────────────────────────────────────────────────

  @doc "Fetches a single post by language and slug."
  @spec get_post(String.t(), String.t()) :: Blog.Post.t() | nil
  def get_post(lang, slug) do
    case :ets.lookup(:blog_posts, {lang, slug}) do
      [{_key, post}] -> post
      [] -> nil
    end
  end

  @doc "Returns all posts for a language, sorted by date descending."
  @spec list_posts(String.t()) :: [Blog.Post.t()]
  def list_posts(lang) do
    :ets.match_object(:blog_posts, {{lang, :_}, :_})
    |> Enum.map(fn {_key, post} -> post end)
    |> Enum.sort_by(& &1.date, {:desc, Date})
  end

  @doc "Returns posts for a language + category, sorted by date descending."
  @spec list_posts_by_category(String.t(), String.t()) :: [Blog.Post.t()]
  def list_posts_by_category(lang, category) do
    case :ets.lookup(:blog_posts_by_category, {lang, category}) do
      [{_key, posts}] -> posts
      [] -> []
    end
  end

  @doc "Inserts or replaces a post."
  @spec put_post(Blog.Post.t()) :: true
  def put_post(post) do
    :ets.insert(:blog_posts, {{post.lang, post.slug}, post})
  end

  @doc "Rebuilds the by-category index. Call after all posts are inserted."
  @spec rebuild_category_index([Blog.Post.t()]) :: :ok
  def rebuild_category_index(posts) do
    :ets.delete_all_objects(:blog_posts_by_category)

    posts
    |> Enum.group_by(fn p -> {p.lang, p.category} end)
    |> Enum.each(fn {{lang, category}, group} ->
      sorted = Enum.sort_by(group, & &1.date, {:desc, Date})
      :ets.insert(:blog_posts_by_category, {{lang, category}, sorted})
    end)

    :ok
  end

  # ── Comments ───────────────────────────────────────────────────────────────

  @doc "Returns comments for a post, sorted by date ascending."
  @spec get_comments(String.t(), String.t()) :: [Blog.Comment.t()]
  def get_comments(lang, slug) do
    case :ets.lookup(:blog_comments, {lang, slug}) do
      [{_key, comments}] -> comments
      [] -> []
    end
  end

  @doc "Inserts or replaces comments for a post."
  @spec put_comments(String.t(), String.t(), [Blog.Comment.t()]) :: true
  def put_comments(lang, slug, comments) do
    :ets.insert(:blog_comments, {{lang, slug}, comments})
  end

  # ── Pages (about, music, workspace) ───────────────────────────────────────

  @doc "Fetches a page by type and language. Type is an atom like :about, :music, :workspace."
  @spec get_page(atom(), String.t()) :: any() | nil
  def get_page(type, lang) do
    case :ets.lookup(:blog_pages, {type, lang}) do
      [{_key, value}] -> value
      [] -> nil
    end
  end

  @doc "Stores a page value."
  @spec put_page(atom(), String.t(), any()) :: true
  def put_page(type, lang, value) do
    :ets.insert(:blog_pages, {{type, lang}, value})
  end
end
