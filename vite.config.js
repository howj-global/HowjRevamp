import { rm, readdir } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite copies everything under public/ into dist/ verbatim. public/gallery/
// holds per-country subfolders of raw camera originals (India/ alone is ~187MB)
// that the site never requests: scripts/sync-gallery.mjs only walks the TOP
// level of public/gallery/, so nothing inside those subfolders can ever reach
// gallery.json. Shipping them added ~190MB to a shared-hosting upload for files
// no visitor loads. This prunes them from the build output only — public/ and
// git are untouched, so the originals stay exactly where they are.
function pruneGallerySubfolders() {
  return {
    name: 'prune-gallery-subfolders',
    apply: 'build',
    async closeBundle() {
      const galleryDir = path.resolve(__dirname, 'dist', 'gallery')
      let entries
      try {
        entries = await readdir(galleryDir, { withFileTypes: true })
      } catch {
        return // no gallery dir in this build
      }
      for (const entry of entries.filter((e) => e.isDirectory())) {
        await rm(path.join(galleryDir, entry.name), { recursive: true, force: true })
        console.log(`[prune-gallery] removed unreferenced dist/gallery/${entry.name}/`)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pruneGallerySubfolders()],
  server: {
    // Respect an externally assigned port (e.g. from preview tooling); Vite ignores PORT by default
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  build: {
    outDir: 'dist',
  },
})
