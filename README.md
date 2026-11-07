# Thien Menh — Pixel Kingdom

An offline-first pixel strategy game with city building, three independent world armies, turn-based combat, and a separate 999-floor Inferno Tower. The game interface is in Vietnamese; repository documentation and new code comments use English.

## Current version

This branch contains the current playable version: larger touch controls, a stable mobile viewport, bounded map zoom, a touch-friendly formation editor, animated elemental dragons, and three consecutive tower encounters per floor. Surviving heroes keep their HP between encounters. See [current release notes](docs/current-release.md).

Only one current desktop package is maintained. Historical downloads, screenshots, unused atlases, and outdated native packages have been removed from the current tree. Previous commits remain available in Git history.

## Play on iPhone or iPad

The complete Safari installation site is generated in `docs/`. Once GitHub Pages is enabled, open:

https://corgi-coder99.github.io/Game-studio/

In Safari, choose **Share → Add to Home Screen**, open the new icon while connected to Wi-Fi, and download the game until the offline-ready message appears. The game uses a landscape layout on every phone size, rotating its frame when the device is held upright. The Home Screen app provides the fullscreen experience when Safari does not support the Fullscreen API. The initial download is approximately 74 MiB. Subsequent solo sessions can run offline. Back up saves through Studio before clearing browser storage.

The repository owner must select **Settings → Pages → Deploy from a branch → main → /docs**. Pages availability depends on repository visibility and plan; this README does not imply that hosting is enabled. Safari does not provide this game's Bluetooth multiplayer.

## Download for desktop

Download [Thien-Menh-Windows.zip](Thien-Menh-Windows.zip), extract it, and open `Thien-Menh.html` in Chrome or Edge. The package also includes Windows launchers and an optional standard-library Python server. Direct HTML play requires neither Node.js nor Python.

## Develop and build

Requires Node.js 22 or newer; packaging requires Python 3. No npm dependencies are required.

```sh
npm test
npm run dev
npm run build:web
python3 package-windows.py
```

- `npm run dev`: development server at port 3000.
- `npm run build:offline`: standalone HTML plus an ignored native WebView bundle.
- `npm run build:web`: rebuilds the offline bundle and the complete GitHub Pages site, including integrity metadata and the service worker.
- `python3 package-windows.py`: replaces the single current desktop ZIP.

Keep `assets/` as the editable source assets and `docs/` as the generated hosting output. Both are required for the current source-and-Pages workflow. Tests, build scripts, launchers, and system design notes support maintenance and save compatibility.

## Native mobile projects

Android and iOS source projects remain under [`mobile/`](mobile/README.md). Outdated APK and iOS project ZIP downloads have been removed. Rebuild from current sources before distributing a native app. iOS installation requires Apple signing and an appropriate build/distribution workflow; the repository is not an installable IPA. See [iPhone distribution options](mobile/IOS-DISTRIBUTION.md) for Home Screen installation, TestFlight, and hosted macOS builds.

## Validation and limitations

245 automated checks passed for the current gameplay and web-cache contracts. Touch layouts were exercised in Chromium mobile emulation in landscape and portrait; desktop, offline launch, cache repair, and restart persistence were also checked. Physical iPhone Safari and Bluetooth hardware have not been validated. Windows BAT launchers have not been run on Windows; the iOS project has not been compiled with Xcode.

## Repository policy

Use `main` for the completed release and `codex/thien-menh-offline` for ongoing work. Update `main` only when the user authorizes a release. Maintain one current download, remove obsolete generated packages and unused files, and keep README links aligned with the current tree. Preserve Vietnamese player-facing text. Never commit signing keys, credentials, saves, or local build caches.
