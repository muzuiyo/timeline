import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: [
          'https://bgm.tv/user/*/timeline',
          'https://bangumi.tv/user/*/timeline',
          'https://chii.in/user/*/timeline'
        ],
      },
    }),
  ],
});
