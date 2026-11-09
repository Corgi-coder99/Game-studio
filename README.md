# Thien Menh — Pixel Kingdom

Version 16 replaces all 32 production art atlases and the application icon with the approved detailed Celestial Pixel style. Source colors remain intact; the previous palette filter and fixed 360-pixel world postprocess are removed. The interface, captions, help and download instructions use English. See [art direction and scope](docs/art-direction.md).

Version 14 added visible formation recommendations, a replayable beginner guide, mobile army/profile layout repairs, icon-based summon controls with animated card reveals, Daily Attendance Legacy progression, cleaner map labels and a server-owned shared-world preview.

Run `npm run start:online` for the local account server. See [online deployment and scope](online/README.md) and [planning budget](docs/online-budget.md). This server is not publicly deployed; GitHub Pages remains the solo preview. Native store packages are not signed or published.

An offline-first pixel strategy game with city building, three independent world armies, turn-based combat, and a separate 999-floor Inferno Tower. Game names, new screens, repository documentation and new code comments use English. Player captions use an English presentation catalog; legacy save identifiers remain compatible.

## Offline edition for a one-time mobile purchase

The game now includes fourteen main-story objectives, chapter dialogue and real tower-act transitions, capacity-safe story rewards, daily player-initiated Offline Hunts, English native dialogs, earned Legacy ranks, an in-game privacy/help page, and local recovery snapshots. Existing saves migrate without losing progress. See the [paid-edition implementation and store proposal](store/README.md).

Android App Bundle generation is implemented and structurally validated with Google's bundletool. It is unsigned and not a published paid app. iOS remains source requiring an approved icon, Xcode build, publisher signing and device tests. This does not make the existing public preview paid or private.

## Current release

Five-hero formations, three disjoint world squads, an independent Inferno Tower team, the Celestial Auction Hall and safe Reward Inbox, achievement titles and frames, scheduled world-boss raids, world strongholds, elemental formation advice and configurable game-feel/audio are included. See [release notes](docs/current-release.md), the [element-system audit](notes/element-system-audit.md) and [asset/audio credits](CREDITS.md).

One current player package and one separate developer-tool package are maintained. Historical downloads, screenshots, unused atlases, and outdated native packages have been removed from the current tree. Previous commits remain available in Git history.

## Play on iPhone or iPad

The complete Safari installation site is generated in `docs/`. Once GitHub Pages is enabled, open:

https://corgi-coder99.github.io/Game-studio/

In Safari, choose **Share → Add to Home Screen**, open the new icon while connected to Wi-Fi, and download the game until the offline-ready message appears. The game uses a landscape layout on every phone size, rotating its frame when the device is held upright. The Home Screen app provides the fullscreen experience when Safari does not support the Fullscreen API. The initial download is approximately 88 MiB. Subsequent solo sessions can run offline. Back up saves through Settings → Save Management before clearing browser storage.

The repository owner must select **Settings → Pages → Deploy from a branch → main → /docs**. Pages availability depends on repository visibility and plan; this README does not imply that hosting is enabled. Safari does not provide this game's Bluetooth multiplayer.

## Download for desktop

Download [Thien-Menh-Windows.zip](Thien-Menh-Windows.zip), extract it, and open `Thien-Menh.html` in Chrome or Edge. The package also includes Windows launchers and an optional standard-library Python server. Direct HTML play requires neither Node.js nor Python.

## Separate developer application

Download [Heavenly-Mandate-DevTools.zip](Heavenly-Mandate-DevTools.zip). It edits validated JSON test saves and supports a live localhost test game. Studio and debug grants have been removed from the player game. See [developer instructions](admin/README.md). For live mode, extract its folder beside the current game ZIP and run the Python launcher; offline save editing needs only the included HTML.

The [Story Journal](docs/current-release.md) follows The Broken Mandate through five acts with a floor-999 ending. See the [pixel-art toolchain research](docs/toolchain-research.md), [art direction](docs/art-direction.md), and [mobile distribution checklist](docs/store-readiness.md). Native store signing and physical-device testing are still required.

## Develop and build

Requires Node.js 22 or newer; packaging requires Python 3. No npm dependencies are required.

```sh
npm test
npm run dev
npm run build:web
python3 package-windows.py
npm run build:admin
python3 package-admin.py
npm run check:art
```

- `npm run dev`: development server at port 3000.
- `npm run build:offline`: standalone HTML plus an ignored native WebView bundle.
- `npm run build:web`: rebuilds the offline bundle and the complete GitHub Pages site, including integrity metadata and the service worker.
- `python3 package-windows.py`: replaces the single current desktop ZIP.

Keep `assets/` as the editable source assets and `docs/` as the generated hosting output. Both are required for the current source-and-Pages workflow. Tests, build scripts, launchers, and system design notes support maintenance and save compatibility.

## Native mobile projects

Android and iOS source projects remain under [`mobile/`](mobile/README.md). Outdated APK and iOS project ZIP downloads have been removed. Rebuild from current sources before distributing a native app. iOS installation requires Apple signing and an appropriate build/distribution workflow; the repository is not an installable IPA. See [iPhone distribution options](mobile/IOS-DISTRIBUTION.md) for Home Screen installation, TestFlight, and hosted macOS builds.

## Validation and limitations

327 automated gameplay, developer-tool, localization and web-cache checks plus four online authority/authentication tests passed. Touch layouts were exercised in Chromium mobile emulation in landscape and portrait; desktop, offline launch, cache repair, and restart persistence were also checked. Physical iPhone Safari and Bluetooth hardware have not been validated. Windows BAT launchers have not been run on Windows; the iOS project has not been compiled with Xcode.

## Repository policy

Use `main` for the completed release and `codex/thien-menh-offline` for ongoing work. Update `main` only when the user authorizes a release. Maintain one current player download and one current developer-tool download, remove obsolete generated packages and unused files, and keep README links aligned with the current tree. Use English for player-facing copy and new documentation. Never commit signing keys, credentials, saves, or local build caches.
