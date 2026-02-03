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

  // Configuração de build com code-splitting
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "esbuild",
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk para dados do plano (lazy loaded)
          "plano-data": ["./src/cartuchos/plano_cronologico.ts"],
          // Chunk para serviços core
          core: ["./src/core/services/tempo/geradorDatas.ts"],
        },
        // Nomenclatura clara dos chunks
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
