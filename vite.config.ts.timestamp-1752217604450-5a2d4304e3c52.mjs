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
        timeout: 6e4,
        // Increased timeout to 60 seconds to prevent socket hang up
        configure: (proxy, _options) => {
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
            proxyReq.setHeader("Connection", "keep-alive");
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from Target:", proxyRes.statusCode, req.url);
            if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
              console.warn(`Backend returned error status: ${proxyRes.statusCode}`);
            }
          });
          proxy.on("proxyReqError", (err, req, res) => {
            console.error("Proxy request error:", err.message);
            if (res && !res.headersSent) {
              res.writeHead(500, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9ydW52ZXJzZS1iYWNrZW5kLnZlcmNlbC5hcHAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgdGltZW91dDogNjAwMDAsIC8vIEluY3JlYXNlZCB0aW1lb3V0IHRvIDYwIHNlY29uZHMgdG8gcHJldmVudCBzb2NrZXQgaGFuZyB1cFxuICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcbiAgICAgICAgICBwcm94eS5vbignZXJyb3InLCAoZXJyLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Byb3h5IGVycm9yOicsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGlmIChyZXMgJiYgIXJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCwge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6ICdHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TJyxcbiAgICAgICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24nLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IFxuICAgICAgICAgICAgICAgIGVycm9yOiAnQmFja2VuZCBzZXJ2ZXIgdW5hdmFpbGFibGUnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGUgYmFja2VuZCBzZXJ2aWNlIGlzIGN1cnJlbnRseSB1bnJlYWNoYWJsZS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nLFxuICAgICAgICAgICAgICAgIGNvZGU6ICdQUk9YWV9DT05ORUNUSU9OX0ZBSUxFRCdcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSwgcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VuZGluZyBSZXF1ZXN0IHRvIFRhcmdldDonLCByZXEubWV0aG9kLCByZXEudXJsKTtcbiAgICAgICAgICAgIC8vIFNldCBwcm9wZXIgaGVhZGVycyBmb3IgYmV0dGVyIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignVXNlci1BZ2VudCcsICdMdWNreSBEcmF3IEFwcC8xLjAnKTtcbiAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignQ29ubmVjdGlvbicsICdrZWVwLWFsaXZlJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVzJywgKHByb3h5UmVzLCByZXEsIF9yZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBSZXNwb25zZSBmcm9tIFRhcmdldDonLCBwcm94eVJlcy5zdGF0dXNDb2RlLCByZXEudXJsKTtcbiAgICAgICAgICAgIGlmIChwcm94eVJlcy5zdGF0dXNDb2RlICYmIHByb3h5UmVzLnN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihgQmFja2VuZCByZXR1cm5lZCBlcnJvciBzdGF0dXM6ICR7cHJveHlSZXMuc3RhdHVzQ29kZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXFFcnJvcicsIChlcnIsIHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdQcm94eSByZXF1ZXN0IGVycm9yOicsIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGlmIChyZXMgJiYgIXJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCwge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGVycm9yOiAnQ29ubmVjdGlvbiBmYWlsZWQnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmVhY2ggdGhlIGJhY2tlbmQgc2VydmVyJ1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVM7QUFBQTtBQUFBLFFBQ1QsV0FBVyxDQUFDLE9BQU8sYUFBYTtBQUM5QixnQkFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEtBQUssUUFBUTtBQUNuQyxvQkFBUSxJQUFJLGdCQUFnQixJQUFJLE9BQU87QUFDdkMsZ0JBQUksT0FBTyxDQUFDLElBQUksYUFBYTtBQUMzQixrQkFBSSxVQUFVLEtBQUs7QUFBQSxnQkFDakIsZ0JBQWdCO0FBQUEsZ0JBQ2hCLCtCQUErQjtBQUFBLGdCQUMvQixnQ0FBZ0M7QUFBQSxnQkFDaEMsZ0NBQWdDO0FBQUEsY0FDbEMsQ0FBQztBQUNELGtCQUFJLElBQUksS0FBSyxVQUFVO0FBQUEsZ0JBQ3JCLE9BQU87QUFBQSxnQkFDUCxTQUFTO0FBQUEsZ0JBQ1QsTUFBTTtBQUFBLGNBQ1IsQ0FBQyxDQUFDO0FBQUEsWUFDSjtBQUFBLFVBQ0YsQ0FBQztBQUVELGdCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTO0FBQzVDLG9CQUFRLElBQUksOEJBQThCLElBQUksUUFBUSxJQUFJLEdBQUc7QUFFN0QscUJBQVMsVUFBVSxjQUFjLG9CQUFvQjtBQUNyRCxxQkFBUyxVQUFVLFVBQVUsa0JBQWtCO0FBQy9DLHFCQUFTLFVBQVUsY0FBYyxZQUFZO0FBQUEsVUFDL0MsQ0FBQztBQUVELGdCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTO0FBQzVDLG9CQUFRLElBQUksa0NBQWtDLFNBQVMsWUFBWSxJQUFJLEdBQUc7QUFDMUUsZ0JBQUksU0FBUyxjQUFjLFNBQVMsY0FBYyxLQUFLO0FBQ3JELHNCQUFRLEtBQUssa0NBQWtDLFNBQVMsVUFBVSxFQUFFO0FBQUEsWUFDdEU7QUFBQSxVQUNGLENBQUM7QUFFRCxnQkFBTSxHQUFHLGlCQUFpQixDQUFDLEtBQUssS0FBSyxRQUFRO0FBQzNDLG9CQUFRLE1BQU0sd0JBQXdCLElBQUksT0FBTztBQUNqRCxnQkFBSSxPQUFPLENBQUMsSUFBSSxhQUFhO0FBQzNCLGtCQUFJLFVBQVUsS0FBSztBQUFBLGdCQUNqQixnQkFBZ0I7QUFBQSxnQkFDaEIsK0JBQStCO0FBQUEsY0FDakMsQ0FBQztBQUNELGtCQUFJLElBQUksS0FBSyxVQUFVO0FBQUEsZ0JBQ3JCLE9BQU87QUFBQSxnQkFDUCxTQUFTO0FBQUEsY0FDWCxDQUFDLENBQUM7QUFBQSxZQUNKO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
