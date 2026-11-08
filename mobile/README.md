# Native mobile projects

Android WebView and iOS WKWebView source projects share the offline game bundle and platform-specific Bluetooth LE bridges. Current store preparation, proposed one-time pricing and remaining submission steps are documented in [store/README.md](../store/README.md). An unsigned Android App Bundle has been built and structurally validated; it is not a signed or published paid app.

## Android

Generate the current game bundle first, then build with a JDK, an official Android 35 or newer platform, and the supported build tools:

```sh
npm run build:offline
python3 mobile/build-android.py --sdk /path/to/sdk/extracted --keystore /private/path/test.keystore
```

Keep signing keys outside Git and reuse the same private key for compatible updates. The previous test APK was compiled and signature-verified, but physical-device behavior and Bluetooth interoperability were not validated. Newly generated APKs are ignored build outputs until explicitly prepared for distribution.

## iPhone and iPad

```sh
npm run build:offline
python3 mobile/prepare-ios.py
```

The preparation script copies current game files into the Xcode project and creates a local project archive. Compile and sign it using Apple's tools. This project has not been compiled with Xcode in this environment and is not a signed IPA. For testing without a Mac, use the Safari installation described in the root README.

## Multiplayer and saves

Safari does not support the native BLE bridge. Native multiplayer uses an authoritative room protocol with up to four peers; solo simulation pauses while a room is active. Desktop multi-tab tests do not verify Bluetooth radio behavior. Export save backups before replacing an app signed with a different key or clearing browser storage.

See [iPhone distribution options](IOS-DISTRIBUTION.md) for the requirements for hosted macOS builds, TestFlight, and App Store distribution without a personal Mac.

## Store artifacts

`mobile/build-release.py` creates and validates `mobile/release-output/Heavenly-Mandate-unsigned.aab`. `build-android.py` produces a self-signed local test APK in the same ignored output folder; never use its test key as a production upload identity. `prepare-ios.py --store --app-icon /path/to/1024-rgb.png` validates an approved opaque icon, marks the bundle as a store build, and produces an iOS source archive there. It does not compile or sign an IPA. Native system copy and permission explanations use English.
