import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../app/navigation';
import { ScreenLayout } from '../ui/ScreenLayout';
import { Button } from '../ui/Button';
import { audioManager } from '../game/audio/AudioManager';
import { useGameStore } from '../game/store/GameStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export function MenuScreen({ navigation }: Props) {
  const resetRace = useGameStore((s) => s.resetRace);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);

  const playClick = () => {
    if (soundEnabled) void audioManager.playClick();
  };

  return (
    <ScreenLayout>
      <Text style={styles.title}>MiniRacer</Text>
      <Button
        label="Play"
        onPress={() => {
          playClick();
          resetRace();
          navigation.navigate('Game');
        }}
      />
      <Button
        label="Settings"
        onPress={() => {
          playClick();
          navigation.navigate('Settings');
        }}
      />
      <Button
        label="Quit"
        onPress={() => {
          playClick();
          console.log('Quit pressed');
        }}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 32,
  },
});
