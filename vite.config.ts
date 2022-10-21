import path from "path";
import uni from "@dcloudio/vite-plugin-uni";
import viteEslint from "@nabla/vite-plugin-eslint";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), viteEslint()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "@components": path.resolve("./src/components/"),
      "@api": path.resolve("./src/api/index.ts"),
      "@enums": path.resolve("./src/enums/"),
      "@utils": path.resolve("./src/utils/"),
    },
  },
});
