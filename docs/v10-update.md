# v10 — Turn combat, parallel squads, long sanctuary and illustrated city

## Combat and presentation

New tactical battles use a deterministic queue sorted by formation slot; when both sides occupy the same slot, the allied unit acts then the enemy. Dead actors are skipped. One actor resolves an attack or a skill per action; attack speed controls recovery, slow adds windup, and stun skips the action. Damage-over-time, cooldowns and mana regeneration retain their documented second-based timings. Manual skill buttons queue a skill for its owner's next turn and spend resources only when resolved; automatic selection also obeys turns. A round/next-actor indicator explains the order. Four heroes per team remains the limit.

Each of the 202 base skills has a deterministic visual signature from hero/skill identity, type, element and target set. Eight visual families include sword flights, dragons, thunder, meteors, lotus healing, seals, ice and void; geometry, palette, timing and particles vary per skill. The effects are procedural layered canvas VFX and sprite motion, not 202 individually drawn animation films or limb rigs. Legacy manual effects retain their specialized events.

Town battles use an open terrain backdrop; large castle models no longer cover fighters. Only the selected dragon circles above the allied formation, with support pulses. The bottom navigation hides during combat so it does not overlap skill controls; use the combat map/campaign button to return.

## Parallel operations and troop accounting

`operations.mjs` manages up to three world deployments. Each owns its squad index, origin city, formation, troop type/count, selected dragon, progress, pause and battle. At most two can attack simultaneously and one can be stationed as garrison. Gathering, town attacks, garrison and tower can progress in parallel; changing which battle is watched does not stop the others. Formation/type/dragon are fixed on departure. Units are deducted on departure; casualties are lost; survivors return to reserve. Training includes every deployed unit when checking the 1,000 total capacity.

World heroes cannot be duplicated across deployed world squads. Idle presets remain editable while another squad is deployed. The tower has its own saved formation/dragon (`Lưu đội hiện tại cho tháp`), no reserve cost, and a separate transient battle; the same heroes may appear in the tower and a world squad. A garrison intercepts hostile BOT raids with its own real battle and report; it remains at its post with survivors until recalled. Its losing all troops removes the post. Hidden realm combat can coexist with tower/world jobs; boss rewards still go only through claimable mail parcels.

Durable saves refund all deployed survivors exactly once, clear deployment battles and the tower battle, and stop tower auto play. Old single deployments migrate into the new representation. The legacy `worldAI.expedition` field is a compatibility alias, never a second army. Import validation rejects active/transient payloads and malformed tower formations. Existing assets and hero ownership are retained.

## Seven elements and dragons

Natural hero elements are Fire, Water, Wood, Earth and Metal, spanning D–SSR. VIP gift heroes alone use Light/Dark. Five natural dragons are open; Light Dragon unlocks from the claimed VIP13 gift and Dark Dragon from VIP14. A selected dragon alone contributes; merely owning other dragons or ranks does not add their effects. The active world squad and tower retain their own chosen dragon snapshots.

Fire damages enemies; Water heals; Wood shields; Earth shields and temporarily improves defense; Metal damages and exposes the nearest enemy row; Light heals, cleanses and grants 1 second immunity; Dark damages and suppresses mana regeneration. Dragon support triggers every 10 battle seconds. Each dragon has 0–10 enhancement ranks, +5% support power per rank, requiring `40 × next rank` fragments. The sanctuary shows all seven, ownership, active selection, rank and costs.

The shop sells dragon fragments (10 for 300 jade for natural dragons, 1,000 for VIP dragons) and owned VIP hero fragments (10 for 1,500 jade). VIP ownership must come from its gift first; fragments cannot unlock a VIP dragon/hero. Ordinary blind boxes/gacha exclude VIP heroes. Studio debug grants remain explicit test tools.

Natural counter cycle: Fire → Metal → Wood → Earth → Water → Fire, ×1.25. Light/Dark counter each other at ×1.25. Gear's existing light/dark THẦN set affinity is a separate equipment property; it does not change a normal hero's innate element. Pixel elemental badges are shown on hero portraits and in the character window.

## Shop, art, summoning and city life

The bottom Shop sells eight colored question-mark shard boxes, D/C/B/A/S/SS/SSS/SSR. Each grants 10 random non-VIP hero fragments of exactly that grade. Prices are 80/150/300/600/1,200/2,500/6,000/15,000 jade. Purchases enter the same bag; opening consumes one box once. Eighty fragments assemble an unowned ordinary hero. Hover/focus or the description dialog reveals box contents and grade. Dragon fragments have their own bag category.

New equipment art covers five slots × eight rarity tiers, and eight weapon silhouettes × eight tiers. Low tiers are plain cloth/leather/iron; high tiers use ornate jade, gold, celestial and dragon designs. A shared art function is used by bag, picker and character equipment. The existing set affinity badge remains.

Original temple art backs the summoning sequence: gate light, expanding portal, ritual circle and hero reveal, with next/skip controls. Pull results are committed exactly once before presentation; skipping or advancing never rerolls or grants again. Reduced-motion settings skip the main reveal animation.

The city adds residential courtyards, market, gate, pond/bridge, harvesting workers and civilians walking between homes and production sites, cranes and the selected dragon flying/resting near its sanctuary. These illustrate the existing automatic production economy; they do not add duplicate resource grants. Construction has scaffold/aura/sparks while its actual timer runs and a completion light effect when the level changes. Equipped castle skins have distinct ambient halos/rays, with no collection stacking.

All reference videos were inspected for visual behavior only. All new art is original; no frames or branded game assets are shipped. Twenty-six PNGs are embedded once as local Blob URLs. There are no runtime network, AI or package dependencies.

## Verification

204 gameplay/save tests pass, including nine new v10 tests for parallel accounting/refunds, world hero locks, garrison interception, turn/manual queue ordering, box rewards/assembly, all 202 VFX signatures, VIP dragon gates/non-stacking, seven support effects and VIP fragment purchases. Existing effect-level tests call the action resolver directly; scheduler behavior is covered separately. Older tests expecting exclusive campaign/world work were updated to the requested parallel rule.

Browser flows cover 1920×1080 and the exact delivered single-file ZIP at 1366×768 DPR2 with network disabled: three deployments plus tower, switching battles, VIP fragment purchases/upgrades, element badges, rarity art, shop rewards, actual summon reveal without duplicate grants, and construction completion. ZIP extraction into a path with spaces, CRC, GET/HEAD/404 and absence of external requests/JavaScript errors pass. Windows BAT execution itself has not been performed on this Linux environment.
