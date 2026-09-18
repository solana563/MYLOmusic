# MYLO — Native Publishing Guide

This guide details how to build, test, sign, and publish **MYLO** as a native app for **Android (Google Play Store)** and **iOS (Apple App Store)** using the Capacitor native architecture included in this repository.

---

## 1. Prerequisites

- **Node.js**: >= 18.x
- **Android Studio**: Latest Hedgehog / Iguana / Jellyfish with Android SDK 34
- **Xcode**: >= 15.x on macOS (for iOS builds)
- **CocoaPods**: `sudo gem install cocoapods`

---

## 2. Initial Setup

Install the project dependencies:

```bash
npm install
```

Sync the web assets and native plugins into the Android and iOS projects:

```bash
npx cap sync
```

---

## 3. Android (Google Play Store)

### Testing on a Device or Emulator
```bash
npx cap open android
```
Inside Android Studio:
1. Select your target device or emulator.
2. Click the **Run** button (`Shift + F10`).

### Generating a Signed Release App Bundle (.aab) for Google Play
1. Generate a release keystore (if you don't have one):
   ```bash
   keytool -genkey -v -keystore mylo-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mylo-key
   ```
2. Configure signing in `android/app/build.gradle` or use Android Studio:
   - Go to **Build** → **Generate Signed Bundle / APK**.
   - Select **Android App Bundle**.
   - Choose your `mylo-release-key.jks` and enter passwords.
   - Select build variant: **release**.
   - Destination: `android/app/release/app-release.aab`.
3. Upload `app-release.aab` to the **Google Play Console** under **Production** or **Internal Testing**.

### Deep Link Verification on Android
MYLO registers the custom scheme `mylo://auth-callback` in `AndroidManifest.xml` for Supabase authentication. Test it via adb:
```bash
adb shell am start -W -a android.intent.action.VIEW -d "mylo://auth-callback#access_token=TEST_TOKEN" com.mylo.music
```

---

## 4. iOS (Apple App Store)

### Testing on a Simulator or iPhone
```bash
npx cap open ios
```
Inside Xcode:
1. Select the `App` target.
2. Under **Signing & Capabilities**, select your **Apple Developer Team** and bundle identifier `com.mylo.music`.
3. Select your device or simulator and click **Run** (`Cmd + R`).

### Archiving and Uploading to TestFlight / App Store Connect
1. Set the destination to **Any iOS Device (arm64)**.
2. Go to **Product** → **Archive**.
3. Once the archive completes, the Organizer window will open.
4. Click **Distribute App** → **App Store Connect** → **Upload**.
5. After upload finishes, navigate to [App Store Connect](https://appstoreconnect.apple.com) to submit for review or invite TestFlight testers.

### Background Audio & URL Schemes in iOS
- Background audio mode (`audio`) is enabled in `Info.plist` and initialized in `AppDelegate.swift` via `AVAudioSession`.
- `mylo` URL scheme is registered in `Info.plist` to receive OAuth and magic link callbacks from Safari.

---

## 5. Build Scripts Quick Reference

| Command | Description |
|---|---|
| `npm run cap:sync` | Sync web code to Android & iOS projects |
| `npm run cap:open:android` | Open Android project in Android Studio |
| `npm run cap:open:ios` | Open iOS project in Xcode |
| `npm run build:android:bundle` | Compile production `.aab` for Play Store |

---

## 6. Local-First & Privacy Architecture

- **Auth**: Supabase handles user identity authentication (email/password, magic link, Google OAuth via native system browser and `mylo://auth-callback` deep link).
- **User Data**: Playlists, likes, custom stations, settings, and imported audio files reside strictly on-device in **IndexedDB** & **localStorage**. No user files or playlists are sent to external servers.
- **APIs**:
  - `radio-browser.info` for worldwide stations.
  - `iTunes Search API` & `TheAudioDB` for artwork and metadata.
  - `YouTube Data API v3` & `IFrame Player API` for video playback.
  - `lrclib.net` for synced karaoke lyrics.
