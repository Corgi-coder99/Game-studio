# Current release

## Version 15: Golden Warring Kingdoms style

- Applies the supplied Style Bible v1.0 palette and UI roles: 47 approved colors, pixel font, Ink/Royal Blue panels, Parchment text, Gold primary actions and Crimson danger actions.
- Separates natural-element effects from grade/title frame colors. Preserves all game/save rules.
- Adds lazy palette-mapped artwork, opaque/binary alpha, a restricted terrain ramp and a final 360-pixel world-canvas palette pass with integer presentation and corrected input/feedback coordinates. Software fallback is included.
- Settings contains a 640×360 style lineup for side-by-side visual review. VT323 is bundled locally with its OFL license and Vietnamese glyph coverage.
- Canonicalizes zero-valued spawn coordinates so JSON room messages do not change negative zero into a different numeric representation. No location or combat formula changes.
- Existing DOM layouts remain responsive; full native UI pixel locking, new hand-cleaned animation sets and the document’s Godot migration stages are not claimed as completed. See [implementation scope](style-bible-implementation.md).


## Version 14: guided play and shared-world preview

- Recommend is visible from formations and each of the three army cards. Mobile army pages scroll complete cards with five equal slots, including empty slots. The player profile uses one continuous overview rather than automatic multi-page splitting.
- An eight-lesson beginner guide explains buildings, production, recommendation, parallel armies, summoning, the world, story and saves. It can be closed and replayed in Settings.
- Daily Attendance has a monthly calendar, once-per-day Legacy Points and resource/ticket rewards delivered safely to the Reward Inbox. Existing Legacy balances are preserved. Player EXP no longer grants Legacy Points. Pixel Legacy badges progress from medals to the level-15 crown.
- Summon controls use two ticket/Jade icons and a 1/10/100 selector. Batch results use a brief card flip and light sweep, with immediate ownership and reduced-motion alternatives.
- The strategic map now uses cached procedural pixel terrain, river banks, forest/mountain details and castle artwork. The regional map opens information on tap instead of covering sites with text. System mailbox notices translate their original phrases before generic name translation, including historical relocation notices.
- `online/` provides a runnable server-owned shared-world preview with accounts, persistent SQLite saves, server-side commands, player cities, movement, attacks, escrow trading and attendance. Two independent browser accounts and persistence/security tests have been exercised. It is not deployed publicly and no domain or paid service has been purchased. GitHub Pages remains the solo preview. Detailed scope and remaining launch work are in `online/README.md`; budget estimates are in `docs/online-budget.md`.



## Earlier interface baseline (superseded by the Golden theme)

- Shared jade, cream and antique-gold theme tokens now coordinate windows, cards, headers, action buttons, inputs, HUD resources and navigation frames. Selected tabs use gold with dark text; keyboard focus remains visible.
- Lower-grade shard boxes clip stray pixels from the adjacent atlas row without replacing the original artwork.
- Populated siege reports use the same dark surfaces as inventory and trading, while allied/enemy HP bars and victory/defeat colors remain distinct.
- Existing original artwork, rarity accents, scene geometry, zoom, mobile scrolling and gameplay are preserved. This is an interface styling pass, not a claim that all sprites have been redrawn.

## Developer separation and presentation update

- Studio and resource grants are removed from the player game. Settings → Save Management preserves validated backup/import/reset flows. The separate `Heavenly-Mandate-DevTools.zip` supports offline JSON editing and a loopback-only live test session for food, wood, stone, gold, jade and essence, with validation and snapshot undo. Live edits preserve ongoing battles; save restore follows normal durable-save rules.
- The Broken Mandate story journal has five acts, progress-derived chapter reveals, a floor-999 conclusion, and optional world-boss echoes. It requires neither VIP nor scheduled events to reach the main ending.
- English captions cover the main screens and the hero/skill/shard/inventory description catalog; legacy notification and error copy is translated without changing save IDs. Player-entered names remain unchanged. Rune and skill effect descriptions use precise English source text.
- Batch summon results show all cards together, rarity totals, and a short staggered reveal. Rewards remain granted exactly once before presentation. Reduce Motion disables the card animation.
- `build-manifest.mjs` centralizes production modules and textures. Atlas imports validate PNG checksums and image data, dimensions and download budgets. The production PNGs keep their current artwork; this revision does not claim every animation has been redrawn. See [toolchain research](toolchain-research.md) and [art direction](art-direction.md).

