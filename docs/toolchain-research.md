# Pixel art and game toolchain research

Reviewed upstream README and license files on 2026-11-08. No third-party editor code, sample art, or engine binary is bundled into this game.

| Project | Upstream license | Fit for this game |
| --- | --- | --- |
| [Pixelorama](https://github.com/Orama-Interactive/Pixelorama) | MIT | Recommended external art editor. Supports layered animation, onion skinning, spritesheets, PNG/GIF export and command-line export automation. Keep editable projects outside the player package and export approved PNG atlases. |
| [Godot](https://github.com/godotengine/godot) | MIT | A complete engine with 2D tooling and native export. A possible future native port, not a drop-in synchronization plugin for the existing JavaScript save/combat engine. A port requires equivalent save rules, mobile input and hardware verification. |
| [LDtk](https://github.com/deepnight/ldtk) | MIT | Useful for authored 2D levels and structured map data. The current isometric city/world renderer does not consume LDtk projects; adding it now would create a second map source. |
| [LibreSprite](https://github.com/LibreSprite/LibreSprite) | GPL-2.0 | An alternative external sprite editor. Do not incorporate its program code into this game without complying with its license. Check separate licenses for any imported art. |

## Implemented synchronization path

`build-manifest.mjs` is the single production module/texture list used by the preview server and both offline/native builders. Developer-only modules are excluded. `config/art-manifest.json` records approved atlas dimensions and size budgets; `art/current-atlases.json` records actual SHA-256 fingerprints.

1. Edit an original atlas in Pixelorama, preserving frame order, transparent padding and the renderer's existing grid. Export an 8-bit RGB/RGBA PNG.
2. Run `node tools/art-pipeline.mjs import dragon-flight-pixel.png /path/to/export.png`. Only approved production atlas names are accepted. Invalid format, dimensions or excessive size fail before replacing the asset.
3. Run `npm run check:art`, then rebuild offline, web and Windows packages. These share the exact source PNGs. Inspect actual motion and cropping on desktop and phone; a checksum cannot establish visual quality.
4. Commit the atlas, manifest fingerprints and rebuilt current packages together. Do not ship editor backups, unused exports, or old packages.

Import validates technical contracts; it does not automatically draw missing frames, write a coherent story or judge animation quality. Do not treat a repository installation as completed art direction. A renderer grid/frame-layout change still needs a deliberate code change and visual review.
