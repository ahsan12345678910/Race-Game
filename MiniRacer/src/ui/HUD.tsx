import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatLapTime } from '../game/lap/LapSystem';
import { speedToKmh } from '../game/physics/CarModel';

interface HUDProps {
  speed: number;
  currentLap: number;
  bestLap: number | null;
}

function HUDComponent({ speed, currentLap, bestLap }: HUDProps) {
  const kmh = speedToKmh(speed);
  const bestText = bestLap !== null ? formatLapTime(bestLap) : '--:--.--';

  return (
    <View style={styles.hud} pointerEvents="none">
      <Text style={styles.speed}>{kmh} km/h</Text>
      <Text style={styles.lap}>Lap {Math.max(0, currentLap)}</Text>
      <Text style={styles.best}>Best {bestText}</Text>
    </View>
  );
}

export const HUD = memo(HUDComponent);

const styles = StyleSheet.create({
  hud: {
    position: 'absolute',
    top: 12,
    left: 16,
    gap: 4,
  },
  speed: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: '#000',
    textShadowRadius: 4,
  },
  lap: {
    color: '#a8dadc',
    fontSize: 16,
    fontWeight: '600',
  },
  best: {
    color: '#f4a261',
    fontSize: 14,
    fontWeight: '600',
  },
});
