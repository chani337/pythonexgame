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
        // Pyodide is loaded from a CDN and Supabase calls need live data;
        // neither should be precached or intercepted by the service worker.
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
