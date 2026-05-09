# Project name: Memepot
## Description: **Memepot** is a lightweight Chrome extension that works as a personal meme library, meme inbox, and quick meme retrieval tool. Users save memes from the web or local files, organize with minimal friction, search by title/tags/category/notes, and copy memes as images for use in chat, comments, and social platforms.

## Tech Stack

| Layer | Technology |
|---|---|
| Extension platform | Chrome Extension Manifest V3 |
| Language | TypeScript |
| UI framework | React |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Internal database | IndexedDB via Dexie.js |
| Settings storage | chrome.storage.local |
| Image processing | Canvas API / createImageBitmap |
| Clipboard | Clipboard API |
| Package manager | pnpm |

## Structure

```
├── CLAUDE.md
└── 01-share-docs/ -> Shared documentation (to avoid misunderstanding)
```

## Shared docs

- /01-share-docs/ARCHITECTURE.md
- /01-share-docs/DATABASE.md
- /01-share-docs/PROJECT-RULES.md
- /01-share-docs/MEMEPOT_PROJECT_SPEC.md
