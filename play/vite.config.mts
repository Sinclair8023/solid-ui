import { defineConfig, loadEnv } from 'vite';
import Inspect from 'vite-plugin-inspect';
import mkcert from 'vite-plugin-mkcert';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@use "/styles/custom.scss" as *;`,
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    server: {
      port: 3000,
      host: true,
      https: !!env.HTTPS ? {} : false,
    },
    build: {
      sourcemap: true,
    },
    plugins: [solidPlugin(), mkcert(), Inspect()],
  };
});
