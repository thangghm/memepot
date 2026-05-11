# Memepot

Memepot is a local-first Chrome extension for saving, organizing, finding, and copying meme images.

Save a meme while browsing, tag it later, keep your best memes in Pot or HotPot, and copy them quickly when you need them.

## Features

- Save memes from web pages with the right-click context menu.
- Import local image files from the extension popup.
- Keep fresh, untagged memes in Tempot before organizing them.
- Move tagged memes into Pot for long-term use.
- Mark favorite memes as Hot and browse them in HotPot.
- Add up to 4 tags per meme for faster browsing and searching.
- Search saved memes by title, tags, source, and metadata.
- Copy memes back to the clipboard from the popup.
- Move memes to Trash, restore them, or delete them permanently.
- Export and import a backup zip to move your meme library to another device.
- Store meme images and metadata locally on your device.

## Install For Development

Install dependencies from the project root:

```powershell
pnpm install
```

## Build

Build the extension:

```powershell
pnpm build
```

If `pnpm build` fails because pnpm is checking or rebuilding dependencies, run the build steps directly:

```powershell
.\node_modules\.bin\tsc.cmd
.\node_modules\.bin\vite.cmd build
```

The built extension is written to `dist/`.

## Load In Chrome

1. Build the project.
2. Open `chrome://extensions`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select the `dist/` folder.

After loading, pin Memepot from the Chrome extensions menu for quick access.

## Usage

- Right-click an image on a web page and choose the Memepot action to save it.
- Open the popup to review memes in Tempot.
- Add tags to keep a meme and move it into Pot.
- Use HotPot for memes marked as Hot.
- Use search to find memes by tag or text.
- Click a meme card to copy it to the clipboard.
- Use Trash to restore deleted memes or remove them permanently.
- Open Settings to export a backup zip or import one from another device.

## Development Commands

```powershell
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm preview
```

## Privacy

- Memepot stores meme images and metadata locally.
- Backup zips are created locally and contain your saved meme images, tags, metadata, and settings.
- The current version does not require accounts or cloud sync.
- The current version does not upload saved memes for processing.
- If future AI tagging is added, any remote processing should be disclosed clearly in the extension listing and privacy policy.

## License

MIT
