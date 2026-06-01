import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createCarAtStart, updateCar, type CarControls, type CarState } from '../physics/CarModel';
import { resolveBarrierCollision } from '../physics/Collision';
import { loadTrack } from '../track/TrackLoader';
import type { Track } from '../track/Track';
import { createLapState, updateLapSystem, type LapState } from '../lap/LapSystem';
import type { ControlMode } from '../input/InputManager';

const BEST_LAP_KEY = '@miniracer/bestLap';
const SETTINGS_KEY = '@miniracer/settings';

export interface GameSettings {
  controlMode: ControlMode;
  soundEnabled: boolean;
}

interface GameStoreState {
  car: CarState;
  track: Track;
  lap: LapState;
  settings: GameSettings;
  controls: CarControls;
  prevLineSide: number | null;
  hudVersion: number;
  initialized: boolean;

  init: () => Promise<void>;
  resetRace: () => void;
  setControls: (controls: CarControls) => void;
  update: (dt: number) => void;
  setControlMode: (mode: ControlMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  resetBestLap: () => Promise<void>;
  persistSettings: () => Promise<void>;
  loadBestLap: () => Promise<void>;
}

function buildInitialCar(track: Track): CarState {
  const start = track.getStartPosition();
  return createCarAtStart(start.x, start.y, start.angle);
}

export const useGameStore = create<GameStoreState>((set, get) => {
  const track = loadTrack('default');

  return {
    car: buildInitialCar(track),
    track,
    lap: createLapState(),
    settings: { controlMode: 'touchZones', soundEnabled: true },
    controls: { accel: 0, brake: 0, steer: 0 },
    prevLineSide: null,
    hudVersion: 0,
    initialized: false,

    init: async () => {
      try {
        const raw = await AsyncStorage.getItem(SETTINGS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<GameSettings>;
          set((s) => ({
            settings: {
              controlMode: parsed.controlMode ?? s.settings.controlMode,
              soundEnabled: parsed.soundEnabled ?? s.settings.soundEnabled,
            },
          }));
        }
      } catch {
        /* use defaults */
      }
      await get().loadBestLap();
      set({ initialized: true });
    },

    resetRace: () => {
      const { track: t } = get();
      set({
        car: buildInitialCar(t),
        lap: createLapState(),
        prevLineSide: null,
        controls: { accel: 0, brake: 0, steer: 0 },
        hudVersion: get().hudVersion + 1,
      });
    },

    setControls: (controls) => set({ controls }),

    update: (dt) => {
      const state = get();
      const surface = state.track.getSurfaceAt(state.car.x, state.car.y);

      let car = { ...state.car };
      car = updateCar(car, dt, state.controls, surface);
      car = resolveBarrierCollision(car, state.track);

      const lapResult = updateLapSystem(
        { ...state.lap },
        car,
        state.track.startLine,
        dt,
        state.prevLineSide,
      );

      const hudBump = lapResult.lap.crossedThisFrame ? 1 : 0;

      set({
        car,
        lap: lapResult.lap,
        prevLineSide: lapResult.prevSide,
        hudVersion: state.hudVersion + hudBump,
      });

      if (lapResult.lap.crossedThisFrame && lapResult.lap.bestLap !== null) {
        void AsyncStorage.setItem(BEST_LAP_KEY, String(lapResult.lap.bestLap));
      }
    },

    setControlMode: (mode) => {
      set((s) => ({ settings: { ...s.settings, controlMode: mode } }));
      void get().persistSettings();
    },

    setSoundEnabled: (enabled) => {
      set((s) => ({ settings: { ...s.settings, soundEnabled: enabled } }));
      void get().persistSettings();
    },

    resetBestLap: async () => {
      await AsyncStorage.removeItem(BEST_LAP_KEY);
      set((s) => ({
        lap: { ...s.lap, bestLap: null, lapTimes: [] },
        hudVersion: s.hudVersion + 1,
      }));
    },

    persistSettings: async () => {
      const { settings } = get();
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    },

    loadBestLap: async () => {
      const raw = await AsyncStorage.getItem(BEST_LAP_KEY);
      if (raw) {
        const best = parseFloat(raw);
        if (!Number.isNaN(best)) {
          set((s) => ({ lap: { ...s.lap, bestLap: best } }));
        }
      }
    },
  };
});
