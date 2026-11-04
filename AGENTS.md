# Codex Legend Studio

This repository is a low-cost, Vietnamese-first card strategy prototype and a lightweight workspace for Codex. Use the existing checkout; cloud tasks are isolated already, so do not create worktrees unless explicitly requested.

## Working agreement

- Read `docs/game-design.md` before changing gameplay. Ship small playable improvements.
- Default to one Codex session. Do not launch parallel agents or paid tools unless the user requests them. Roles such as designer, programmer and reviewer are review perspectives, not automatically launched agents.
- Keep gameplay free of external AI calls, accounts, paid services and runtime dependencies unless the user approves a scope change. Never put tokens in browser code.
- Roster, gacha and v1 compatibility live in `game.mjs`. Active v2 city/economy/marching/combat/skills/save rules are in `kingdom.mjs`; pixel-map rendering in `map.mjs`; UI and browser persistence in `app.mjs`; styles in `style.css` and `pixel.css`. `server.mjs` serves a fixed list of local files.
- Do not copy art or character depictions from existing games. Current AI-generated pixel portraits depict historical and mythological figures. Preserve the 4×2 atlas order matching game.mjs; pixel.css maps the cells. The offline bundler embeds both PNG assets as data URIs. Regenerate the offline build whenever art changes.

## Task loop

1. Designer: state the player-visible goal and acceptance criteria in a few lines. Update the design document only when rules change.
2. Programmer: implement the smallest complete change, preserving existing saves or providing migration.
3. Reviewer: consider economy exploits, broken imports, targeting, mobile layout and keyboard access.
4. QA: run `npm test`; start `npm run dev` and exercise the changed feature in a browser when available. Report untested behavior explicitly.

Do not claim browser buttons call Codex: the Studio currently exports data and copies a prompt for the user to paste into their Codex session. Future backend orchestration needs a separate design and secure server-side authentication.

## Commands

- Node.js 22+; no dependency installation required.
- `npm run dev` — serve on port 3000; `PORT=3001 npm run dev` for an alternate port.
- `npm test` — built-in Node test API, currently 6 legacy/gacha tests plus 21 kingdom tests. V2 uses real-time combat, not the v1 turn-based battle functions.
- `npm run build:offline` — regenerate the self-contained `offline/Thien-Menh.html` for Windows players without Node.js. After changing game/UI/CSS, regenerate and test it using file:// with networking disabled. Repackage the HTML and instructions in `Thien-Menh-Windows-Offline.zip`.
- Changes are not automatically committed, pushed, published or deployed.
- `python3 package-windows.py` — bundle HTML, BAT launchers, Python standard-library server and Vietnamese instructions into both the compatibility ZIP and `Thien-Menh-Kingdom-v2-Windows.zip`. No Python packages are required to play.
- Preserve/migrate v1 saves. V2 durable saves recall in-flight troops and omit transient battles; resource production accrues up to 8 hours, combat advances only during the running session.
- Infinity Kingdom is a gameplay reference for city building, four-hero elemental formations and supporting dragons. This is an original offline PvE prototype; do not copy its assets/UI or claim MMO parity.
