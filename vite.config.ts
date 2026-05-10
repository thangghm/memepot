import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = (...segments: string[]) => path.join(__dirname, 'dist', ...segments);
const packageJson = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf8')) as {
  version: string;
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'extension-setup',
      closeBundle() {
        // Copy manifest to dist root
        copyFileSync(path.join(__dirname, 'manifest.json'), dist('manifest.json'));

        // Copy icons
        const iconsSrc = path.join(__dirname, 'assets', 'icons');
        const iconsDest = dist('assets', 'icons');
        mkdirSync(iconsDest, { recursive: true });
        for (const f of readdirSync(iconsSrc)) {
          copyFileSync(path.join(iconsSrc, f), path.join(iconsDest, f));
        }

        // Copy popup and options HTML from dist/src/ to dist/ and fix relative paths
        const htmlRelocations: Array<{ from: string; to: string; depth: number }> = [
          { from: dist('src', 'popup', 'index.html'), to: dist('popup', 'index.html'), depth: 2 },
          { from: dist('src', 'options', 'index.html'), to: dist('options', 'index.html'), depth: 2 },
        ];
        for (const { from, to, depth } of htmlRelocations) {
          mkdirSync(path.dirname(to), { recursive: true });
          let content = readFileSync(from, 'utf8');
          // Fix paths: move from dist/src/popup/ to dist/popup/
          // e.g. "../../chunks/..." → "../chunks/..." (one less level up needed)
          const up = '../'.repeat(depth);
          const upNew = '../'.repeat(depth - 1);
          content = content.replace(new RegExp(up.replace(/\//g, '\\/'), 'g'), upNew);
          writeFileSync(to, content);
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
        options: 'src/options/index.html',
        'background/index': 'src/background/index.ts',
        'content/index': 'src/content/index.ts',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
