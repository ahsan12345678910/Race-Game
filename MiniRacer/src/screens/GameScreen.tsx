import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../app/navigation';
import { FixedStepLoop } from '../game/loop/FixedStepLoop';
import { InputManager } from '../game/input/InputManager';
import { useGameStore } from '../game/store/GameStore';
import { audioManager } from '../game/audio/AudioManager';
import { speedToKmh } from '../game/physics/CarModel';
import { HUD } from '../ui/HUD';
import { TrackView } from '../ui/TrackView';
import { TouchControls } from '../ui/TouchControls';
import { Joystick } from '../ui/Joystick';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const RENDER_EVERY_N_STEPS = 2;

export function GameScreen({ navigation }: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const [renderTick, setRenderTick] = useState(0);

  const track = useGameStore((s) => s.track);
  const settings = useGameStore((s) => s.settings);
  const hudVersion = useGameStore((s) => s.hudVersion);
  const setControls = useGameStore((s) => s.setControls);
  const update = useGameStore((s) => s.update);
  const resetRace = useGameStore((s) => s.resetRace);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);

  const car = useGameStore((s) => s.car);
  const lap = useGameStore((s) => s.lap);

  const inputManager = useRef(new InputManager()).current;
  const touchRef = useRef({
    x: null as number | null,
    brake: false,
  });
  const joystickRef = useRef({ dx: 0, dy: 0, active: false });
  const stepCount = useRef(0);
  const loopRef = useRef<FixedStepLoop | null>(null);

  const scale = useMemo(() => {
    const padding = 48;
    const sx = (screenW - padding) / track.width;
    const sy = (screenH - padding) / track.height;
    return Math.min(sx, sy, 1.2);
  }, [screenW, screenH, track.width, track.height]);

  const applyInput = useCallback(() => {
    const { settings: currentSettings } = useGameStore.getState();
    if (currentSettings.controlMode === 'joystick') {
      const j = joystickRef.current;
      const state = inputManager.updateJoystick({
        dx: j.dx,
        dy: j.dy,
        active: j.active,
      });
      setControls(state);
    } else {
      const t = touchRef.current;
      const state = inputManager.updateTouchZones({
        screenWidth: Dimensions.get('window').width,
        screenHeight: Dimensions.get('window').height,
        touchX: t.x,
        touchY: null,
        brakePressed: t.brake,
      });
      setControls(state);
    }
  }, [inputManager, setControls]);

  useEffect(() => {
    audioManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    resetRace();

    const loop = new FixedStepLoop((dt) => {
      applyInput();
      update(dt);
      stepCount.current += 1;
      if (stepCount.current % RENDER_EVERY_N_STEPS === 0) {
        setRenderTick((n) => n + 1);
      }
      const { car: c } = useGameStore.getState();
      void audioManager.updateEngine(speedToKmh(c.speed));
    });

    loopRef.current = loop;
    loop.start();

    return () => {
      loop.stop();
      inputManager.reset();
    };
  }, [applyInput, update, resetRace, inputManager]);

  void renderTick;

  const handlePause = () => {
    if (soundEnabled) void audioManager.playClick();
    loopRef.current?.stop();
    navigation.navigate('Menu');
  };

  return (
    <View style={styles.container}>
      <View style={styles.trackArea}>
        <TrackView track={track} car={car} scale={scale} />
      </View>

      <HUD key={hudVersion} speed={car.speed} currentLap={lap.currentLap} bestLap={lap.bestLap} />

      <Pressable style={styles.pauseBtn} onPress={handlePause}>
        <Text style={styles.pauseText}>II</Text>
      </Pressable>

      {settings.controlMode === 'touchZones' ? (
        <TouchControls
          onTouchMove={(x) => {
            touchRef.current.x = x;
          }}
          onTouchEnd={() => {
            touchRef.current.x = null;
          }}
          onBrake={(pressed) => {
            touchRef.current.brake = pressed;
          }}
        />
      ) : (
        <Joystick
          onChange={(dx, dy, active) => {
            joystickRef.current = { dx, dy, active };
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBtn: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pauseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
