# Asset and audio credits

All game artwork is original project artwork generated for Heavenly Mandate. No Infinity Kingdom, Võ Lâm, or other commercial-game assets are bundled.

The four-world-boss atlas (`assets/world-bosses-pixel.png`) contains original Black Dragon, Nine-Tailed Fox, Black Tortoise and Demon Lord sprites with idle, attack and empowered poses. The exclusive-item atlas includes the original Return-to-City Command seal. Title frame borders are original pixel-style SVG designs embedded in CSS.

All current sound effects and background motifs are synthesized locally with the Web Audio API using the original recipes in `config/feedback.json`. No recorded third-party audio or music files are included, and no external audio services are used. Audio starts only after a user gesture and can be disabled or adjusted in Settings.

## Pixel font

VT323, copyright 2011 The VT323 Project Authors, is bundled under the SIL Open Font License 1.1. The unmodified font is `assets/fonts/VT323-Regular.ttf`; its full license is `assets/fonts/OFL-VT323.txt`. Source: https://github.com/google/fonts/tree/main/ofl/vt323. The build embeds the font locally; no Google Fonts connection is used at runtime. Coverage for ạ, ế, ữ, ơ, ư and đ was verified against the font character map.

The Golden Warring Kingdoms palette and rules follow the project owner's supplied Style Bible v1.0. Rendering adapters and the 640×360 lineup are project code. Existing original PNG atlases remain intact; the game applies palette mapping during rendering rather than claiming all sprites have been hand-redrawn.
