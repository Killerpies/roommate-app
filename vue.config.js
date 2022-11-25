const { defineConfig } = require("@vue/cli-service");
const SitemapPlugin = require("sitemap-webpack-plugin").default;
// You can write the paths as an array of strings or an array of objects
const paths = [
  {
    path: "/",
    lastmod: "2022-11-22",
    priority: 1.0,
    changefreq: "yearly",
  },
];

module.exports = defineConfig({
  configureWebpack: {
    plugins: [new SitemapPlugin({ base: "https://roommateapp.org", paths })],
  },
  transpileDependencies: true,
  devServer: {
    proxy: "http://localhost:8080",
  },
});
