import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const assets = [
  { src: 'manifest.json', dest: 'dist/manifest.json' },
  { src: 'assets/icons', dest: 'dist/assets/icons' },
  { src: '_locales', dest: 'dist/_locales' },
];

function logCopy(src, dest) {
  console.log(`Copied ${relative(root, src)} -> ${relative(root, dest)}`);
}

function copyDirectory(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const file of readdirSync(src)) {
    const sourcePath = join(src, file);
    const targetPath = join(dest, file);

    if (statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    copyFileSync(sourcePath, targetPath);
    logCopy(sourcePath, targetPath);
  }
}

for (const { src, dest } of assets) {
  const fullSrc = join(root, src);
  const fullDest = join(root, dest);

  if (src.includes('.')) {
    mkdirSync(dirname(fullDest), { recursive: true });
    copyFileSync(fullSrc, fullDest);
    logCopy(fullSrc, fullDest);
  } else {
    copyDirectory(fullSrc, fullDest);
  }
}
