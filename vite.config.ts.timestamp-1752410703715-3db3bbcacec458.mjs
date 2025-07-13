// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://runverse-backend.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        timeout: 6e4,
        // Increased timeout to 60 seconds to prevent socket hang up
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            if (req.method === "OPTIONS") {
              res.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "86400"
              });
              res.end();
              return;
            }
          });
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err.message);
            if (res && !res.headersSent) {
              res.writeHead(500, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
              });
              res.end(JSON.stringify({
                error: "Backend server unavailable",
                message: "The backend service is currently unreachable. Please try again later.",
                code: "PROXY_CONNECTION_FAILED"
              }));
            }
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to Target:", req.method, req.url);
            proxyReq.setHeader("User-Agent", "Lucky Draw App/1.0");
            proxyReq.setHeader("Accept", "application/json");
            if (req.method === "POST" && !proxyReq.getHeader("Content-Type")) {
              proxyReq.setHeader("Content-Type", "application/json");
            }
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from Target:", proxyRes.statusCode, req.url);
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-allow-methods"] = "GET, POST, PUT, DELETE, OPTIONS";
            proxyRes.headers["access-control-allow-headers"] = "Content-Type, Authorization";
            if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
              console.warn(`Backend returned error status: ${proxyRes.statusCode}`);
            }
          });
          proxy.on("proxyReqError", (err, req, res) => {
            console.error("Proxy request error:", err.message);
            if (res && !res.headersSent) {
              res.writeHead(500, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
              });
              res.end(JSON.stringify({
                error: "Connection failed",
                message: "Unable to reach the backend server"
              }));
            }
          });
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9ydW52ZXJzZS1iYWNrZW5kLnZlcmNlbC5hcHAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgsXG4gICAgICAgIHRpbWVvdXQ6IDYwMDAwLCAvLyBJbmNyZWFzZWQgdGltZW91dCB0byA2MCBzZWNvbmRzIHRvIHByZXZlbnQgc29ja2V0IGhhbmcgdXBcbiAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XG4gICAgICAgICAgLy8gSGFuZGxlIE9QVElPTlMgcmVxdWVzdHMgZm9yIENPUlMgcHJlZmxpZ2h0XG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcS5tZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycsXG4gICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uJyxcbiAgICAgICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtTWF4LUFnZSc6ICc4NjQwMCcsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICBwcm94eS5vbignZXJyb3InLCAoZXJyLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Byb3h5IGVycm9yOicsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGlmIChyZXMgJiYgIXJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCwge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6ICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyxcbiAgICAgICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IFxuICAgICAgICAgICAgICAgIGVycm9yOiAnQmFja2VuZCBzZXJ2ZXIgdW5hdmFpbGFibGUnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGUgYmFja2VuZCBzZXJ2aWNlIGlzIGN1cnJlbnRseSB1bnJlYWNoYWJsZS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nLFxuICAgICAgICAgICAgICAgIGNvZGU6ICdQUk9YWV9DT05ORUNUSU9OX0ZBSUxFRCdcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSwgcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VuZGluZyBSZXF1ZXN0IHRvIFRhcmdldDonLCByZXEubWV0aG9kLCByZXEudXJsKTtcbiAgICAgICAgICAgIC8vIFNldCBwcm9wZXIgaGVhZGVycyBmb3IgYmV0dGVyIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignVXNlci1BZ2VudCcsICdMdWNreSBEcmF3IEFwcC8xLjAnKTtcbiAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gRW5zdXJlIENvbnRlbnQtVHlwZSBpcyBzZXQgZm9yIFBPU1QgcmVxdWVzdHNcbiAgICAgICAgICAgIGlmIChyZXEubWV0aG9kID09PSAnUE9TVCcgJiYgIXByb3h5UmVxLmdldEhlYWRlcignQ29udGVudC1UeXBlJykpIHtcbiAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgUmVzcG9uc2UgZnJvbSBUYXJnZXQ6JywgcHJveHlSZXMuc3RhdHVzQ29kZSwgcmVxLnVybCk7XG4gICAgICAgICAgICAvLyBBZGQgQ09SUyBoZWFkZXJzIHRvIHJlc3BvbnNlXG4gICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1vcmlnaW4nXSA9ICcqJztcbiAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW1ldGhvZHMnXSA9ICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJztcbiAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnXSA9ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocHJveHlSZXMuc3RhdHVzQ29kZSAmJiBwcm94eVJlcy5zdGF0dXNDb2RlID49IDQwMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEJhY2tlbmQgcmV0dXJuZWQgZXJyb3Igc3RhdHVzOiAke3Byb3h5UmVzLnN0YXR1c0NvZGV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxRXJyb3InLCAoZXJyLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignUHJveHkgcmVxdWVzdCBlcnJvcjonLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBpZiAocmVzICYmICFyZXMuaGVhZGVyc1NlbnQpIHtcbiAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDAsIHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycsXG4gICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uJyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGVycm9yOiAnQ29ubmVjdGlvbiBmYWlsZWQnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmVhY2ggdGhlIGJhY2tlbmQgc2VydmVyJ1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQyxTQUFTO0FBQUEsUUFDbkIsU0FBUztBQUFBO0FBQUEsUUFDVCxXQUFXLENBQUMsT0FBTyxhQUFhO0FBRTlCLGdCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxRQUFRO0FB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
