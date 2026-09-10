import { VoiceProfile, LanguageInfo } from './types';

export const HARDCODED_TEST_LINE_HINDI =
  "[laughter] कन्फर्म करने के लिए धन्यवाद। मैं आपको पेमेंट लिंक भेज दूंगी। कृपया पेमेंट पूरा कर दें, ताकि आपकी पॉलिसी के लाभ बिना किसी रुकावट के जारी रहें। हमें आपके रिन्यूअल का इंतजार रहेगा।";

export const HARDCODED_TEST_LINE_ENGLISH =
  "Thank you for confirming. I will send you the verification link right away. Please complete the setup so your benefits continue smoothly without interruption.";

export const HARDCODED_TEST_LINE_BENGALI =
  "নিশ্চিত করার জন্য আপনাকে ধন্যবাদ। আমি এখনই পেমেন্ট লিঙ্ক পাঠিয়ে দিচ্ছি। আপনার পলিসির সুবিধা অব্যাহত রাখতে অনুগ্রহ করে প্রক্রিয়াটি সম্পন্ন করুন।";

export const ACTIVE_LANGUAGES: LanguageInfo[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    status: 'active',
    flag: '🇮🇳',
    voicesCount: 6,
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (IN/Global)',
    status: 'active',
    flag: '🌐',
    voicesCount: 7,
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    status: 'active',
    flag: '🇮🇳',
    voicesCount: 2,
  },
];

export const UPCOMING_GLOBAL_LANGUAGES: LanguageInfo[] = [
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', status: 'upcoming', flag: '🇪🇸', voicesCount: 4 },
  { code: 'fr', name: 'French', nativeName: 'Français', status: 'upcoming', flag: '🇫🇷', voicesCount: 4 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', status: 'upcoming', flag: '🇩🇪', voicesCount: 3 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', status: 'upcoming', flag: '🇯🇵', voicesCount: 3 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', status: 'upcoming', flag: '🇦🇪', voicesCount: 3 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', status: 'upcoming', flag: '🇧🇷', voicesCount: 3 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', status: 'upcoming', flag: '🇰🇷', voicesCount: 3 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', status: 'upcoming', flag: '🇮🇹', voicesCount: 2 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', status: 'upcoming', flag: '🇷🇺', voicesCount: 2 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', status: 'upcoming', flag: '🇹🇷', voicesCount: 2 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', status: 'upcoming', flag: '🇮🇩', voicesCount: 2 },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', status: 'upcoming', flag: '🇻🇳', voicesCount: 2 },
];

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'diya',
    displayName: 'Diya',
    apiVoiceName: 'diya',
    gender: 'Female',
    supportedLanguages: ['hi', 'en'],
    accent: 'Warm & Natural Indian Accent',
    persona: 'Empathetic, clear, and reassuring corporate concierge',
    bestFor: 'Customer Support, Policy Reminders, IVR, Onboarding',
    hardcodedTestSentence: {
      hi: HARDCODED_TEST_LINE_HINDI,
      en: HARDCODED_TEST_LINE_ENGLISH,
    },
  },
  {
    id: 'rishi',
    displayName: 'Rishi',
    apiVoiceName: 'rishi',
    gender: 'Male',
    supportedLanguages: ['bn', 'hi', 'en'],
    accent: 'Clear, Calm & Versatile Polyglot',
    persona: 'Articulate narrator with deep clarity and balanced pacing',
    bestFor: 'Multilingual Audiobooks, News, Corporate Briefs, Explainer Clips',
    hardcodedTestSentence: {
      hi: HARDCODED_TEST_LINE_HINDI,
      en: HARDCODED_TEST_LINE_ENGLISH,
      bn: HARDCODED_TEST_LINE_BENGALI,
    },
  },
  {
    id: 'suhana',
    displayName: 'Suhana',
    apiVoiceName: 'suhana',
    gender: 'Female',
    supportedLanguages: ['bn', 'hi', 'en'],
    accent: 'Melodic, Expressive & Engaging',
    persona: 'Upbeat and friendly assistant with natural intonation',
    bestFor: 'Marketing Promos, Interactive Apps, Conversational Memos',
    hardcodedTestSentence: {
      hi: HARDCODED_TEST_LINE_HINDI,
      en: HARDCODED_TEST_LINE_ENGLISH,
      bn: HARDCODED_TEST_LINE_BENGALI,
    },
  },
  {
    id: 'amitabh',
    displayName: 'Amitabh',
    apiVoiceName: 'amitabh',
    gender: 'Male',
    supportedLanguages: ['hi', 'en'],
    accent: 'Deep, Resonant & Authoritative',
    persona: 'Commanding baritone presence suitable for institutional announcements',
    bestFor: 'Executive Announcements, Documentaries, Legal Disclaimers',
    hardcodedTestSentence: {
      hi: HARDCODED_TEST_LINE_HINDI,
      en: HARDCODED_TEST_LINE_ENGLISH,
    },
  },
  {
    id: 'rashmi',
    displayName: 'Rashmi',
    apiVoiceName: 'rashmi',
    gender: 'Female',
    supportedLanguages: ['hi', 'en'],
    accent: 'Crisp, Energetic & Professional',
    persona: 'Dynamic voice tone designed for quick notices and active calls',
    bestFor: 'Alerts, Banking Notifications, Real-time Reminders',
    hardcodedTestSentence: {
      hi: HARDCODED_TEST_LINE_HINDI,
      en: HARDCODED_TEST_LINE_ENGLISH,
    },
  },
  {
    id: 'roopa',
    displayName: 'Roopa',
    apiVoiceName: 'roopa',
    gender: 'Female',
    supportedLanguages: ['hi', 'en'],
    accent: 'Gentle, Smooth & Educational',
    persona: 'Patient and soothing cadence for step-by-step guidance',
    bestFor: 'E-learning, Guided Workflows, Meditation, Medical Help',
    hardcodedTestSentence: {
      hi: HARDCODED_TEST_LINE_HINDI,
      en: HARDCODED_TEST_LINE_ENGLISH,
    },
  },
];

export const DEFAULT_VOICE_TAGS = [
  '#CustomerSupport',
  '#PolicyRenewal',
  '#Sales',
  '#Greeting',
  '#IVR',
  '#Narration',
  '#Urgent',
  '#Promo',
  '#VoiceMemo',
  '#Notification',
  '#Bengali',
  '#Hindi',
  '#English',
];
