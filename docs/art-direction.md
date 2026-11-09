# Detailed Celestial Pixel art direction

The owner-approved Sun Wukong reference and coherent art sheet supersede the
previous restrictive Style Bible. The game uses deliberate pixel clusters,
dark contours, expressive chibi heroes, warm gold and crimson architecture,
jade foliage and upper-left lighting. Different elements retain distinct hues.

All 32 production PNG atlases were replaced, together with the application icon.
The inventory icon mapping was reviewed against the replacement sheet. Existing
hero IDs, rarity, equipment, formations and save data are preserved. Building
and character cell order remains aligned with the current renderers. The
continent map now clips the new regional terrain into the three territories
instead of using the old high-contrast stripe fill.

Source colors and transparency are preserved. There is no whole-image palette
conversion, 360-pixel world postprocess or integer-scale letterboxing. Pixel art
uses nearest-neighbor sampling; interface text remains readable system text,
with a local pixel font retained for canvas labels. UI colors are tokens, not
a limit on the colors allowed in source images.

`art/reference-release.json` records every old and new atlas fingerprint, grid,
transparency requirement and generated source filename. `config/art-manifest.json`
records reviewed image dimensions and download budgets. `npm run check:art`
validates PNG checksums and synchronizes production fingerprints. Rebuild player,
web and native outputs after editing an atlas. Never copy old generated textures
back over the editable source.

The replacement graphics were generated from the approved art direction.
Animation sheets contain distinct generated poses; they are not claimed to be
hand-animated or equivalent to a full skeletal character animation system.
Existing motion, timing, reduced-motion and quality settings remain available.

English captions are audited across all major screens, image accessibility
labels, placeholders and tooltips. Legacy save identifiers and player-written
names/messages are intentionally retained. Chromium desktop and touch emulation
do not replace physical iPhone/Safari or native Android device testing.
