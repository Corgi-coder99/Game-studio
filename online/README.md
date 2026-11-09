# Heavenly Mandate shared-world preview

This is a runnable Internet backend and browser client, not a production service or a purchased domain. It uses Node.js 24, the built-in SQLite driver and the existing game simulation. No third-party runtime dependency or billing SDK is required.

## Run and verify locally

```sh
npm run start:online
npm run test:online
```

Open `http://127.0.0.1:3000`. The game detects the API and opens account sign-in. Use a unique username and a password of at least 12 characters. A fresh server kingdom is created; solo JSON imports and browser wallet edits are never accepted. Ordinary `npm run dev` and GitHub Pages continue to serve the compatible solo preview.

Accounts have salted scrypt password hashes, expiring random sessions stored as hashes, HttpOnly/SameSite cookies, same-origin write checks, bounded request bodies and request rate limits. SQLite uses WAL. Commands derive the actor from the session, validate against existing rules and persist before acknowledgment. Duplicate request IDs do not repeat rewards or trades. Snapshots expose the requesting player's inventory only; other cities expose public names, positions, hall levels and reserve troop counts.

Supported server UI: city upgrades, manual production/collection, training, five-hero armies and recommendation, hero leveling, ticket/Jade summoning with card reveals, the Inferno Tower, gathering, BOT attacks, city movement/portals, stationed defense, player attacks, auction escrow/bidding and Gold-on-delivery mail, the Reward Inbox and attendance. The simulation reuses existing casualties, relocation ghosts and combat results. This preview does not yet provide a shared, multi-account world boss or every detailed solo equipment/settings screen. Nearby Bluetooth remains separate. It is not an App Store or Google Play release.

The single shard accepts up to 64 registered accounts. That is an allocation cap, not a benchmarked simultaneous-player guarantee. The simulation runs once per second while the process is alive; downtime does not simulate every missed combat turn. All cities remain in the world after sign-out and can be attacked. Restart loads the server snapshot and outstanding escrow. No browser can close the shard. Public registrations should stay closed until backup/restore, load tests, recovery/deletion support and operator contact details are in place.

## Small VPS deployment plan

Budget approximately USD 5–15/month for a small Linux VPS with persistent storage, plus a .com domain. These are planning allowances, not current provider quotes. Start with an invitation-only test. Measure CPU, tick duration, memory and disk before increasing capacity.

The prepared Compose configuration runs the game behind Caddy HTTPS. It is not deployed or Docker-tested in this workspace. On an owned server with Docker/Compose installed:

1. Point the owned domain's A record at the server. Check that it resolves correctly. Allow SSH from your administration address and public ports 80/443; do not publish port 3000.
2. Set a private `REGISTRATION_CODE` environment variable for invitation-only sign-ups. Do not commit it or paste it in public chat. Set `GAME_DOMAIN` to the actual owned .com domain; an example is not an availability claim.
3. From `online/`, run `GAME_DOMAIN=your-owned-domain.com docker compose up -d --build`.
4. Check `/api/health`, HTTPS, two account sign-ins, saves after restart and a complete escrow trade.
5. Copy consistent backups off the VPS daily and verify a restore in a separate test environment.

HTTPS registration requires the server invitation code; existing users sign in without re-entering it. The loopback development server permits test registrations without a code.

`PUBLIC_ORIGIN` must equal the public HTTPS origin. This enables Secure cookies and same-origin write checks. Keep the database, backups and credentials out of Git. Never use a temporary development environment as the production host. Never expose registration over plaintext HTTP on the public Internet.

## Backup and operations

```sh
docker compose exec game node online/backup.mjs /data/backups/world-2026-11-09.sqlite
```

This uses SQLite's online backup operation. Copy the result to private off-server storage. To restore, stop the game, preserve the old database/WAL files, replace the database with the verified backup and restart. Test first on an isolated copy. Do not reset a live database to recover a password: there is currently no self-service password reset, email, moderation dashboard or automated account deletion workflow. Those operator processes are launch requirements, not implemented promises.

Pricing has not been configured. No purchase, hosting subscription, store enrollment, DNS mutation or domain registration has been made.
