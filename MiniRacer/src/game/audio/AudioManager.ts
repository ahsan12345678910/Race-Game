import { Audio } from 'expo-av';

class AudioManager {
  private engineSound: Audio.Sound | null = null;
  private clickSound: Audio.Sound | null = null;
  private loaded = false;
  private soundEnabled = true;

  async init(): Promise<void> {
    if (this.loaded) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const { sound: engine } = await Audio.Sound.createAsync(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../../assets/sounds/engine.wav'),
        { isLooping: true, volume: 0.4 },
      );
      const { sound: click } = await Audio.Sound.createAsync(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../../assets/sounds/click.wav'),
        { volume: 0.6 },
      );

      this.engineSound = engine;
      this.clickSound = click;
      this.loaded = true;
    } catch (e) {
      console.warn('Audio assets not loaded:', e);
    }
  }

  setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (!enabled) {
      void this.engineSound?.pauseAsync();
    }
  }

  async playClick(): Promise<void> {
    if (!this.soundEnabled || !this.clickSound) return;
    try {
      await this.clickSound.replayAsync();
    } catch {
      /* ignore */
    }
  }

  async updateEngine(speedKmh: number, racing: boolean): Promise<void> {
    if (!this.soundEnabled || !this.engineSound) return;

    try {
      const status = await this.engineSound.getStatusAsync();
      if (!status.isLoaded) return;

      if (!racing || speedKmh < 2) {
        if (status.isPlaying) await this.engineSound.pauseAsync();
        return;
      }

      if (!status.isPlaying) {
        await this.engineSound.playAsync();
      }

      const rate = 0.8 + Math.min(speedKmh / 180, 1) * 0.8;
      const volume = 0.25 + Math.min(speedKmh / 200, 1) * 0.55;
      await this.engineSound.setRateAsync(rate, true);
      await this.engineSound.setVolumeAsync(volume);
    } catch {
      /* ignore */
    }
  }

  async unload(): Promise<void> {
    await this.engineSound?.unloadAsync();
    await this.clickSound?.unloadAsync();
    this.engineSound = null;
    this.clickSound = null;
    this.loaded = false;
  }
}

export const audioManager = new AudioManager();
