import { AudioClip, AppSettings } from './types';
import {
  HARDCODED_TEST_LINE_HINDI,
  HARDCODED_TEST_LINE_ENGLISH,
  HARDCODED_TEST_LINE_BENGALI,
} from './voice-data';
import { generateSyntheticWaveform, base64ToBlob } from './audio-encoder';

const CLIPS_STORAGE_KEY = 'quarkgen_voice_clips_v2';
const SETTINGS_STORAGE_KEY = 'quarkgen_app_settings_v2';
const LAST_SYNC_KEY = 'quarkgen_last_cloud_sync';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultSpeed: 1.0,
  maxWordsLimit: 60,
  defaultDownloadFormat: 'wav',
  cloudSyncEnabled: true,
  autoSaveToLibrary: true,
  themePreference: 'light',
};

const SEED_CLIPS: AudioClip[] = [
  {
    id: 'seed-clip-1',
    title: 'Policy Renewal Confirmation',
    promptText: HARDCODED_TEST_LINE_HINDI,
    voiceName: 'diya',
    language: 'hi',
    speed: 1.0,
    duration: 11.2,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    tags: ['#CustomerSupport', '#PolicyRenewal', '#Hindi', '#Sales'],
    peaks: generateSyntheticWaveform(64, 88),
    isFavorite: true,
    type: 'tts',
    cloudSynced: true,
    fileSizeBytes: 245760,
  },
  {
    id: 'seed-clip-2',
    title: 'Studio Onboarding Welcome',
    promptText: HARDCODED_TEST_LINE_ENGLISH,
    voiceName: 'rishi',
    language: 'en',
    speed: 1.0,
    duration: 8.5,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    tags: ['#Greeting', '#Onboarding', '#English', '#Narration'],
    peaks: generateSyntheticWaveform(64, 99),
    isFavorite: false,
    type: 'tts',
    cloudSynced: true,
    fileSizeBytes: 184320,
  },
  {
    id: 'seed-clip-3',
    title: 'Customer Verification Assistance',
    promptText: HARDCODED_TEST_LINE_BENGALI,
    voiceName: 'suhana',
    language: 'bn',
    speed: 1.0,
    duration: 9.8,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    tags: ['#IVR', '#Bengali', '#CustomerSupport', '#VoiceMemo'],
    peaks: generateSyntheticWaveform(64, 115),
    isFavorite: true,
    type: 'tts',
    cloudSynced: true,
    fileSizeBytes: 212992,
  },
  {
    id: 'seed-clip-4',
    title: 'Executive Strategic Announcement',
    promptText:
      'Good morning team. We are thrilled to introduce our new global communication platform powered by high-fidelity multilingual voice synthesis.',
    voiceName: 'amitabh',
    language: 'en',
    speed: 0.95,
    duration: 7.6,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    tags: ['#Narration', '#Corporate', '#English'],
    peaks: generateSyntheticWaveform(64, 212),
    isFavorite: false,
    type: 'tts',
    cloudSynced: true,
    fileSizeBytes: 165888,
  },
];

export function getStoredClips(): AudioClip[] {
  if (typeof window === 'undefined') return SEED_CLIPS;

  try {
    const raw = localStorage.getItem(CLIPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(SEED_CLIPS));
      return SEED_CLIPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((c: AudioClip) => {
        if (c.audioBase64 && !c.audioBlobUrl) {
          try {
            const blob = base64ToBlob(c.audioBase64);
            return {
              ...c,
              audioBlobUrl: URL.createObjectURL(blob),
            };
          } catch {
            return c;
          }
        }
        return c;
      });
    }
    return SEED_CLIPS;
  } catch (error) {
    console.error('Failed to load clips from storage:', error);
    return SEED_CLIPS;
  }
}

export function saveStoredClips(clips: AudioClip[]): void {
  if (typeof window === 'undefined') return;
  try {
    // To avoid localStorage quota exhaustion from massive base64 strings, we sanitize large base64 if needed
    const serialized = JSON.stringify(clips);
    localStorage.setItem(CLIPS_STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save clips to localStorage, cleaning memory:', error);
    // If quota exceeded, strip base64 audio and keep metadata and waveforms
    const stripped = clips.map((c) => ({
      ...c,
      audioBase64: undefined,
    }));
    try {
      localStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(stripped));
    } catch {
      // Ignored
    }
  }
}

export function getStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_APP_SETTINGS;
    return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function getLastCloudSyncTime(): string {
  if (typeof window === 'undefined') return new Date().toISOString();
  return localStorage.getItem(LAST_SYNC_KEY) || new Date().toISOString();
}

export function setLastCloudSyncTime(timeIso: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_SYNC_KEY, timeIso);
}
