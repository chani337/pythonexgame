import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Auto-update so returning users pick up new deploys instead of being
      // stuck on a stale cached build.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'PyQuests | 코딩 마스터 지름길',
        short_name: 'PyQuests',
        description: 'Python·SQL·Java·JS 코딩 문제를 풀고 브라우저에서 바로 실행해보는 코딩 학습 사이트',
        theme_color: '#1a1a1a',
        background_color: '#fafafa',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // App shell only. Supabase calls need live data and are deliberately
        // absent from runtimeCaching below, so they always hit the network.
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],

        // public/pyodide/ must stay OUT of the precache. The glob above would
        // otherwise pick up pyodide.js and pyodide.asm.js (1.17MB) while
        // skipping pyodide.asm.wasm (9.62MB) and python_stdlib.zip (2.23MB)
        // because those extensions aren't listed -- a partial precache that
        // costs every first-time visitor 1.2MB and saves nobody anything,
        // including the majority who never open a Python screen.
        // Same reasoning for sql-js/: the glob above matches sql-wasm.js
        // (46KB) but not sql-wasm.wasm (658KB), so precaching it would charge
        // every first-time visitor for the loader while leaving the part that
        // matters to a runtime fetch anyway.
        // splash/ is 24 iOS launch screens (134KB). iOS reads them when the
        // app is added to the home screen and at launch -- the running app
        // never requests one -- so precaching them would charge every visitor
        // for bytes only iOS home-screen users ever need.
        globIgnores: ['pyodide/**', 'sql-js/**', 'splash/**'],

        // 9.62MB wasm is over Workbox's 2MB default. This only affects
        // precaching, which pyodide is excluded from, but leaving the default
        // in place would silently drop the file if the ignore above were ever
        // removed -- better to have the limit match reality.
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,

        runtimeCaching: [
          {
            // Pyodide core + any package wheel, cached on first actual use
            // rather than precached. A returning student doesn't re-download
            // the 13MB runtime (or the 35MB numpy/pandas wheels if they got
            // that far). jsDelivr sends access-control-allow-origin: * so
            // these come back as real 200s, not opaque responses.
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/pyodide\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pyodide-cdn-v0.26.2',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
          {
            // The self-hosted fallback copy, same deal.
            urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith('/pyodide/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'pyodide-self-hosted-v0.26.2',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // sql.js from the CDN. A separate route from the Pyodide one
            // because the paths don't share a prefix (/npm/sql.js@... vs
            // /pyodide/...), and keeping the cache names versioned means a
            // version bump doesn't serve stale wasm.
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/sql\.js@/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'sqljs-cdn-v1.14.2',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // The self-hosted sql.js fallback.
            urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith('/sql-js/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'sqljs-self-hosted-v1.14.2',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Pretendard's dynamic subset: one small woff2 per unicode-range
            // block, fetched as the page shows those syllables. Versioned in
            // the URL (@v1.3.9), so a long cache is safe.
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/gh\/orioncactus\/pretendard@/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pretendard-v1.3.9',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Font files change ~never; the stylesheet that references them
            // is revalidated instead so a family swap isn't stuck for a year.
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
        ],
      },
    }),
  ],
})
