import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './src'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  
  // Development server config
  server: {
    port: 3000,
    open: true,
    host: true, // Allow access from mobile devices on same network
  },
  
  // Build config
  build: {
    outDir: 'dist',
    sourcemap: true,
    
    // Optimize for mobile
    target: 'es2020',
    minify: 'esbuild',
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  
  // Preview server (for testing builds)
  preview: {
    port: 3001,
  },
  
  // Environment variables
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
});
