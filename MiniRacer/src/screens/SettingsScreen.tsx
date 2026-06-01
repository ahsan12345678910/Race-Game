import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../app/navigation';
import { ScreenLayout } from '../ui/ScreenLayout';
import { Button } from '../ui/Button';
import { useGameStore } from '../game/store/GameStore';
import { audioManager } from '../game/audio/AudioManager';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const settings = useGameStore((s) => s.settings);
  const setControlMode = useGameStore((s) => s.setControlMode);
  const setSoundEnabled = useGameStore((s) => s.setSoundEnabled);
  const resetBestLap = useGameStore((s) => s.resetBestLap);

  const playClick = () => {
    if (settings.soundEnabled) void audioManager.playClick();
  };

  return (
    <ScreenLayout>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Touch zones</Text>
        <Switch
          value={settings.controlMode === 'joystick'}
          onValueChange={(v) => {
            playClick();
            setControlMode(v ? 'joystick' : 'touchZones');
          }}
        />
        <Text style={styles.label}>Joystick</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Sound</Text>
        <Switch
          value={settings.soundEnabled}
          onValueChange={(v) => {
            setSoundEnabled(v);
            audioManager.setEnabled(v);
            if (v) void audioManager.playClick();
          }}
        />
      </View>

      <Button
        label="Reset best lap"
        onPress={() => {
          playClick();
          void resetBestLap();
        }}
      />

      <Pressable
        onPress={() => {
          playClick();
          navigation.goBack();
        }}
        style={styles.back}
      >
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12,
  },
  label: {
    color: '#ccc',
    fontSize: 16,
  },
  back: {
    marginTop: 24,
    padding: 12,
  },
  backText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
});
