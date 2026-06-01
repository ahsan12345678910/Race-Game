import type { SurfaceType } from '../physics/CarModel';

export interface RectZone {
  type: SurfaceType;
  shape: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StartLineDef {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  direction: number;
}

export interface TrackData {
  name: string;
  width: number;
  height: number;
  startLine: StartLineDef;
  zones: RectZone[];
}

export class Track {
  constructor(public readonly data: TrackData) {}

  get width(): number {
    return this.data.width;
  }

  get height(): number {
    return this.data.height;
  }

  get startLine(): StartLineDef {
    return this.data.startLine;
  }

  getSurfaceAt(x: number, y: number): SurfaceType {
    for (let i = this.data.zones.length - 1; i >= 0; i--) {
      const zone = this.data.zones[i];
      if (x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height) {
        return zone.type;
      }
    }
    return 'grass';
  }

  getStartPosition(): { x: number; y: number; angle: number } {
    const sl = this.data.startLine;
    const x = (sl.x1 + sl.x2) / 2;
    const y = (sl.y1 + sl.y2) / 2 - 30;
    const angle = (sl.direction * Math.PI) / 180;
    return { x, y, angle };
  }
}
