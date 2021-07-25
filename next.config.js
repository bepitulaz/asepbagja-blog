const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX({
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  i18n: {
    locales: ["en-GB"],
    defaultLocale: "en-GB",
  },
  images: {
    domains: [
      "images.unsplash.com",
      "letsencrypt.org", 
      "upload.wikimedia.org",
      "cdn.hackaday.io",
      "raw.githubusercontent.com",
    ],
  },
})
