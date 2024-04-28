const mainDomain = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL).hostname;
const fs = require("fs");
const path = require("path");
const { getEnv } = require("./script/util");
const { getWebConfig } = require("./script/langAuth");

const lang = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "languagePack.json"), "utf-8")
);

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  cacheMaxMemorySize: 500 * 1024 *1024,
  staticPageGenerationTimeout: 60 * 5,
  reactStrictMode: false,
  i18n: {
    // locales: [...new Set(lang.map(item => item.code))],
    locales: ["en", "zh-Hans"],
    // locales: ["zh-CN"],
    defaultLocale: "en",
    localeDetection: false // 禁用自动区域检测
  },
  images: {
    domains: [mainDomain, "secure.gravatar.com", "tailwindui.com"]
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap" // Proxy to Backend
      }
    ];
  }
};

if (getEnv()["NEXT_PUBLIC_MULTI_LANGUAGE"] != 1) {
  nextConfig.i18n.locales = ["en"];
  nextConfig.i18n.defaultLocale = "en";
  nextConfig.i18n.localeDetection = false;
}

/** @type {import("next").NextConfig} */
module.exports = nextConfig;
