import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command, isPreview }) => ({
  base:
    process.env.VITE_BASE ??
    (command === "build" || isPreview ? "/portfolio-fe/" : "/"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
}))
