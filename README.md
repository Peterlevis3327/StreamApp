# StreamApp Mobile (Android, Bare React Native)

This app is the Android client for the repository playlists in ../../streams.

## What is implemented

- Bare React Native structure under apps/mobile
- ExoPlayer-backed playback via react-native-video (Android)
- Theme-aware UI (light/dark from device)
- Fast discovery tabs: All, Sports, Favorites, Recent, Countries, Providers
- Hybrid sports grouping: metadata + keyword fallback (football, soccer, tennis, premier league, uefa champions league, supersport, etc.)
- Progressive-ready data model with source recency score
- Playlist generator script that includes all .m3u files and prioritizes recently updated playlists

## Generate app dataset from streams

Run from apps/mobile:

```bash
npm run generate:playlists
```

This writes:

- src/data/generated/manifest.json
- src/data/generated/channels.json

## Install dependencies (done last by design)

```bash
npm install
```

## Run on Android

```bash
npm run start
npm run android
```

## EAS build setup

1. Set expo.eas.projectId in app.json
2. Install and login to EAS CLI
3. Run Android builds:

```bash
eas build --platform android --profile development
eas build --platform android --profile production
```
