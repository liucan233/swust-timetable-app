import path from "path";
import uni from "@dcloudio/vite-plugin-uni";
import viteEslint from "vite-plugin-eslint";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), viteEslint()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "@components": path.resolve("./src/components/"),
    },
  },
});
