import * as lamejs from 'lamejs';

/**
 * Extracts normalized peaks (0.05 to 1.0) from an AudioBuffer for waveform visualization.
 */
export function extractWaveformPeaks(audioBuffer: AudioBuffer, totalBars = 64): number[] {
  const channelData = audioBuffer.getChannelData(0);
  const sampleCount = channelData.length;
  const blockSize = Math.floor(sampleCount / totalBars);
  const peaks: number[] = [];

  for (let i = 0; i < totalBars; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, sampleCount);
    let max = 0;
    for (let j = start; j < end; j++) {
      const val = Math.abs(channelData[j]);
      if (val > max) max = val;
    }
    peaks.push(max);
  }

  // Normalize peaks
  const absoluteMax = Math.max(...peaks, 0.01);
  return peaks.map((p) => {
    const normalized = p / absoluteMax;
    // Keep a minimum height so waveform bars are visible
    return Math.max(0.08, Math.min(1.0, Number(normalized.toFixed(3))));
  });
}

/**
 * Generates an authentic speech envelope waveform when AudioBuffer is not directly available
 */
export function generateSyntheticWaveform(bars = 64, seed = 42): number[] {
  const peaks: number[] = [];
  let prev = 0.3;
  for (let i = 0; i < bars; i++) {
    const phase = i / bars;
    // Speech envelope: quieter at start and end, rhythmic bursts in between
    const envelope = Math.sin(phase * Math.PI);
    const pseudoRandom = Math.abs(Math.sin((i + 1) * seed * 12.9898)) % 1;
    let val = (prev * 0.4 + pseudoRandom * 0.6) * envelope;
    // occasional pauses between words
    if (i % 9 === 0 || i % 17 === 0) {
      val *= 0.2;
    }
    val = Math.max(0.08, Math.min(0.98, val));
    peaks.push(Number(val.toFixed(3)));
    prev = val;
  }
  return peaks;
}

/**
 * Converts a WAV ArrayBuffer to MP3 Blob using lamejs in the browser.
 */
export async function convertWavToMp3(wavArrayBuffer: ArrayBuffer): Promise<Blob> {
  // Use Web Audio API to decode WAV into PCM samples
  const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtxClass();

  try {
    const audioBuffer = await audioCtx.decodeAudioData(wavArrayBuffer.slice(0));
    const channels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const kbps = 128; // Standard voice quality MP3

    const mp3Encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);
    const mp3Data: Uint8Array[] = [];

    // Convert Float32Array to Int16Array
    const leftChannel = floatToInt16(audioBuffer.getChannelData(0));
    const rightChannel = channels > 1 ? floatToInt16(audioBuffer.getChannelData(1)) : undefined;

    const sampleBlockSize = 1152; // Lame standard chunk size
    const numSamples = leftChannel.length;

    for (let i = 0; i < numSamples; i += sampleBlockSize) {
      const leftChunk = leftChannel.subarray(i, i + sampleBlockSize);
      const rightChunk = rightChannel ? rightChannel.subarray(i, i + sampleBlockSize) : undefined;

      const mp3buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(new Uint8Array(mp3buf));
      }
    }

    const endBuf = mp3Encoder.flush();
    if (endBuf.length > 0) {
      mp3Data.push(new Uint8Array(endBuf));
    }

    return new Blob(mp3Data as BlobPart[], { type: 'audio/mp3' });
  } finally {
    if (audioCtx.state !== 'closed') {
      await audioCtx.close();
    }
  }
}

function floatToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16Array;
}

/**
 * Triggers a download in the user's browser for an audio Blob
 */
export function downloadAudioFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Converts Blob to Base64 string for persistent storage in localStorage / JSON export
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts Base64 data URL to Blob
 */
export function base64ToBlob(base64Data: string, fallbackType = 'audio/wav'): Blob {
  try {
    const parts = base64Data.split(';base64,');
    const contentType = parts[0]?.replace('data:', '') || fallbackType;
    const raw = window.atob(parts[1] || parts[0]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  } catch (e) {
    console.error('Error parsing base64 to blob:', e);
    return new Blob([], { type: fallbackType });
  }
}
