import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  root: "site",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
