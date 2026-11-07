# Installing the game as an iPhone app

| Route | Personal Mac required? | Apple Developer membership | Installation |
| --- | --- | --- | --- |
| Home Screen web app | No | No | Safari → Share → Add to Home Screen |
| TestFlight beta | No, a hosted macOS build can be used | Required | Install TestFlight, then accept the beta invitation |
| App Store | No, a hosted macOS build can be used | Required | Install the reviewed public release from the App Store |

The existing `mobile/ios/ThienMenh.xcodeproj` wraps the local offline bundle in WKWebView, hides the status bar, disables page scrolling, supports landscape orientation, and contains the CoreBluetooth bridge. The Safari Home Screen app is the available no-signing option today; it cannot expose native BLE.

## Native distribution prerequisites

1. Enroll in the Apple Developer Program and create an App Store Connect app with a unique bundle identifier.
2. Configure the signing team, distribution certificate, and provisioning profile in a trusted macOS build environment. Without a personal Mac, this can be a hosted macOS CI runner; runner availability and billing depend on the provider and repository plan.
3. Run `npm run build:offline` and `python3 mobile/prepare-ios.py`, then archive/export the Xcode application on macOS. Use the current sources rather than historical native archives.
4. Upload the signed build to App Store Connect. For TestFlight, finish required beta information and review where applicable, then send invitations. For the App Store, provide the required privacy information, screenshots, age rating, metadata, and submit for review.
5. Test on a physical iPhone before claiming support: touch and rotation, offline cold start, save export/recovery, background/resume, and Bluetooth permissions/interoperability.

Signing credentials must be entered through secure CI/environment settings, never chat or Git. This repository currently has no signed IPA, TestFlight build, or approved App Store listing. The iOS project has not been compiled or validated with Xcode in this environment. Store acceptance is subject to Apple's review.
