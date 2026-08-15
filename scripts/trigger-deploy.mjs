#!/usr/bin/env node
/**
 * Trigger a Netlify rebuild so Notion edits go live.
 *
 * Notion content is fetched at BUILD time, not on page load, so editing Notion
 * changes nothing on the site until a build runs. This POSTs to the Netlify
 * build hook to start one.
 *
 * Usage:  npm run deploy
 *
 * Needs NETLIFY_BUILD_HOOK in .env (gitignored — the hook URL is a secret:
 * anyone holding it can trigger builds). Create one at
 * Netlify → Project configuration → Build & deploy → Build hooks.
 *
 * Build hooks only accept POST; opening the URL in a browser does nothing.
 */

import https from 'node:https'

const HOOK = process.env.NETLIFY_BUILD_HOOK

if (!HOOK) {
  console.error(`
[deploy] NETLIFY_BUILD_HOOK is not set.

  Add this line to .env (no quotes):
    NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/xxxxxxxx

  Get the URL from Netlify → Project configuration → Build & deploy → Build hooks.
`)
  process.exit(1)
}

if (!/^https:\/\/api\.netlify\.com\/build_hooks\/\w+/.test(HOOK)) {
  console.error(`[deploy] That doesn't look like a Netlify build hook URL:\n  ${HOOK.slice(0, 45)}…`)
  process.exit(1)
}

console.log('[deploy] Triggering a Netlify build…')

const req = https.request(HOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
  res.resume()
  if (res.statusCode >= 200 && res.statusCode < 300) {
    console.log(`[deploy] ✓ Build started (HTTP ${res.statusCode}).`)
    console.log('[deploy]   It re-fetches Notion, so any published edits go live in ~2-3 minutes.')
    console.log('[deploy]   Watch progress: Netlify → Deploys')
  } else {
    console.error(`[deploy] ✗ Netlify returned HTTP ${res.statusCode} — check the hook URL is current.`)
    process.exitCode = 1
  }
})

req.on('error', (err) => {
  console.error(`[deploy] ✗ Could not reach Netlify: ${err.message}`)
  process.exitCode = 1
})

req.end('{}')
