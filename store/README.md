# One-time-purchase mobile edition

## Product proposal

- Working title: Heavenly Mandate — Offline Edition.
- Business model: one upfront app purchase; proposed launch price USD 4.99, adjusted by the publisher per region. This price has not been configured in any store.
- No advertising, subscription, cash currency packs, in-app purchase SDK or mandatory account. Gold, Jade, tickets and Legacy ranks (formerly VIP) are earned through play.
- Complete solo content runs locally. Downloading/installing/updating the app requires the platform's normal store connection; gameplay does not require periodic online activation. No custom DRM or fake purchase entitlement is added.
- Existing public web/desktop builds and source are not made private by this change. A paid store price does not restrict those downloads. Decide whether to retain a complete public preview or publish a limited demo separately before launch.
- Nearby Bluetooth rooms are optional; no centralized multiplayer service or global live player market is claimed. Solo auctions use local simulated traders.

## Concrete changes

Fourteen ordered main-story objectives link the city, recruitment and Inferno Tower. Dialogue scenes unlock at act boundaries, wait until other combat is safe, and hold tower advancement while being read without stopping world armies. Tower encounter names follow the five acts, and narrative rewards go to the existing capacity-safe Reward Inbox. Old saves can complete earlier objectives without losing progress. Completing the story does not require scheduled bosses or real-money purchases.

Offline Hunts permit one additional attempt per boss per device-local calendar day, while preserving the original scheduled appearances. They retain raid difficulty, contribution thresholds, NPC allies, title events and Reward Inbox rules. An attempt is reserved on entry, including a retreat; time changes and edited backups are not prevented in this offline game.

Settings includes About/Privacy, solo backup instructions and clear earned-rank wording. Native system dialogs and permission explanations use English. A prior verified local snapshot supports recovery from a corrupted active save when storage permits. Reset removes both the active save and this recovery copy. The game saves on page hide and loss of visibility, in addition to its normal periodic save. Exported JSON backups remain the supported device-transfer method; uninstalling may delete progress.

## Android

Run `npm run build:offline`, then:

```sh
python3 mobile/build-release.py --sdk /path/to/extracted-sdk --bundletool /path/to/bundletool-all-1.18.3.jar
```

The builder creates and runs Google's `bundletool validate` on `mobile/release-output/Heavenly-Mandate-unsigned.aab`. It does not sign, upload or activate a price. It bundles all art locally, marks the distribution channel as `store`, excludes developer controls, and uses the existing Java WebView/BLE host. The manifest targets API 36; verify current Play Console requirements again at submission. SDK 35 can compile the APIs used here; a current SDK and device testing are still required.

Use a publisher-owned upload key and Play App Signing. With a full JDK, a publisher can sign a separate copy without placing passwords in the command line:

```sh
jarsigner -keystore /secure/upload.jks -storepass:env MANDATE_UPLOAD_STORE_PASSWORD -keypass:env MANDATE_UPLOAD_KEY_PASSWORD -signedjar /secure/Heavenly-Mandate-upload.aab mobile/release-output/Heavenly-Mandate-unsigned.aab YOUR_UPLOAD_ALIAS
jarsigner -verify /secure/Heavenly-Mandate-upload.aab
```

Supply those environment variables through a private local/CI secret store, never Git or chat. Signing has not been performed with a publisher identity here.

Use a publisher-owned upload key and Play App Signing. Never distribute or reuse the local test APK key as a production upload credential. Complete paid-app merchant setup, app access instructions, content rating, data-safety declarations, app listing, screenshots and the testing/release requirements shown in the actual Play Console account. A structurally valid AAB does not prove store acceptance or runtime quality.

## iPhone and iPad

The repository contains native wrapper source; it has not been compiled or signed with Xcode in this environment. The owner has no Mac or Apple Developer enrollment yet. A paid iOS release needs enrollment, agreements/tax/banking setup, a supported macOS/Xcode build and signing workflow, correct app icons/store screenshots, physical-device QA, App Store privacy/rating declarations and review. Do not advertise an unsigned project ZIP as an installable iPhone app.

Use `python3 mobile/prepare-ios.py --store --app-icon /path/to/approved-1024-rgb.png` to validate the icon dimensions, include its asset catalog and set the store-distribution marker. The generated archive is source, not a signed installable IPA. Review the included privacy manifest against the actual Xcode privacy report before upload. Keep pricing/ownership in the platform store; no in-app checkout is needed for an upfront paid app. Use the platform standard EULA unless the publisher supplies an approved alternative. Verify all current requirements directly in App Store Connect before submission.

## Remaining release work

Physical iPhone/iPad and Android tests, Bluetooth radio/recovery, current target-device behavior, final store icon sets, support/privacy hosting, signed release artifacts and late-game balancing/art direction review remain required. The atlas validation pipeline does not redraw existing art. The narrative has new playable objectives and dialogue integration, not a fully voiced or animated cinematic campaign.
