# Game assets

This directory contains the original pixel atlases currently embedded by `build-offline.mjs`, plus the Safari application icon used by `build-web.mjs`.

The build scripts define the active asset lists. Source assets are retained here; `docs/assets/` is the generated copy required by GitHub Pages. Native build copies are ignored by Git. Removed legacy atlases remain recoverable from Git history.

When replacing an atlas, preserve its grid contract or update the corresponding renderer, CSS, and build lists together. Regenerate offline and web outputs and validate the resulting cache hashes.
