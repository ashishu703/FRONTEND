import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Get API base URL from env or default to localhost:4500
  // If env points to port 3000 (frontend port), use 4500 (backend port) instead
  let apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:4500'
  if (apiBaseUrl.includes(':3000')) {
    apiBaseUrl = apiBaseUrl.replace(':3000', ':4500')
    console.log(`[Vite Config] Detected frontend port in API URL, redirecting to backend: ${apiBaseUrl}`)
  }
  
  return {
    plugins: [react()],
    css: {
      postcss: './src/config/postcss.config.js',
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Proxying request:', req.method, req.url, 'to', apiBaseUrl);
            });
          },
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  }
})