## Gameplay

- Each formation supports five heroes. Three world squads are disjoint: remove a hero from one squad before assigning that hero to another. The Inferno Tower retains its independent formation snapshot and three consecutive encounters without automatic healing between them. Old saves migrate without losing heroes, gear or resources.
- The Celestial Auction Hall preserves player trading and adds exclusive items, four learnable martial arts, crafting, NPC auctions, 6/12/24-hour listings, escrow, buyout, a 2% listing fee and a 7% sale fee. Minimum bid increments are 5%. Late bids extend auctions by one minute, at most five times. Unclaimed items, returns and proceeds stay in the Reward Inbox; capacity does not discard them.
- Titles unlock from validated achievement events. One equipped title grants capped bonuses; collection ownership does not stack stats. Frames can be selected independently from unlocked frames. Up to ten owned titles can be displayed vertically above the city. Boss contribution must reach 1%; PvP counting filters dummy/weak opponents and limits repeated opponents to three counted wins per local day.
- City attacks wear down defenders. Both sides suffer casualties; defeats cost more. Subsequent attacks against an undefended city can capture resources and occasionally a special item. Siege victories grant Merit and milestone titles. The Return-to-City Command is sold in the ordinary shop and instantly stations an attacking squad's survivors in defense. Room battles use the stationed defensive formation.
- Black Dragon appears at 12:00 and 20:00 daily, Nine-Tailed Fox at 18:00, Black Tortoise at 21:00, and Demon Lord on Sunday at 20:00. Schedules use the device's local time. Missing an appearance has no penalty. Practice is available without exclusive rewards. Raids include 10–30 simulated NPC allies, 1.5-second skill warnings, a dodge button and up to three revives with 15-second waits. Boss HP scales from 0.6 to 2.0 of base HP. Rewards require at least 1% contribution, use damage rankings, share pity with other exclusive sources, and are delivered through the Reward Inbox. The lair's guardians block city arrival until cleared during an appearance.
- Demon Camps and Barbarian Strongholds populate the world. Strongholds use three waves with carried health. March Qi regenerates one point per three minutes; canceled outbound marches refund their cost. Spoils arrive when troops return. Stronghold marches and combat snapshots persist across closing the game, with actual combat catch-up on reopening. This is an exception to other transient armies, which still refund surviving troops once. This source is capped at five exclusive drops per local day.

## Formations and feedback

- Generation/clash adjacency, one team-wide elemental effect, six-hour Heavenly Timing, terrain-weighted spawns and visible wave/phase elements are configurable. The original overcoming damage multiplier remains 1.25 and is applied once. The new synergy calculator replaces the former team bonus at its application point, avoiding duplicate bonuses.
- Formation advice uses available heroes, bounded beam search and real combat stats. Counter Advantage, Safe and Balanced suggestions include effective power and an estimated difficulty. Five named templates are separate from operational squads; applying one cannot bypass hero assignment locks.
- FeedbackManager provides pooled floating damage numbers/particles, critical/element feedback, hit flashes, small recoil, visual-only hit-stop, notifications, original procedural sound effects and background motifs. Audio starts after a user gesture. Settings persist master/music/SFX volume, reduced motion, vibration, effect quality, damage-number filtering and default speed. Low sustained frame rates reduce particle limits.
- Battle speeds are ×1/×2/×3. Skip calculates the result with the existing combat simulation rather than granting an automatic victory. Effects do not alter combat RNG or outcomes. Boss controls remain mounted while live values refresh.
- City buildings have wider spacing. Top-right shortcuts are consolidated in Settings, including nearby-room controls. English names and the English installer are used throughout new screens; compatibility identifiers in saves remain stable.

