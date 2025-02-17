import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/register-company": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path,
      },
      // Adicione outros endpoints da API, se necessário
    },
  },
});
