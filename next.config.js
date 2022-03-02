const nextTranslate = require("next-translate");
const { readFromFileSystem } = require("./aliases");

module.exports = nextTranslate({
  swcMinify: true,
  reactStrictMode: true,
  i18n: {
    locales: ["en", "id"],
    defaultLocale: "en",
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
  // This function will redirect the old blog urls to the new urls
  async redirects() {
    const enPosts = await readFromFileSystem("en");
    const idPosts = await readFromFileSystem("id");

    // Join all post array
    const posts = enPosts.concat(idPosts);

    // Mapping the aliases to the redirect schema
    const aliases = posts
      .map((post) => {
        if (post.metadata?.aliases?.length > 0) {
          return {
            source: post.metadata.aliases,
            destination: `/${post.metadata.categories[0].toLowerCase()}/${
              post.slug
            }`,
            permanent: true,
          };
        } else {
          return null;
        }
      })
      .flat()
      .filter((alias) => alias !== null);

    // Mutating the array to the correct form
    const paths = [];
    for (const alias of aliases) {
      for (const source of alias.source) {
        paths.push({
          source,
          destination: alias.destination,
          permanent: true,
        });
      }
    }

    return paths;
  },
});
