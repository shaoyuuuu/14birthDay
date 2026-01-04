import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    host: "0.0.0.0",
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  base: "/14birthDay/", // 设置为GitHub仓库名称，确保GitHub Pages部署时资源正确加载
});
