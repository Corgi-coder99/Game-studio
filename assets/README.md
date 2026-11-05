# Pixel art — Thiên Mệnh

Original images generated with the session's image-generation tool for this project. They depict legendary and historical figures using a shared 16-bit pixel-art direction, rather than copying an existing game's illustrations.

- `heroes-pixel.png`: 4 columns × 2 rows. Top row: Tôn Ngộ Không, Quan Vũ, Na Tra, Gia Cát Lượng. Bottom row: Dương Tiễn, Triệu Vân, Trư Bát Giới, Điêu Thuyền. `spriteStyle` in app.mjs selects a tile using percentage background positions. Keep this order aligned with game.mjs.
- `hulao-pixel.png`: twilight Hổ Lao Quan environment; shared by the banner, summon stage and battlefield.
- `city-pixel.png`: original AI-generated transparent 3×2 isometric building atlas. Top: Đại điện, Nông trang, Xưởng gỗ. Bottom: Mỏ đá, Doanh trại, Điện linh long. Canvas draws each tile without altering the source PNG. Version 2 embeds it in the offline script.

These are static sprites/portraits and a background. The live map animates troops and distinct skill effects using canvas; it does not have full-body character frame animations. All four images are embedded as data URIs by build-offline.mjs, so the Windows HTML remains self-contained and does not request images from the network.

- `battle-units-pixel.png`: original transparent 4×2 full-body battle sprite atlas, using the same character order/identities as the portrait atlas. Generated from that reference with the image tool. Canvas applies bob/lunge movement and spells; this is not a multi-frame animation sheet.

V4/V5 original image-generation assets:

- `roster-a-pixel.png`, `roster-b-pixel.png`: 6×4 each, characters indices 8–31 and 32–55 in characters.mjs.
- `celestial-pets-pixel.png`: 5×2. Top: Hongjun, Yuanshi, Taishang, Lingbao, Haotian. Bottom: Qilin, Phoenix, Tiger, Tortoise, Pixiu.
- `pets-awakened-pixel.png`: 5×1, awakened five-star forms in the same pet order.
- `skills-pixel.png`: 4×4 skill icons; staff/crescent/fire/formation, eye/spear/quake/moon, heal/shield/thunder/arrows, swords/void/time/phoenix.

All nine PNG files are embedded in the current offline HTML. Images are original generated static art, not extracted from Infinity Kingdom. Skill icons are shared by corresponding weapon/effect families; each ability has its own name, description and rank.

- `castle-skins-pixel.png`: original 3×2 RGBA castle atlas, refined with the image editing tool for cutout alpha. Top: bamboo sanctuary, tortoise fortress, phoenix palace (quest skins). Bottom: cloud heaven, abyss dragon, primordial cosmos (VIP13/14/15 only). Player hall, regional map and siege use these sprites. All ten PNGs are embedded once using browser-local Blob URLs in the offline bundle.
