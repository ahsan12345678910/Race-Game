# MiniRacer

A lightweight top-down racing game built with **Expo**, **React Native**, and **TypeScript**.

## Quick start

```bash
cd MiniRacer
npm install
npm start
```

Scan the QR code with **Expo Go** (Android/iOS) or press `a` / `w` for emulator / web.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Open on Android |
| `npm run ios` | Open on iOS (macOS required for simulator) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run generate-sounds` | Regenerate placeholder WAV assets |

## Project structure

```
src/
  app/          Navigation & root App
  screens/      Splash, Menu, Game, Settings
  game/
    loop/       Fixed 60 Hz timestep
    physics/    Car model & barrier collision
    track/      Track zones & loader
    input/      Touch zones & virtual joystick
    lap/        Start/finish line detection
    store/      Zustand game state
    audio/      Engine loop & UI clicks
  ui/           HUD, controls, track renderer
  assets/
    tracks/     JSON track definitions
    sounds/     engine.wav, click.wav
```

## Controls

- **Touch zones** (default): touch left/right side of screen to steer; red button bottom-right = brake; auto-accelerate.
- **Joystick** (Settings): drag stick — up = accelerate, down = brake, left/right = steer.

## Tuning tips

Edit `src/game/physics/CarModel.ts` → `DEFAULT_CAR_PARAMS`:

| Param | Effect |
|-------|--------|
| `maxSpeed` | Top speed on asphalt |
| `accel` | Acceleration strength |
| `brakePower` | Braking force |
| `friction` | Coast-down (closer to 1 = less drag) |
| `turnRate` | Steering responsiveness |

Track layout: `src/assets/tracks/default.json` — rectangle loop with `asphalt`, `grass`, `barrier`, and `startLine` zones. `startLine.direction` is the expected crossing angle in degrees.

Lap detection: `src/game/lap/LapSystem.ts` — car must cross the line in the forward direction above minimum speed.

## Audio

Replace `src/assets/sounds/engine.wav` and `click.wav` with your own assets (MP3 also works if you update imports in `AudioManager.ts`). Engine pitch/volume scale with speed in `GameScreen`.

## Persistence

- Best lap: `@miniracer/bestLap`
- Settings: `@miniracer/settings` (control mode, sound)

## Tech stack

- Expo SDK 56, React Native 0.85
- react-native-reanimated, react-native-gesture-handler
- @react-navigation/native-stack
- zustand, @react-native-async-storage/async-storage
- expo-av
