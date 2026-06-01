import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../app/navigation';
import { ScreenLayout } from '../ui/ScreenLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Menu');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ScreenLayout>
      <Text style={styles.title}>MiniRacer</Text>
      <Text style={styles.subtitle}>Loading...</Text>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#e94560',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#a8a8b3',
    fontSize: 16,
    marginTop: 12,
  },
});
