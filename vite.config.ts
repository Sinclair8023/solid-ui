import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'path';
import eslintPlugin from 'vite-plugin-eslint';

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}
export default defineConfig({
  plugins: [solidPlugin(),/** eslintPlugin() */],
  server: {
    port: 4000,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: pathResolve('src') + '/',
      }
    ]
  }
});
