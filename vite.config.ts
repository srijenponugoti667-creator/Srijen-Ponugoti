import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function fallbackFirebaseConfig() {
  const fallbackJson = JSON.stringify({
    projectId: "zealous-pod-b09p9",
    appId: "1:426745217281:web:7be49039d080abd3d2db00",
    apiKey: "AIzaSyBSRvsaXbQqWbDGyjoS7Z7L8Kb77KxZZwo",
    authDomain: "zealous-pod-b09p9.firebaseapp.com",
    firestoreDatabaseId: "ai-studio-justicebridge-03ec9cd8-429b-4eed-b01c-7a64e5b3dffd",
    storageBucket: "zealous-pod-b09p9.firebasestorage.app",
    messagingSenderId: "426745217281",
    measurementId: "",
    oAuthClientId: "426745217281-9h9u405822hdseuq8bcdom3go4ku5g08.apps.googleusercontent.com",
    recaptchaSiteKey: ""
  }, null, 2);

  return {
    name: 'fallback-firebase-config',
    resolveId(id: string) {
      if (id.endsWith('firebase-applet-config.json')) {
        const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
        if (!fs.existsSync(configPath)) {
          return '\0virtual:firebase-applet-config.json';
        }
      }
      return null;
    },
    load(id: string) {
      if (id === '\0virtual:firebase-applet-config.json') {
        return fallbackJson;
      }
      return null;
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      fallbackFirebaseConfig(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'JusticeBridge Legal Engine',
          short_name: 'JusticeBridge',
          description: 'Bridging lawyers. Empowering clients. Reducing delays. Legal directory, voice case filing, and advocate grading platform.',
          theme_color: '#7f1d1d',
          background_color: '#09090b',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 3000000,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
