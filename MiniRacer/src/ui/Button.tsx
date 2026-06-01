import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function Button({ label, onPress, style }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#e94560',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
