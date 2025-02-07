import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/leaflet-draw/dist/images/*', 
          dest: 'images', 
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl',
      'leaflet-draw/dist/images': '/images', 
    },
  },
  optimizeDeps: {
    exclude: ['react-map-gl'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});