export type SurfaceType = 'asphalt' | 'grass' | 'barrier' | 'startLine';

export interface CarControls {
  accel: number;
  brake: number;
  steer: number;
}

export interface CarState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
}

export interface CarParams {
  maxSpeed: number;
  accel: number;
  brakePower: number;
  friction: number;
  turnRate: number;
}

export const DEFAULT_CAR_PARAMS: CarParams = {
  maxSpeed: 320,
  accel: 280,
  brakePower: 400,
  friction: 0.92,
  turnRate: 2.8,
};

const SURFACE_FRICTION: Record<SurfaceType, number> = {
  asphalt: 1,
  grass: 0.55,
  barrier: 1,
  startLine: 1,
};

const SURFACE_MAX_SPEED: Record<SurfaceType, number> = {
  asphalt: 1,
  grass: 0.45,
  barrier: 1,
  startLine: 1,
};

export function createCarAtStart(startX: number, startY: number, startAngle: number): CarState {
  return {
    x: startX,
    y: startY,
    vx: 0,
    vy: 0,
    angle: startAngle,
    speed: 0,
  };
}

export function resetCarAtLine(car: CarState, x: number, y: number, angle: number): CarState {
  return {
    ...car,
    x,
    y,
    vx: 0,
    vy: 0,
    angle,
    speed: 0,
  };
}

export function updateCar(
  car: CarState,
  dt: number,
  controls: CarControls,
  surface: SurfaceType,
  params: CarParams = DEFAULT_CAR_PARAMS,
): CarState {
  const surfaceFriction = SURFACE_FRICTION[surface];
  const surfaceSpeedCap = params.maxSpeed * SURFACE_MAX_SPEED[surface];

  const forwardX = Math.sin(car.angle);
  const forwardY = -Math.cos(car.angle);

  const speedAlongForward = car.vx * forwardX + car.vy * forwardY;

  if (controls.accel > 0) {
    car.vx += forwardX * params.accel * controls.accel * dt;
    car.vy += forwardY * params.accel * controls.accel * dt;
  }

  if (controls.brake > 0) {
    const brake = params.brakePower * controls.brake * dt;
    if (Math.abs(speedAlongForward) > brake) {
      car.vx -= forwardX * Math.sign(speedAlongForward) * brake;
      car.vy -= forwardY * Math.sign(speedAlongForward) * brake;
    } else {
      car.vx = 0;
      car.vy = 0;
    }
  }

  car.vx *= Math.pow(params.friction * surfaceFriction, dt * 60);
  car.vy *= Math.pow(params.friction * surfaceFriction, dt * 60);

  car.speed = Math.hypot(car.vx, car.vy);
  if (car.speed > surfaceSpeedCap) {
    const scale = surfaceSpeedCap / car.speed;
    car.vx *= scale;
    car.vy *= scale;
    car.speed = surfaceSpeedCap;
  }

  const steerFactor = Math.min(1, car.speed / 40);
  car.angle += controls.steer * params.turnRate * steerFactor * dt;

  car.x += car.vx * dt;
  car.y += car.vy * dt;

  return car;
}

export function speedToKmh(speed: number): number {
  return Math.round(speed * 0.18);
}