## Delivery and limits

- `docs/` is the generated Safari/PWA site. GitHub Pages should use **main /docs**. This repository does not assume Pages is enabled or publicly reachable until its settings and URL are checked.
- `Thien-Menh-Windows.zip` is the current player download; `Heavenly-Mandate-DevTools.zip` is the separate developer application. It contains the standalone HTML and standard-library Python/Windows launchers. Original artwork is embedded once; tested Z85 encoding keeps the HTML below GitHub's 100 MiB file limit. Generated bundles remove obsolete PNGs automatically. The standalone `offline/` build is kept locally and shipped inside the ZIP; its duplicate generated HTML is not tracked in Git.
- Browser tests cover desktop, landscape touch and rotated portrait layouts, purchases/claims, audio settings, five-hero assignment, templates, boss practice/dodge, stronghold combat and skip. Service-worker tests cover interrupted installs, retry, gzip, project-prefix paths and offline reopen.
- Tests run on Linux/Chromium. Windows BAT execution, physical iPhone/Safari rendering and native Bluetooth radio connections have not been verified on hardware. Safari remains solo-only; native BLE source is retained, but this release does not include a newly signed iOS IPA or Android APK.

All artwork and synthesized audio are original. See [credits](../CREDITS.md) and the [element audit](../notes/element-system-audit.md).

Store submission remains a separate milestone: see [mobile readiness](store-readiness.md). Signing, physical-device verification and full late-game balance/art review are still required.

Validation for this revision: 316 automated checks passed; the separate developer app was exercised in live and offline-edit modes. Player flows were checked at 1440×900, 926×428 and rotated 428×926. The current game ZIP was extracted to a path with spaces and served with its included Python launcher.

## Mailbox report correction and remaining content scope

Populated siege reports now use English source copy for the overview, troop statistics, analysis, and hero detail dialogs. Advice for legacy reports is regenerated from their recorded statistics without changing stored history or rewards. Phone report cards scroll without overlapping.

The art pipeline validates and synchronizes existing atlas files; it does not redraw the entire game. Narrative objectives, act dialogue and tower transitions are now integrated as described below. Full visual unification, voiced or animated cinematics, and final art/balance review remain unfinished. No unattended background process completes these tasks automatically.

## Offline paid-edition preparation

Fourteen ordered story objectives now connect kingdom selection, city development, recruitment and tower milestones. Rewards are delivered once to the capacity-safe Reward Inbox. New-game onboarding shows the prologue; real act-boundary victories trigger conclusions and the next act’s opening. The Journal replays unlocked scenes and displays the next actionable objective. Tower encounter names match the story acts. Existing saves keep their progress and can claim earlier objectives.

Scheduled raids are preserved. An additional Offline Hunt can be started once per boss per local calendar day, with normal power checks, contribution rewards, NPC allies and title events. Attempts are reserved on entry, including retreat.

Legacy is the player-facing name of the existing earned VIP system; it is not sold. Spirit Supplies adds repeatable beast draw points and fruit for earned Gold, replacing the old finite gift-only restriction. Settings explains the no-ad/no-IAP/no-subscription model, local data and optional Bluetooth sharing. Native messages use English. Saves persist on page hide/visibility loss, and a verified previous snapshot supports local recovery when space permits. Reset clears active, recovery and legacy saves.

`mobile/build-release.py` builds an unsigned Android AAB and runs Google bundletool validation. Pricing, signing, declarations, physical-device QA, icon/store assets and actual store review are still publisher steps; no app has been uploaded or sold. See [the implementation and price proposal](../store/README.md). These narrative changes are playable integration, not a claim that all artwork or late-game balance has received final production review.
