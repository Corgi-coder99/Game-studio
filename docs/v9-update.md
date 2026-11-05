# v9 — World sites and consolidated interface

The bottom bar owns Heroes, Bag, Missions and Hidden Realms. Removed redundant top Heroes, Bag, VIP, Campaign, Missions, Mail and Hidden Realms tabs. Player profile retains its VIP access; the HUD envelope still opens reports, notices and unclaimed boss parcels. Native hero inspection and four-unit squads remain intact.

Missions use a fixed scene with growth, playtime and title categories, five rows per page, pictured rewards, progress and claim/go actions. Playtime readiness updates without leaving the page. The journey chest markers indicate claimed mission counts, not additional reward grants. Existing quests and once-only reward rules are unchanged.

Technology replaces the Army top tab. Six nodes, ten ranks each: infantry attack +3%, armor/resist +4%, march +4%; siege attack +2.5%, armor/resist +3%, HP +3%. Infantry means shield/spear, not archers/cavalry. Siege nodes only apply to BOT town battles; city defense additionally reduces supplies stolen by rule-based raids. Enemy units never inherit research. Costs per rank n are 300n² food, 240n² wood, 180n² stone (double for siege). Hall gates start at 1/5 and rise by five each rank. Costs are paid immediately, research is blocked while deployed/in combat, and ranks persist across old-save migration. This is an offline research system without server timers or alliance donations.

Runes use a 7-column icon grid, rank badges, hover/keyboard tooltips and direct one-rank upgrades. Point conservation, original effect caps and level gates are unchanged.

The city includes a separate illustrated trial-tower site; selecting it opens the existing 999-floor campaign. It is an entry building and does not add an upgradeable level or costs to old saves. All original six upgrade structures remain at max100.

Original art: three miniature-scale biome backgrounds and a shared five-cell transparent atlas (farm, logging camp, quarry, magic portal, trial pagoda). Harvest drawers and descriptions use the same site art as the map; bag materials retain inventory art. Visible and discovered hidden portals use the same original stone arch. World labels use solid dark plates and ivory text; disabled controls retain readable contrast. Shared cached images and existing map frame pacing are preserved. Twenty PNGs are embedded once in the offline file.

Validation: existing 192 gameplay checks plus 3 technology tests (spending/gates/cap/save validation, allied-only infantry effects, siege scope/actual travel time). Browser checks cover mission readiness/claims, research, tooltips, consolidated navigation, city tower and old combat/harvest flows. Final ZIP is verified after extraction into a path with spaces, local server GET/HEAD/404 and browser network disabled. Windows BAT execution still requires Windows and was not performed in this Linux environment.
