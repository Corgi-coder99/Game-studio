# Thiên Mệnh — Codex Legend Studio

Vietnamese-first, low-cost offline pixel strategy prototype. Read docs/v5-systems.md and docs/characters.md before changing rules. Keep the existing checkout and the authorized secondary branch; preserve main and historical v4 ZIP.

## Working agreement

- Use one Codex session. Do not spawn agents or paid services unless explicitly requested.
- Keep gameplay free of network AI, accounts, runtime dependencies and paid APIs. No tokens in browser code.
- Preserve old saves through migrateKingdom. Durable saves refund all deployed surviving armies once, drop transient battles and stop automatic campaigns.
- Original generated pixel art only; no copied Infinity Kingdom assets/UI. There are thirty active PNGs embedded once as browser-local Blob URLs by the offline builder.
- Ship concrete playable changes and verify actual UI flows. Do not claim the Studio invokes Codex; it exports/copies data for the user's separate session.

## Source ownership

- characters.mjs: 61 heroes, 202 base active skills, 5 VIP passives. game.mjs retains v1 compatibility.
- progression.mjs: hero levels, per-skill ranks, equipment, hero gacha, 3×3 formation.
- tactics.mjs: actual combat, status caps, per-unit counters and ability snapshots. Enemy states must not inherit player gear, runes or manuals.
- account.mjs: profile, level100, VIP15, milestone/VIP gifts, pet/gear draws, stars, cosmetics. Only VIP gift claims issue pet draw points.
- kingdom.mjs: economy/build/train/old world marches/save migration. campaign.mjs: stages1..999 and auto/replay.
- realms.mjs/realm-map.mjs: country/city selection and territory. world-data.mjs/region-map.mjs/world-sim.mjs: 27 rule-based AI towns, 54 harvest nodes, portals, regional armies and sieges.
- chronicle.mjs: active-play timer, missions, win/loss streaks and titles. skins.mjs: only equipped owned skin gives bonuses, not collection stacking. troops.mjs: unit level follows player level to100.
- runes.mjs: 26 nodes, milestone gift points, level gates, conservation of earned/spent/refunded points; effects must work in tactics, not only text.
- mail.mjs: 60 battle reports, 40 notices, pending secret treasure parcels. Record once on settlement and escape imported strings in UI. Include dragons and added abilities in analytics.
- inheritance-data/sim/combat/ui/map.mjs: six map fragments/hidden realms/universal manuals, one extra active slot per hero. Boss rewards go exclusively into claimable mail parcels. Never prune unclaimed parcels or grant duplicate manuals/claims.
- app.mjs and *-ui.mjs: interaction/persistence. map.mjs: city/battle canvas. CSS: style/pixel/immersive/rpg/account.

## Required verification and delivery

```sh
npm test
npm run dev
npm run build:offline
python3 package-windows.py
```

235 meaningful tests cover gameplay and save invariants. Exercise changed browser flows (desktop/mobile). Test the delivered ZIP extracted to a path with spaces, Python server GET/HEAD/404, offline image/skill loading and actual gameplay. Report that BAT has not been run on Windows if that remains true.

Current delivery: Thien-Menh-Kingdom-v12-Windows.zip plus compatibility Thien-Menh-Windows-Python.zip. No Node/Python is needed for direct HTML play; Python launcher uses only the standard library. Regenerate delivery whenever source/UI/art/instructions change. GitHub publication requires session authorization. The user explicitly authorized GitHub publication and instructed pushes to codex/thien-menh-offline only in Corgi-coder99/Game-studio. Preserve main. Local implementation/packaging remains authorized.

UI v7: read docs/v7-interface.md. Native 1920×1080 frame scales uniformly; do not scale individual text panels. gallery-ui.mjs owns fixed bag/pet/campaign scenes and description dialogs; recommendations.mjs provides owned-only heuristic formations. New reports are restricted to mode bot; secret reward parcels remain mandatory.

squads.mjs owns exactly three saved presets and real reserve allocation; army-ui.mjs owns preset, allocation and two-side report scenes. Preserve troop conservation and import validation. `squads.autoFill` defaults false for old 60-unit behavior; explicit auto-fill uses actual reserves and level capacity.

Current rules v8: read docs/v8-update.md. Player and enemy active formations cap at four; internal 9-slot coordinates remain only for backward compatibility. revision 8 imports enforce cap, older revisions migrate without asset loss. city-rules.mjs owns level100 and four concurrent training queues; preserve legacy training alias and total troop capacity. art-cache.mjs shares images; avoid remounting map panels or combat buttons each simulation tick. sandbox.mjs debug grants are local only and repeatable without gear duplication.

UI v9: read docs/v9-update.md. technology.mjs owns six persistent material-funded research nodes; systems-ui.mjs owns native mission/technology/rune scenes. world-art.mjs shares five world site sprites. Keep the mailbox available through the HUD; campaign opens through the city tower.

Rules/UI v10: read docs/v10-update.md. operations.mjs owns three parallel deployments plus the separate tower battle; durable saves refund all survivors once and clear transient battles. Keep the legacy expedition alias without double-counting. Turn-based new battles queue manual skills; resolveTacticsSkill is the action resolver for effect-level tests. elements.mjs/long-ui.mjs own seven innate elements and exactly one equipped dragon per team. VIP13/14 claim gates Light/Dark dragons; shop.mjs owns paid boxes and fragment purchases. Twenty-six embedded PNGs include tiered equipment/weapons, city life, temple, seven dragons and element badges.

Rules/UI v11: read docs/v11-update.md. civic.mjs owns manual production, population and wounded/healing; no passive player resource generation. wildlife.mjs/hunting.mjs own three animated species per region, reservations and food-only hunt rewards. Production snapshots persist until explicit collection, healing refunds once. Include wounded + training + deployments in 1,000 troop capacity. city-layout.mjs shares gate and site positions. scene-art.mjs/city-life.mjs use actual atlas frames for dragons and civilians. Keep all new module/asset whitelists in server/builder; embed only active atlases to keep standalone HTML below GitHub's limit.

Rules/UI v12: read docs/v12-update.md and mobile/README.md. commerce.mjs owns gold/material rates and tradable assets; relocation.mjs owns durable travel, destination ghosts and foreign invasions. room.mjs is authoritative for four peers, escrow, COD, armies and PvP; room-client.mjs uses compressed diffs with BroadcastChannel tests and native BLE. Never claim desktop tests verify radio hardware. Solo simulation pauses during a room; keep room cache and reconnect recovery. mobile/android Java and mobile/ios Swift share GATT UUIDs/framing. Native bundles load local PNGs separately; keep all module/assets in server/builder. Android APK is a self-signed test build, iOS Xcode project is not a signed IPA. Preserve signing keys outside Git and clearly report missing physical/iOS build verification.
