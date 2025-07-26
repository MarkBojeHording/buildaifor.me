import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/chat': {
        target: 'http://localhost:8001',
        changeOrigin: true
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
  },
  esbuild: {
    target: 'es2015',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015',
    },
  },
  define: {
    'process.env.ROLLUP_SKIP_NATIVE': JSON.stringify('true'),
    'process.env.ESBUILD_BINARY_PATH': JSON.stringify(''),
  },
}));
