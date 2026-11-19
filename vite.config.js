import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" + HashRouter => fonctionne tel quel sur GitHub Pages,
// dans un sous-dossier, ou ouvert depuis un simple serveur statique.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 2048,
  },
});
