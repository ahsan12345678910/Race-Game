import defaultTrackJson from '../../assets/tracks/default.json';
import { Track, type TrackData } from './Track';

export function loadTrack(name: string = 'default'): Track {
  if (name === 'default') {
    return new Track(defaultTrackJson as TrackData);
  }
  throw new Error(`Unknown track: ${name}`);
}
