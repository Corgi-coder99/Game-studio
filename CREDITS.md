# Asset and audio credits

All game artwork is original project artwork generated for Heavenly Mandate. No Infinity Kingdom, Võ Lâm, or other commercial-game assets are bundled.

The four-world-boss atlas (`assets/world-bosses-pixel.png`) contains original Black Dragon, Nine-Tailed Fox, Black Tortoise and Demon Lord sprites with idle, attack and empowered poses. The exclusive-item atlas includes the original Return-to-City Command seal. Title frame borders are original pixel-style SVG designs embedded in CSS.

All current sound effects and background motifs are synthesized locally with the Web Audio API using the original recipes in `config/feedback.json`. No recorded third-party audio or music files are included, and no external audio services are used. Audio starts only after a user gesture and can be disabled or adjusted in Settings.

## Pixel font

VT323, copyright 2011 The VT323 Project Authors, is bundled under the SIL Open Font License 1.1. The unmodified font is `assets/fonts/VT323-Regular.ttf`; its full license is `assets/fonts/OFL-VT323.txt`. Source: https://github.com/google/fonts/tree/main/ofl/vt323. The build embeds the font locally; no Google Fonts connection is used at runtime. Coverage for ạ, ế, ữ, ơ, ư and đ was verified against the font character map.

The version-16 art release replaces all 32 production atlases and the application icon with newly generated images following the project owner's approved detailed Sun Wukong pixel-art reference. They are generated original project assets, not manually redrawn sprites. Source RGBA colors are preserved. Visual theme ramps remain interface tokens only; no palette mapping or 640 x 360 postprocess is applied to the images. See `art/reference-release.json` for the replacement record.
