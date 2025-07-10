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
        timeout: 60000, // Increased timeout to 60 seconds to prevent socket hang up
        configure: (proxy, _options) => {
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
            proxyReq.setHeader('Connection', 'keep-alive');
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from Target:', proxyRes.statusCode, req.url);
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