import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './navigation';
import { useGameStore } from '../game/store/GameStore';
import { audioManager } from '../game/audio/AudioManager';

export default function App() {
  const init = useGameStore((s) => s.init);

  useEffect(() => {
    void init();
    void audioManager.init();
    return () => {
      void audioManager.unload();
    };
  }, [init]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <RootNavigator />
      <StatusBar style="light" hidden />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
