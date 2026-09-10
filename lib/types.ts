export type SupportedLanguage = 'hi' | 'en' | 'bn';

export interface AudioClip {
  id: string;
  title: string;
  promptText: string;
  voiceName: string;
  language: string;
  speed: number;
  duration: number; // in seconds
  createdAt: string;
  tags: string[];
  audioBlobUrl?: string;
  audioBase64?: string;
  peaks: number[]; // 50 to 80 normalized amplitude values (0.05 - 1.0)
  isFavorite: boolean;
  type: 'tts' | 'memo';
  cloudSynced: boolean;
  fileSizeBytes: number;
}

export interface VoiceProfile {
  id: string;
  displayName: string;
  apiVoiceName: string;
  gender: 'Female' | 'Male' | 'Neutral';
  supportedLanguages: string[];
  accent: string;
  persona: string;
  bestFor: string;
  hardcodedTestSentence: {
    hi?: string;
    en?: string;
    bn?: string;
  };
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  status: 'active' | 'upcoming';
  flag: string;
  voicesCount: number;
}

export interface AppSettings {
  defaultSpeed: number; // 0.7 to 1.8
  maxWordsLimit: number; // 60 words
  defaultDownloadFormat: 'wav' | 'mp3';
  cloudSyncEnabled: boolean;
  autoSaveToLibrary: boolean;
  themePreference: 'system' | 'light' | 'dark';
}
