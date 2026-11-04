# Codex Legend Studio

This repository is a low-cost, Vietnamese-first card strategy prototype and a lightweight workspace for Codex. Use the existing checkout; cloud tasks are isolated already, so do not create worktrees unless explicitly requested.

## Working agreement

- Read `docs/game-design.md` before changing gameplay. Ship small playable improvements.
- Default to one Codex session. Do not launch parallel agents or paid tools unless the user requests them. Roles such as designer, programmer and reviewer are review perspectives, not automatically launched agents.
- Keep gameplay free of external AI calls, accounts, paid services and runtime dependencies unless the user approves a scope change. Never put tokens in browser code.
- Game rules and roster live in `game.mjs`; UI and browser persistence in `app.mjs`; styles in `style.css`. `server.mjs` serves a fixed list of local files.
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
- `npm test` — built-in Node test runner.
- `npm run build:offline` — regenerate the self-contained `offline/Thien-Menh.html` for Windows players without Node.js. After changing game/UI/CSS, regenerate and test it using file:// with networking disabled. Repackage the HTML and instructions in `Thien-Menh-Windows-Offline.zip`.
- Changes are not automatically committed, pushed, published or deployed.
