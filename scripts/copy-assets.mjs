import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const assets = [
  { src: 'manifest.json', dest: 'dist/manifest.json' },
  { src: 'assets/icons', dest: 'dist/assets/icons' },
];

for (const { src, dest } of assets) {
  const fullSrc = join(root, src);
  const fullDest = join(root, dest);

  if (src.includes('.')) {
    mkdirSync(dirname(fullDest), { recursive: true });
    copyFileSync(fullSrc, fullDest);
    console.log(`Copied ${src} → ${dest}`);
  } else {
    mkdirSync(fullDest, { recursive: true });
    for (const f of readdirSync(fullSrc)) {
      copyFileSync(join(fullSrc, f), join(fullDest, f));
      console.log(`Copied ${src}/${f} → ${dest}/${f}`);
    }
  }
}