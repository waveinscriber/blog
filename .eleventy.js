import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
}

export const config = {
  pathPrefix: process.env.PATH_PREFIX || "",
  dir: {
    input: "src",
    includes: "_includes",
    output: "_site",
  },
  templateFormats: ["md", "njk", "html"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dataTemplateEngine: "njk",
};
