# Heavenly Mandate art direction

The visual identity is original mythic pixel art: jade and deep teal panels, restrained gold borders, cream text, and distinct elemental accents. Historical and literary heroes share a fractured celestial world explained by The Broken Mandate story journal.

- Use the existing atlas cells and transparent margins. Export atlases at their approved dimensions; do not replace an atlas with a single illustration.
- Heroes, dragons, equipment and icons use nearest-neighbor sampling. Keep one icon silhouette per function. Do not use generic currency/chest art for unrelated navigation.
- A dragon's flight uses its real atlas frames; position and tail motion supplement those frames. Do not show an entire sheet as one creature.
- Rarity has a stable color and increasing ornamentation. Effects support readable silhouettes and targeting. Limit full-screen flashes and preserve the Reduce Motion and minimal-effects settings.
- Summon results are granted by the game once, then presented together as cards. Animation must never gate reward ownership or require one tap per result. Keep rates and pity visible.
- UI panels preserve usable touch targets and scroll inside their content area. Map zoom affects the scene, not the HUD. Clamp camera bounds to the scene.

`config/art-manifest.json` is the technical atlas contract. Fingerprints establish which images a package contains. They do not certify animation anatomy, aesthetic consistency, or physical-device performance; those require visual review.
