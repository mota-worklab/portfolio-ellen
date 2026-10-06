import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // three.js fica num chunk próprio, carregado só perto da seção 3D.
  build: { chunkSizeWarningLimit: 700 },
});
