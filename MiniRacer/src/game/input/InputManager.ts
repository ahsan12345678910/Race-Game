export type ControlMode = 'touchZones' | 'joystick';

export interface InputState {
  accel: number;
  brake: number;
  steer: number;
}

export interface TouchZoneInput {
  screenWidth: number;
  screenHeight: number;
  touchX: number | null;
  touchY: number | null;
  brakePressed: boolean;
}

export interface JoystickInput {
  dx: number;
  dy: number;
  active: boolean;
}

export class InputManager {
  private state: InputState = { accel: 0, brake: 0, steer: 0 };

  updateTouchZones(input: TouchZoneInput): InputState {
    let steer = 0;
    const brake = input.brakePressed ? 1 : 0;
    let accel = input.touchX !== null ? 1 : 0;

    if (input.touchX !== null && input.screenWidth > 0) {
      const half = input.screenWidth / 2;
      if (input.touchX < half) {
        steer = -1;
      } else if (input.touchX >= half) {
        steer = 1;
      }
    }

    if (brake > 0) {
      accel = 0;
    }

    this.state = { accel, brake, steer };
    return this.state;
  }

  updateJoystick(input: JoystickInput): InputState {
    if (!input.active) {
      this.state = { accel: 0, brake: 0, steer: 0 };
      return this.state;
    }

    const magnitude = Math.min(1, Math.hypot(input.dx, input.dy) / 80);
    const steer = Math.max(-1, Math.min(1, input.dx / 80));
    const forward = Math.max(0, -input.dy / 80);
    const backward = Math.max(0, input.dy / 80);

    this.state = {
      accel: forward * magnitude,
      brake: backward > 0.4 ? backward : 0,
      steer,
    };
    return this.state;
  }

  getState(): InputState {
    return this.state;
  }

  reset(): void {
    this.state = { accel: 0, brake: 0, steer: 0 };
  }
}
