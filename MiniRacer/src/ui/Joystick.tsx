import { memo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

const BASE_SIZE = 120;
const THUMB_SIZE = 48;
const MAX_DIST = 50;

interface JoystickProps {
  onChange: (dx: number, dy: number, active: boolean) => void;
}

function JoystickComponent({ onChange }: JoystickProps) {
  const [thumb, setThumb] = useState({ x: 0, y: 0 });
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onChangeRef.current(0, 0, true),
      onPanResponderMove: (_, g) => {
        const dist = Math.hypot(g.dx, g.dy);
        const scale = dist > MAX_DIST ? MAX_DIST / dist : 1;
        const x = g.dx * scale;
        const y = g.dy * scale;
        setThumb({ x, y });
        onChangeRef.current(x, y, true);
      },
      onPanResponderRelease: () => {
        setThumb({ x: 0, y: 0 });
        onChangeRef.current(0, 0, false);
      },
      onPanResponderTerminate: () => {
        setThumb({ x: 0, y: 0 });
        onChangeRef.current(0, 0, false);
      },
    }),
  ).current;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.base} {...panResponder.panHandlers}>
        <View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: thumb.x }, { translateY: thumb.y }],
            },
          ]}
        />
      </View>
    </View>
  );
}

export const Joystick = memo(JoystickComponent);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    bottom: 24,
  },
  base: {
    width: BASE_SIZE,
    height: BASE_SIZE,
    borderRadius: BASE_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: 'rgba(233, 69, 96, 0.9)',
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
  },
});
