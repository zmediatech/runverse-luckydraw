import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://runverse-backend.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        timeout: 60000, // Increased timeout to 60 seconds to prevent socket hang up
        configure: (proxy, _options) => {
          // Handle OPTIONS requests for CORS preflight
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (req.method === 'OPTIONS') {
              res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
              });
              res.end();
              return;
            }
          });
          
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err.message);
            if (res && !res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              });
              res.end(JSON.stringify({ 
                error: 'Backend server unavailable',
                message: 'The backend service is currently unreachable. Please try again later.',
                code: 'PROXY_CONNECTION_FAILED'
              }));
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to Target:', req.method, req.url);
            // Set proper headers for better compatibility
            proxyReq.setHeader('User-Agent', 'Lucky Draw App/1.0');
            proxyReq.setHeader('Accept', 'application/json');
            
            // Ensure Content-Type is set for POST requests
            if (req.method === 'POST' && !proxyReq.getHeader('Content-Type')) {
              proxyReq.setHeader('Content-Type', 'application/json');
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from Target:', proxyRes.statusCode, req.url);
            // Add CORS headers to response
            proxyRes.headers['access-control-allow-origin'] = '*';
            proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization';
            
            if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
              console.warn(`Backend returned error status: ${proxyRes.statusCode}`);
            }
          });
          
          proxy.on('proxyReqError', (err, req, res) => {
            console.error('Proxy request error:', err.message);
            if (res && !res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              });
              res.end(JSON.stringify({
                error: 'Connection failed',
                message: 'Unable to reach the backend server'
              }));
            }
          });
        },
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});