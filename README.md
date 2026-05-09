# Memepot

Fast local meme pot for Chrome. Save images, tag the good ones, copy them back when the chat needs seasoning.

Memepot keeps your meme library local-first with IndexedDB. Tempot catches new memes, Pot keeps tagged memes, and HotPot keeps the ones you decide are hot.

## What It Does

- **ImPOT** images from your computer or save images from the browser context menu.
- **Tempot** holds new untagged memes and auto-clears them every 48 hours.
- **Pot** displays tagged memes and supports search plus sorting.
- **HotPot** displays memes marked with **Make it Hot**.
- **Copy** any meme back to your clipboard in one click.
- **Kick** memes to Trash when they are no longer useful.
- **Settings** lets you control grid size, tag visibility, close-after-copy, and activation.

## Product Rules

- Tag a Tempot meme to keep it longer.
- Pot only shows memes with tags.
- HotPot only shows memes you marked as **Make it Hot**.
- Search automatically switches the view to Pot.
- Grid size changes how many memes are shown per row.

## Development

```bash
pnpm install
pnpm run dev
pnpm run typecheck
pnpm run lint
pnpm run build
```

Load `dist/` as an unpacked extension in Chrome after running a production build.

## Project Structure

- `src/app/` - popup UI, routes, pages, hooks, and components.
- `src/features/` - feature logic for memes, import, clipboard, search, settings, and license.
- `src/background/` - extension service worker, context menu, and runtime messages.
- `src/shared/` - shared types, constants, utilities, errors, and Dexie schema.
- `assets/icons/` - extension icons copied into `dist/`.

## Status

Memepot is an early local-first Chrome extension. Advanced features such as AI auto-tagging, OCR tagging, and semantic search are planned behind activation.

---

# Memepot Tiếng Việt

Chiếc nồi meme nhanh gọn cho Chrome. Lưu ảnh, gắn tag cho meme đáng giữ, rồi copy lại khi cuộc trò chuyện cần thêm gia vị.

Memepot ưu tiên lưu trữ cục bộ bằng IndexedDB. Tempot giữ meme mới, Pot giữ meme đã gắn tag, còn HotPot giữ những meme bạn đánh dấu là hot.

## Memepot Làm Gì

- **ImPOT** ảnh từ máy hoặc lưu ảnh bằng menu chuột phải trong trình duyệt.
- **Tempot** chứa meme mới chưa gắn tag và tự dọn sau mỗi 48 giờ.
- **Pot** hiển thị meme đã gắn tag, có tìm kiếm và sắp xếp.
- **HotPot** hiển thị meme được đánh dấu **Make it Hot**.
- **Copy** meme về clipboard chỉ với một lần bấm.
- **Kick** meme vào Trash khi không còn cần dùng.
- **Settings** cho phép chỉnh kích thước grid, hiển thị tag, tự đóng sau khi copy, và kích hoạt tính năng.

## Luật Của Sản Phẩm

- Hãy gắn tag meme trong Tempot nếu muốn giữ lâu hơn.
- Pot chỉ hiển thị meme đã có tag.
- HotPot chỉ hiển thị meme bạn đã đánh dấu **Make it Hot**.
- Khi nhập từ khóa tìm kiếm, giao diện tự chuyển sang Pot.
- Grid size thay đổi số lượng meme hiển thị trên mỗi hàng.

## Phát Triển

```bash
pnpm install
pnpm run dev
pnpm run typecheck
pnpm run lint
pnpm run build
```

Sau khi build production, load thư mục `dist/` vào Chrome dưới dạng unpacked extension.

## Cấu Trúc Dự Án

- `src/app/` - giao diện popup, routes, pages, hooks, và components.
- `src/features/` - logic tính năng cho memes, import, clipboard, search, settings, và license.
- `src/background/` - service worker, context menu, và runtime messages của extension.
- `src/shared/` - types, constants, utilities, errors, và Dexie schema dùng chung.
- `assets/icons/` - icon của extension được copy vào `dist/`.

## Trạng Thái

Memepot đang ở giai đoạn đầu của một Chrome extension local-first. Các tính năng nâng cao như AI auto-tagging, OCR tagging, và semantic search được lên kế hoạch phía sau activation.
