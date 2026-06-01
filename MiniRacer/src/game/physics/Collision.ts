import type { CarState } from './CarModel';
import type { Track } from '../track/Track';

const CAR_HALF_W = 14;
const CAR_HALF_H = 22;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function resolveBarrierCollision(car: CarState, track: Track): CarState {
  const corners = [
    { x: car.x - CAR_HALF_W, y: car.y - CAR_HALF_H },
    { x: car.x + CAR_HALF_W, y: car.y - CAR_HALF_H },
    { x: car.x - CAR_HALF_W, y: car.y + CAR_HALF_H },
    { x: car.x + CAR_HALF_W, y: car.y + CAR_HALF_H },
  ];

  let hitBarrier = false;
  for (const corner of corners) {
    if (track.getSurfaceAt(corner.x, corner.y) === 'barrier') {
      hitBarrier = true;
      break;
    }
  }

  if (!hitBarrier) {
    return car;
  }

  car.x = clamp(car.x, 50, track.width - 50);
  car.y = clamp(car.y, 50, track.height - 50);

  car.vx *= -0.35;
  car.vy *= -0.35;
  car.speed = Math.hypot(car.vx, car.vy);

  return car;
}
