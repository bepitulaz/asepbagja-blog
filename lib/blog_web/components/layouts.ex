defmodule BlogWeb.Layouts do
  @moduledoc """
  This module holds layouts and related functionality
  used by your application.
  """
  use BlogWeb, :html

  # Embed all files in layouts/* within this module.
  # The default root.html.heex file contains the HTML
  # skeleton of your application, namely HTML headers
  # and other static content.
  embed_templates "layouts/*"

  @doc """
  Renders the app layout with branding header, floating nav, and footer.

  ## Examples

      <Layouts.app flash={@flash}>
        <h1>Content</h1>
      </Layouts.app>

  """
  attr :flash, :map, required: true, doc: "the map of flash messages"
  attr :lang, :string, default: "en", doc: "current language (en or id)"

  attr :current_scope, :map,
    default: nil,
    doc: "the current [scope](https://hexdocs.pm/phoenix/scopes.html)"

  slot :inner_block, required: true

  def app(assigns) do
    ~H"""
    <%!-- Branding header --%>
    <div class="container mx-auto pt-5 pb-2">
      <h1 class="font-archivo text-6xl sm:text-7xl lg:text-9xl text-gray-900 dark:text-white text-center tracking-tight">
        ASEP BAGJA
      </h1>
      <h2 class="font-archivo text-xl sm:text-2xl lg:text-4xl text-gray-700 dark:text-neutral-300 text-center">
        Code &amp; Music
      </h2>
    </div>

    <%!-- Floating sticky nav --%>
    <header class="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-lg md:my-5">
      <nav class="mt-4 relative max-w-2xl w-full bg-white border border-gray-200 rounded-[2rem] mx-2 py-2.5 md:flex md:items-center md:justify-between md:py-0 md:px-4 md:mx-auto dark:bg-neutral-900 dark:border-neutral-700">
        <%!-- Logo and mobile toggle --%>
        <div class="px-4 md:px-0 flex justify-between items-center">
          <a
            class="rounded-md text-xl font-bold text-gray-800 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="/"
          >
            asep.bagja
          </a>
          <%!-- Mobile hamburger toggle (CSS-only via checkbox) --%>
          <label
            for="nav-toggle"
            class="md:hidden cursor-pointer flex justify-center items-center size-8 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle navigation"
          >
            <svg
              class="size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </label>
        </div>

        <%!-- Hidden checkbox that drives mobile toggle --%>
        <input type="checkbox" id="nav-toggle" class="peer hidden" />

        <%!-- Nav links --%>
        <div class="hidden peer-checked:flex md:flex flex-col md:flex-row md:items-center md:justify-end gap-1 md:gap-2 mt-3 md:mt-0 pb-3 md:pb-0 px-4 md:px-0 md:ps-7">
          <a
            class={[
              "py-1.5 md:py-3 px-4 md:px-2 border-s-2 md:border-s-0 md:border-b-2 border-transparent",
              "text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200",
              "transition-colors rounded-md md:rounded-none"
            ]}
            href={if @lang == "id", do: "/id/diskografi", else: "/discography"}
          >
            discography
          </a>
          <a
            class={[
              "py-1.5 md:py-3 px-4 md:px-2 border-s-2 md:border-s-0 md:border-b-2 border-transparent",
              "text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200",
              "transition-colors rounded-md md:rounded-none"
            ]}
            href={if @lang == "id", do: "/id/blog", else: "/blog"}
          >
            blog
          </a>
          <a
            class={[
              "py-1.5 md:py-3 px-4 md:px-2 border-s-2 md:border-s-0 md:border-b-2 border-transparent",
              "text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200",
              "transition-colors rounded-md md:rounded-none"
            ]}
            href={if @lang == "id", do: "/id/tentang", else: "/about"}
          >
            about
          </a>
        </div>
      </nav>
    </header>

    <%!-- Main content --%>
    <main class="flex-1">
      {render_slot(@inner_block)}
    </main>

    <%!-- Footer --%>
    <footer class="bg-emerald-300 dark:bg-emerald-900 mt-auto w-full py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-5">
        <div>
          <a class="text-xl font-semibold text-black dark:text-white hover:underline" href="/">
            asep.bagja
          </a>
        </div>
        <div class="text-left md:text-center text-sm text-gray-800 dark:text-emerald-100">
          <p>All rights reserved &copy; 2014-{Date.utc_today().year} Asep Bagja Priandana</p>
        </div>
        <div class="md:text-end flex md:justify-end gap-4">
          <%!-- X/Twitter --%>
          <a
            href="https://x.com/bepitulaz"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-800 dark:text-emerald-100 hover:text-black dark:hover:text-white transition-colors"
            aria-label="X / Twitter"
          >
            <svg
              class="size-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </svg>
          </a>
          <%!-- GitHub --%>
          <a
            href="https://github.com/bepitulaz"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-800 dark:text-emerald-100 hover:text-black dark:hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <svg
              class="size-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 0C5.37 0 0 5.506 0 12.303c0 5.445 3.435 10.043 8.205 11.674.6.107.825-.262.825-.585 0-.292-.015-1.261-.015-2.291C6 21.67 5.22 20.346 4.98 19.654c-.135-.354-.72-1.446-1.23-1.738-.42-.23-1.02-.8-.015-.815.945-.015 1.62.892 1.845 1.261 1.08 1.86 2.805 1.338 3.495 1.015.105-.8.42-1.338.765-1.645-2.67-.308-5.46-1.37-5.46-6.075 0-1.338.465-2.446 1.23-3.307-.12-.308-.54-1.569.12-3.26 0 0 1.005-.323 3.3 1.26.96-.276 1.98-.415 3-.415s2.04.139 3 .416c2.295-1.6 3.3-1.261 3.3-1.261.66 1.691.24 2.952.12 3.26.765.861 1.23 1.953 1.23 3.307 0 4.721-2.805 5.767-5.475 6.075.435.384.81 1.122.81 2.276 0 1.645-.015 2.968-.015 3.383 0 .323.225.707.825.585a12.047 12.047 0 0 0 5.919-4.489A12.536 12.536 0 0 0 24 12.304C24 5.505 18.63 0 12 0Z"
              />
            </svg>
          </a>
          <%!-- Patreon --%>
          <a
            href="https://patreon.com/bepitulaz"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-800 dark:text-emerald-100 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Patreon"
          >
            <svg
              class="size-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>

    <.flash_group flash={@flash} />
    """
  end

  @doc """
  Shows the flash group with standard titles and content.

  ## Examples

      <.flash_group flash={@flash} />
  """
  attr :flash, :map, required: true, doc: "the map of flash messages"
  attr :id, :string, default: "flash-group", doc: "the optional id of flash container"

  def flash_group(assigns) do
    ~H"""
    <div id={@id} aria-live="polite">
      <.flash kind={:info} flash={@flash} />
      <.flash kind={:error} flash={@flash} />

      <.flash
        id="client-error"
        kind={:error}
        title={gettext("We can't find the internet")}
        phx-disconnected={show(".phx-client-error #client-error") |> JS.remove_attribute("hidden")}
        phx-connected={hide("#client-error") |> JS.set_attribute({"hidden", ""})}
        hidden
      >
        {gettext("Attempting to reconnect")}
        <.icon name="hero-arrow-path" class="ml-1 size-3 motion-safe:animate-spin" />
      </.flash>

      <.flash
        id="server-error"
        kind={:error}
        title={gettext("Something went wrong!")}
        phx-disconnected={show(".phx-server-error #server-error") |> JS.remove_attribute("hidden")}
        phx-connected={hide("#server-error") |> JS.set_attribute({"hidden", ""})}
        hidden
      >
        {gettext("Attempting to reconnect")}
        <.icon name="hero-arrow-path" class="ml-1 size-3 motion-safe:animate-spin" />
      </.flash>
    </div>
    """
  end
end
