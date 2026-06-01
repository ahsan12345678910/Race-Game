import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Track } from '../game/track/Track';
import type { CarState } from '../game/physics/CarModel';

const ZONE_COLORS = {
  asphalt: '#3d3d3d',
  grass: '#2d6a4f',
  barrier: '#6c757d',
  startLine: '#f1faee',
} as const;

interface TrackViewProps {
  track: Track;
  car: CarState;
  scale: number;
}

function TrackViewComponent({ track, car, scale }: TrackViewProps) {
  const w = track.width * scale;
  const h = track.height * scale;

  return (
    <View style={[styles.wrapper, { width: w, height: h }]}>
      {track.data.zones.map((zone, i) => (
        <View
          key={`${zone.type}-${i}`}
          style={[
            styles.zone,
            {
              left: zone.x * scale,
              top: zone.y * scale,
              width: zone.width * scale,
              height: zone.height * scale,
              backgroundColor: ZONE_COLORS[zone.type],
              borderWidth: zone.type === 'startLine' ? 2 : 0,
              borderColor: '#e63946',
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.car,
          {
            left: car.x * scale - 14,
            top: car.y * scale - 22,
            transform: [{ rotate: `${car.angle}rad` }],
          },
        ]}
      />
    </View>
  );
}

export const TrackView = memo(TrackViewComponent);

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#16213e',
  },
  zone: {
    position: 'absolute',
  },
  car: {
    position: 'absolute',
    width: 28,
    height: 44,
    backgroundColor: '#e63946',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
