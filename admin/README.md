# Heavenly Mandate Developer Tools

This is a separate developer workspace, never part of the player menu.

## Offline save editing

Open `Heavenly-Mandate-DevTools.html` in a modern desktop browser. In the game, use Settings → Save Management → Export Save. Import that JSON here, edit food, wood, stone, gold, jade or essence, then export the test save. Restore it through the game's Settings. Validation rejects unknown fields and invalid amounts. Keep your original backup.

## Live testing on Windows

Extract this developer ZIP to a folder beside the current `Thien-Menh-Windows.zip`. Install Python 3 if needed, then run `START-DEVTOOLS.bat` (or `python3 serve.py`). The server binds only to 127.0.0.1 and opens the developer workspace. Its embedded test game has a temporary session bridge injected locally; the distributed game ZIP remains unchanged. Apply Edits updates the running test game without restarting battles. Undo restores a durable save snapshot, following normal troop-refund and stronghold persistence rules. Multiplayer edits are rejected.

The tool does not connect to another person's game or remotely change an iPhone. Transfer JSON backups to test on another device. Browser storage belongs to this localhost origin and is separate from the published game site. This is a local offline test tool, not a secure administrator service for a future online economy.

## Verification

After building both current packages, `python3 admin/test-browser.py` checks live edits, invalid commands, undo, export, offline import/edit/export, and local host/origin/token restrictions in Chromium. Windows BAT and physical iPhone behavior still require hardware verification.
