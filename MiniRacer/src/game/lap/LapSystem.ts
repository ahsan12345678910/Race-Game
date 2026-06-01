import type { CarState } from '../physics/CarModel';
import type { StartLineDef } from '../track/Track';

export interface LapState {
  currentLap: number;
  lapTimes: number[];
  bestLap: number | null;
  raceTime: number;
  lastCrossTime: number;
  crossedThisFrame: boolean;
}

const DEG = Math.PI / 180;

function normalizeAngle(a: number): number {
  while (a < 0) a += Math.PI * 2;
  while (a >= Math.PI * 2) a -= Math.PI * 2;
  return a;
}

function angleDiff(a: number, b: number): number {
  const d = normalizeAngle(a - b);
  return d > Math.PI ? d - Math.PI * 2 : d;
}

export function createLapState(): LapState {
  return {
    currentLap: 0,
    lapTimes: [],
    bestLap: null,
    raceTime: 0,
    lastCrossTime: 0,
    crossedThisFrame: false,
  };
}

function pointSideOfLine(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
}

export function updateLapSystem(
  lap: LapState,
  car: CarState,
  startLine: StartLineDef,
  dt: number,
  prevSide: number | null,
): { lap: LapState; prevSide: number | null } {
  lap.raceTime += dt;
  lap.crossedThisFrame = false;

  const side = pointSideOfLine(
    car.x,
    car.y,
    startLine.x1,
    startLine.y1,
    startLine.x2,
    startLine.y2,
  );
  const expectedDir = (startLine.direction * DEG + Math.PI) % (Math.PI * 2);
  const carDir = normalizeAngle(car.angle);
  const dirOk = Math.abs(angleDiff(carDir, expectedDir)) < Math.PI / 3;
  const speedOk = car.speed > 25;

  if (prevSide !== null && side !== prevSide && side > 0 && prevSide <= 0 && dirOk && speedOk) {
    const lapTime = lap.raceTime - lap.lastCrossTime;
    if (lap.currentLap > 0) {
      lap.lapTimes.push(lapTime);
      if (lap.bestLap === null || lapTime < lap.bestLap) {
        lap.bestLap = lapTime;
      }
    }
    lap.currentLap += 1;
    lap.lastCrossTime = lap.raceTime;
    lap.crossedThisFrame = true;
  }

  return { lap, prevSide: side };
}

export function formatLapTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toFixed(2).padStart(5, '0')}`;
}
