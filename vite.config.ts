import { defineConfig } from "vite";

export default defineConfig({
  // Configuração para servir arquivos estáticos
  root: ".",

  // Configuração do servidor de desenvolvimento
  server: {
    port: 5173,
    open: true,
    host: true,
  },

  // Configuração para TypeScript
  esbuild: {
    target: "es2022",
  },

  // Permitir importações de arquivos .ts
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
});
