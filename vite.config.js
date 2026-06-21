import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base so the build works under any GitHub Pages repo path
  // (e.g. https://user.github.io/<repo>/) without hardcoding the repo name.
  base: "./",
  plugins: [react()],
  server: { port: 5173, open: true },
});
