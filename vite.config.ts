import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        version: '1.0.0',
        remotes: {
          customer: `${env.VITE_CUSTOMER_REMOTE || 'https://customer-management-ashen.vercel.app'}/assets/remoteEntry.js`,
          orders: `${env.VITE_ORDERS_REMOTE || 'http://localhost:3002'}/assets/remoteEntry.js`,
          analytics: `${env.VITE_ANALYTICS_REMOTE || 'http://localhost:3003'}/assets/remoteEntry.js`,
          admin: `${env.VITE_ADMIN_REMOTE || 'http://localhost:3004'}/assets/remoteEntry.js`,
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: '^18.0.0',
          },
          'react-dom': {
            singleton: true,
            eager: true,
            requiredVersion: '^18.0.0',
          },
          'react-router-dom': {
            singleton: true,
            eager: true,
            requiredVersion: '^6.0.0',
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'esnext',
      modulePreload: { polyfill: false },
    },
  };
});
