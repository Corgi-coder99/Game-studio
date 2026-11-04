# Pixel art — Thiên Mệnh

Original images generated with the session's image-generation tool for this project. They depict legendary and historical figures using a shared 16-bit pixel-art direction, rather than copying an existing game's illustrations.

- `heroes-pixel.png`: 4 columns × 2 rows. Top row: Tôn Ngộ Không, Quan Vũ, Na Tra, Gia Cát Lượng. Bottom row: Dương Tiễn, Triệu Vân, Trư Bát Giới, Điêu Thuyền. `spriteStyle` in app.mjs selects a tile using percentage background positions. Keep this order aligned with game.mjs.
- `hulao-pixel.png`: twilight Hổ Lao Quan environment; shared by the banner, summon stage and battlefield.

These are static portraits and an environment background, not animated sprites. Pixel.css uses image-rendering: pixelated. Both images are embedded as data URIs by build-offline.mjs, so the Windows HTML remains self-contained and does not request images from the network.
