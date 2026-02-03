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
    sourcemap: false,
    minify: "esbuild",
    target: "es2022",
    cssMinify: true,
    cssCodeSplit: true,

    // Otimizações de bundle
    rollupOptions: {
      treeshake: true,
      output: {
        // Code-splitting otimizado por categoria
        manualChunks: (id) => {
          if (id.includes("/cartuchos/")) return "plano-data";
          if (id.includes("/core/services/")) return "core-services";
          if (id.includes("/ui/components/")) return "ui-components";
          if (id.includes("/core/types/")) return "types";
        },
        // Nomenclatura com hash curto
        entryFileNames: "assets/[name]-[hash:8].js",
        chunkFileNames: "assets/[name]-[hash:8].js",
        assetFileNames: "assets/[name]-[hash:8][extname]",
      },
    },

    // Inline assets < 4KB
    assetsInlineLimit: 4096,

    // Avisar se chunk > 500KB
    chunkSizeWarningLimit: 500,
  },

  // CSS
  css: {
    devSourcemap: true,
  },
});
