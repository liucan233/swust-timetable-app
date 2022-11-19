import path from "path";
import uni from "@dcloudio/vite-plugin-uni";
import viteEslint from "@nabla/vite-plugin-eslint";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), viteEslint()],
  resolve: {
    alias: {
      "@src": path.resolve("./src"),
      "@components": path.resolve("./src/components/"),
      "@api": path.resolve("./src/api/"),
      "@lib": path.resolve("./src/lib/"),
      "@enums": path.resolve("./src/enums/"),
      "@utils": path.resolve("./src/utils/"),
      "@static": path.resolve("./src/static/"),
      "@toast": path.resolve("./src/components/Toast/"),
    },
  },
});
