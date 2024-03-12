import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { readFileSync } from 'fs';

// because __dirname was showing undefined
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: readFileSync('localhost.key'),
      cert: readFileSync('localhost.crt'),
    },
  },
})