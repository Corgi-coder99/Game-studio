# Heavenly Mandate art direction

The visual identity is original mythic pixel art: jade and deep teal panels, restrained gold borders, cream text, and distinct elemental accents. Historical and literary heroes share a fractured celestial world explained by The Broken Mandate story journal.

- Use the existing atlas cells and transparent margins. Export atlases at their approved dimensions; do not replace an atlas with a single illustration.
- Heroes, dragons, equipment and icons use nearest-neighbor sampling. Keep one icon silhouette per function. Do not use generic currency/chest art for unrelated navigation.
- A dragon's flight uses its real atlas frames; position and tail motion supplement those frames. Do not show an entire sheet as one creature.
- Rarity has a stable color and increasing ornamentation. Effects support readable silhouettes and targeting. Limit full-screen flashes and preserve the Reduce Motion and minimal-effects settings.
- Summon results are granted by the game once, then presented together as cards. Animation must never gate reward ownership or require one tap per result. Keep rates and pity visible.
- UI panels preserve usable touch targets and scroll inside their content area. Map zoom affects the scene, not the HUD. Clamp camera bounds to the scene.

`config/art-manifest.json` is the technical atlas contract. Fingerprints establish which images a package contains. They do not certify animation anatomy, aesthetic consistency, or physical-device performance; those require visual review.

## Shared interface theme

The final shared theme in `design.css` owns `--ui-*` tokens: deep jade surfaces, cream text, muted blue-gray secondary text and antique gold borders. Legacy theme variables alias these tokens. Body controls use the same system font stack; major scene headings use Georgia. Geometry, uniform viewport scaling, map bounds and touch targets remain owned by the existing layout rules.

Buttons share a raised jade surface; selected tabs and primary actions use gold with dark text. Disabled actions dim, keyboard focus uses a cyan outline, and hover never becomes necessary to understand an action. Reports use jade panels rather than the previous pale parchment, with distinct allied/enemy HP and victory/defeat colors. Existing navigation atlas images are preserved; theme rules must not replace their background images or sprite coordinates. Item rarity and elemental colors remain independent semantic accents.

This standardizes interface chrome, not the anatomy or animation of every hero, dragon or environment. Atlas replacement still follows the technical contract above.
