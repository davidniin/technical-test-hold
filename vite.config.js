import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173
  },
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:8080'),
    __WS_URL__: JSON.stringify(process.env.VITE_WS_URL || 'http://localhost:8080/notifications')
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.js']
  }
});
