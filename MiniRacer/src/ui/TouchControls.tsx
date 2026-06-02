import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface TouchControlsProps {
  onTouchMove: (x: number) => void;
  onTouchEnd: () => void;
  onBrake: (pressed: boolean) => void;
}

function TouchControlsComponent({ onTouchMove, onTouchEnd, onBrake }: TouchControlsProps) {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View
        style={styles.steerZone}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderMove={(e) => onTouchMove(e.nativeEvent.locationX)}
        onResponderRelease={onTouchEnd}
        onResponderTerminate={onTouchEnd}
      />
      <Pressable
        style={({ pressed }) => [styles.brakeBtn, pressed && styles.brakePressed]}
        onPressIn={() => onBrake(true)}
        onPressOut={() => onBrake(false)}
      />
    </View>
  );
}

export const TouchControls = memo(TouchControlsComponent);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  steerZone: {
    flex: 1,
  },
  brakeBtn: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(230, 57, 70, 0.75)',
    borderWidth: 3,
    borderColor: '#fff',
  },
  brakePressed: {
    backgroundColor: 'rgba(200, 30, 50, 0.95)',
  },
});
