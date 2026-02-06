import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Configuração para servir arquivos estáticos
  root: ".",

  // Configuração do servidor de desenvolvimento
  server: {
    port: 5173,
    open: true,
    host: true,
  },

  // Configuração para TypeScript com tree-shaking
  esbuild: {
    target: "es2022",
    treeShaking: true,
  },

  // Permitir importações de arquivos .ts com alias
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  // Configuração de build otimizada para produção
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "esbuild",
    target: "es2022",
    cssMinify: true,
    cssCodeSplit: false,

    rollupOptions: {
      treeshake: true,
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("/cartuchos/")) return "plano-data";
          if (id.includes("/core/services/")) return "core-services";
          if (id.includes("/ui/components/")) return "ui-components";
          if (id.includes("/core/types/")) return "types";
        },
        entryFileNames: "assets/main.js",
        chunkFileNames: "assets/[name]-[hash:8].js",
        assetFileNames: "assets/[name]-[hash:8][extname]",
      },
    },

    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
  },

  // CSS
  css: {
    devSourcemap: true,
  },
});
