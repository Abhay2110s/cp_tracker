import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import https from 'node:https'
import http from 'node:http'

// Forward /api/proxy?url=<target> to the remote host server-side.
// Uses node:https directly (not the global fetch, which Vite intercepts)
// so requests actually leave the process. Replace this with a real
// backend / Supabase Edge Function for production.
function proxyRequest(targetUrl, res, depth = 0) {
  if (depth > 5) {
    res.statusCode = 502
    res.end(JSON.stringify({ error: 'Too many redirects' }))
    return
  }
  const url = new URL(targetUrl)
  const lib = url.protocol === 'http:' ? http : https
  const req = lib.request(
    targetUrl,
    {
      method: 'GET',
      headers: { 'user-agent': 'cp-tracker-dev-proxy' },
    },
    (upstream) => {
      if ([301, 302, 303, 307, 308].includes(upstream.statusCode) && upstream.headers.location) {
        upstream.resume()
        const next = new URL(upstream.headers.location, targetUrl).toString()
        proxyRequest(next, res, depth + 1)
        return
      }
      let body = ''
      upstream.setEncoding('utf8')
      upstream.on('data', (c) => (body += c))
      upstream.on('end', () => {
        res.setHeader('access-control-allow-origin', '*')
        res.setHeader(
          'content-type',
          upstream.headers['content-type'] || 'application/json'
        )
        res.statusCode = upstream.statusCode || 502
        res.end(body)
      })
    }
  )
  req.on('error', (err) => {
    res.statusCode = 502
    res.setHeader('access-control-allow-origin', '*')
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ error: String(err) }))
  })
  req.end()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/proxy')) {
          return next()
        }
        const target = new URL(req.url, 'http://localhost').searchParams.get('url')
        if (!target) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Missing url parameter' }))
          return
        }
        proxyRequest(target, res)
      })
    },
  },
})
