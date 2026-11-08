# Mobile distribution readiness

The current playable delivery is a browser/PWA game and a Windows offline package. Native Android/iOS wrapper source exists. This is not a claim of App Store or Google Play acceptance.

## Implemented in this revision

- Production builds exclude the Studio/debug grants and developer bridge. Developer resource editing is distributed separately.
- Player Settings retains validated JSON backup and restore.
- A five-act story journal explains the combined mythic world, reveals conclusions with tower progress, and has a floor-999 ending. Scheduled bosses are optional.
- One shared atlas list and validated import pipeline synchronize runtime images across builds.

## Required before a store submission

- Build and sign a release Android App Bundle; verify current Play target SDK, permissions, store listing, rating and data-safety declarations against the actual final binary.
- Enroll in Apple Developer, obtain distribution signing and build a signed iOS archive on a supported macOS/Xcode environment or an authorized hosted Mac service. The owner currently has no Mac or Apple Developer enrollment; an unsigned project cannot be installed as an App Store app on an iPhone.
- Run physical iPhone/iPad and Android tests for landscape layout, safe areas, app suspension/restart, offline saves, memory, performance, accessibility and Bluetooth reconnection. Desktop Chromium does not verify Safari or Bluetooth radio hardware.
- Review all gameplay copy, animations and story pacing through late-game play. Browser checks and unit tests do not prove that every progression tier is balanced or every frame is artistically finished.
- Publish accurate support/privacy information. Current play is offline; procedural audio and original images are local. VIP progression and summon currency in this edition are earned in game, with no real-money purchase system. Preserve visible random-draw odds and pity rules. Reassess declarations if networking, analytics, accounts or purchases are later added.
- Keep developer tools out of player binaries and screenshots. This local editor is not an administrator authentication/authorization system for an online economy.

No new paid account, service or store submission is created automatically by these changes.
