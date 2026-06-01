const fs = require('fs');
const path = require('path');

function writeWav(filePath, durationSec = 0.15, freq = 440) {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.min(1, Math.min(t * 20, (durationSec - t) * 20));
    const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
    buffer.writeInt16LE(Math.floor(sample * 32767), 44 + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
}

function writeEngineLoop(filePath, durationSec = 2) {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const rumble = Math.sin(2 * Math.PI * 55 * t) * 0.15;
    const hum = Math.sin(2 * Math.PI * 110 * t) * 0.08;
    const sample = rumble + hum;
    buffer.writeInt16LE(Math.floor(sample * 32767), 44 + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
}

const soundsDir = path.join(__dirname, '..', 'src', 'assets', 'sounds');
fs.mkdirSync(soundsDir, { recursive: true });
writeEngineLoop(path.join(soundsDir, 'engine.wav'), 2);
writeWav(path.join(soundsDir, 'click.wav'), 0.08, 880);
console.log('Generated engine.wav and click.wav');
