# Native mobile projects

Android WebView and iOS WKWebView source projects share the offline game bundle and platform-specific Bluetooth LE bridges. Current prebuilt APK and iOS project archives are not distributed: the old packages predated the latest gameplay and UI changes.

## Android

Generate the current game bundle first, then build with a JDK, the official Android 35 platform, and the supported build tools:

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
