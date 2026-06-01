export type UpdateCallback = (dt: number) => void;

const FIXED_DT = 1 / 60;
const MAX_ACCUMULATOR = 0.25;

export class FixedStepLoop {
  private running = false;
  private rafId: number | null = null;
  private lastTime = 0;
  private accumulator = 0;

  constructor(private readonly onFixedUpdate: UpdateCallback) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now() / 1000;
    this.accumulator = 0;
    this.tick();
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (): void => {
    if (!this.running) return;

    const now = performance.now() / 1000;
    let frameTime = now - this.lastTime;
    this.lastTime = now;

    if (frameTime > MAX_ACCUMULATOR) {
      frameTime = MAX_ACCUMULATOR;
    }

    this.accumulator += frameTime;

    while (this.accumulator >= FIXED_DT) {
      this.onFixedUpdate(FIXED_DT);
      this.accumulator -= FIXED_DT;
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}
