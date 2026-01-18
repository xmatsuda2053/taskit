import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [viteSingleFile(), tsconfigPaths()],
  build: {
    target: "es2020",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    minify: true,
    rollupOptions: {
      input: "./taskit.html",
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
});
