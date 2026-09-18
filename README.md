# MYLO

MYLO is a local-first music app that blends internet radio, YouTube-powered playback, and personal local music into a single experience. It is built as a web app and packaged for native Android and iOS using Capacitor, so it can run in the browser, as a PWA, or as an installable mobile app.

## Highlights

- Internet radio browsing and streaming
- YouTube integration for music/video playback
- Local music support with on-device storage and playlists
- Local-first architecture using IndexedDB and localStorage
- Supabase-powered authentication flows
- Native Android/iOS packaging with deep links and app-like behaviors
- PWA support with service worker and installable shell

## Project at a glance

This repository is primarily a single-page web app with native wrappers:

- `index.html` — main application shell and app logic
- `sw.js` — service worker for install/offline support
- `capacitor.config.json` — Capacitor configuration
- `android/` and `ios/` — generated native projects
- `NATIVE.md` — native build and Capacitor notes
- `PUBLISHING.md` — Android/iOS publishing and signing guide
- `manifest.webmanifest` — PWA manifest

## Tech stack

- HTML, CSS, JavaScript
- Capacitor for Android/iOS native packaging
- Supabase for authentication and session management
- IndexedDB and localStorage for local-first data persistence
- RadioBrowser, iTunes Search, TheAudioDB, YouTube Data API, and lrclib APIs

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Serve the app locally with any static file server in the project root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Native app setup

The project includes Capacitor support for Android and iOS native builds.

### Sync native projects

```bash
npx cap sync
```

### Open native projects

```bash
npx cap open android
npx cap open ios
```

For more details, see `NATIVE.md`.

## Build and publish

Production and publishing workflows are documented in `PUBLISHING.md`, including:

- Android APK/AAB generation and Play Store signing
- iOS archive and App Store Connect upload
- deep link verification for OAuth and magic links
- local-first and privacy architecture notes

## Common scripts

From `package.json`:

```bash
npm run cap:sync
npm run cap:open:android
npm run cap:open:ios
npm run build:android
npm run build:android:bundle
```

## Notes on architecture

MYLO is designed with a local-first privacy model:

- user playlists, likes, settings, and imported content stay on-device
- network APIs are used for metadata, radio stations, lyrics, and artwork
- authentication is handled by Supabase, with native deep-link callbacks for OAuth and magic links

## License

This project is licensed under the MIT License.

## Related docs

- `NATIVE.md`
- `PUBLISHING.md`

For native packaging and distribution details, refer to the documentation in this repository.
