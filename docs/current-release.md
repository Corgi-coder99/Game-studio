# Current release

## Gameplay and presentation

- City view uses a fixed full-city camera; dragging, wheel input, zoom controls, and building focus cannot move it outside the scene. Landscape terrain covers the canvas independently of city placement.
- Touch screens always use a landscape layout fitted to the available screen and safe-area insets. When Safari cannot lock device orientation, the game rotates its frame in portrait-held devices and converts map input coordinates accordingly. Browser toolbar changes resize the frame without recreating the map. Safari fullscreen requires the Home Screen app where the Fullscreen API is unavailable.
- The seven elemental dragons share a four-frame flight atlas with additional body and tail motion. A stale atlas positioning override has been removed. Only the selected dragon supports a team.
- Skill effects include directed energy trails, impact particles, and sword or ice effects according to the skill family. Visual changes do not change damage.
- Each Inferno Tower floor (1–999) has three encounters: scouts, siege, and a boss. Enemy health and strength increase. Surviving HP, resources, cooldowns, effects, fallen heroes, and spent revives carry between encounters. Rewards and floor unlocks occur only after the boss. In-combat healing skills still work.
- Tower combat remains separate from the three world deployments. Durable saves still stop transient tower battles.

## Distribution

The current desktop package is `Thien-Menh-Windows.zip`. The current Safari site is generated in `docs/`. Old versioned archives, obsolete native packages, unused atlases, legacy reference documents, and historical screenshots have been removed from the current tree. Source code, current build inputs, tests, launchers, native projects, and save-compatibility documentation remain.

## Validation

242 automated checks pass. Chromium desktop and mobile layouts, offline loading, interrupted cache download/retry, cache repair, and restart persistence have been tested. Physical iPhone Safari and Bluetooth hardware remain unverified. Windows BAT launchers have not been run on Windows; the iOS project has not been compiled with Xcode.
