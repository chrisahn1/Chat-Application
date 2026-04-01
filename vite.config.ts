import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure base is set to "/" or your specific sub-path
  build: {
    outDir: 'dist', // Ensure this matches the 'distDir' in vercel.json if specified
  },
  // server: {
  //   historyApiFallback: true, // Crucial for handling refreshes in development
  // },
});
