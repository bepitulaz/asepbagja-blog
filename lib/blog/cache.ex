defmodule Blog.Cache do
  @moduledoc "ETS-backed cache for blog posts, comments, and pages."

  @doc "Initialise all ETS tables. Must be called once before any put/get calls."
  def init do
    tables = [:blog_posts, :blog_posts_by_category, :blog_comments, :blog_pages]

    Enum.each(tables, fn table ->
      if :ets.whereis(table) == :undefined do
        :ets.new(table, [:named_table, :public, read_concurrency: true])
      end
    end)
  end

  @doc "Insert a %Blog.Post{} into the cache and update the by-category index."
  @spec put_post(Blog.Post.t()) :: true
  def put_post(%Blog.Post{} = post) do
    :ets.insert(:blog_posts, {{post.lang, post.slug}, post})

    existing = get_posts_by_category(post.lang, post.category)
    posts = [post | existing] |> Enum.uniq_by(& &1.slug) |> Enum.sort_by(& &1.date, {:desc, Date})
    :ets.insert(:blog_posts_by_category, {{post.lang, post.category}, posts})
  end

  @doc "Look up a single post by language and slug. Returns nil if not found."
  @spec get_post(String.t(), String.t()) :: Blog.Post.t() | nil
  def get_post(lang, slug) do
    case :ets.lookup(:blog_posts, {lang, slug}) do
      [{_, post}] -> post
      [] -> nil
    end
  end

  @doc "Return all posts for a given language and category, sorted by date descending."
  @spec get_posts_by_category(String.t(), String.t()) :: [Blog.Post.t()]
  def get_posts_by_category(lang, category) do
    case :ets.lookup(:blog_posts_by_category, {lang, category}) do
      [{_, posts}] -> posts
      [] -> []
    end
  end

  @doc "Return all posts for a given language, sorted by date descending."
  @spec get_all_posts(String.t()) :: [Blog.Post.t()]
  def get_all_posts(lang) do
    :ets.select(:blog_posts, [{{{lang, :_}, :"$1"}, [], [:"$1"]}])
    |> Enum.sort_by(& &1.date, {:desc, Date})
  end

  @doc "Store a list of comments for a given language and post slug."
  @spec put_comments(String.t(), String.t(), [Blog.Comment.t()]) :: true
  def put_comments(lang, slug, comments) do
    :ets.insert(:blog_comments, {{lang, slug}, comments})
  end

  @doc "Return comments for a given language and slug, sorted by date ascending."
  @spec get_comments(String.t(), String.t()) :: [Blog.Comment.t()]
  def get_comments(lang, slug) do
    case :ets.lookup(:blog_comments, {lang, slug}) do
      [{_, comments}] -> comments
      [] -> []
    end
  end

  @doc "Store arbitrary page data (about, music, workspace) keyed by type and language."
  @spec put_page(atom(), String.t(), any()) :: true
  def put_page(type, lang, data) do
    :ets.insert(:blog_pages, {{type, lang}, data})
  end

  @doc "Retrieve page data by type and language. Returns nil if not found."
  @spec get_page(atom(), String.t()) :: any() | nil
  def get_page(type, lang) do
    case :ets.lookup(:blog_pages, {type, lang}) do
      [{_, data}] -> data
      [] -> nil
    end
  end

  @doc "Remove all entries from every cache table."
  def clear_all do
    :ets.delete_all_objects(:blog_posts)
    :ets.delete_all_objects(:blog_posts_by_category)
    :ets.delete_all_objects(:blog_comments)
    :ets.delete_all_objects(:blog_pages)
  end
end
