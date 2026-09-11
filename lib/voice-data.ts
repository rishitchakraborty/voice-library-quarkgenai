import { VoiceProfile, LanguageInfo } from './types';

export const HARDCODED_TEST_LINE_HINDI_FEMALE =
  "[laughter] कन्फर्म करने के लिए धन्यवाद। मैं आपको पेमेंट लिंक भेज दूंगी। कृपया पेमेंट पूरा कर दें, ताकि आपकी पॉलिसी के लाभ बिना किसी रुकावट के जारी रहें। हमें आपके रिन्यूअल का इंतजार रहेगा।";

export const HARDCODED_TEST_LINE_HINDI_MALE =
  "[laughter] कन्फर्म करने के लिए धन्यवाद। मैं आपको पेमेंट लिंक भेज दूंगा। कृपया पेमेंट पूरा कर दें, ताकि आपकी पॉलिसी के लाभ बिना किसी रुकावट के जारी रहें। हमें आपके रिन्यूअल का इंतजार रहेगा।";

export const HARDCODED_TEST_LINE_HINDI = HARDCODED_TEST_LINE_HINDI_FEMALE;

export const HARDCODED_TEST_LINE_ENGLISH =
  "Thank you for confirming. I will send you the verification link right away. Please complete the setup so your benefits continue smoothly without interruption.";

export const HARDCODED_TEST_LINE_BENGALI =
  "নিশ্চিত করার জন্য আপনাকে ধন্যবাদ। আমি এখনই পেমেন্ট লিঙ্ক পাঠিয়ে দিচ্ছি। আপনার পলিসির সুবিধা অব্যাহত রাখতে অনুগ্রহ করে প্রক্রিয়াটি সম্পন্ন করুন।";

/**
 * Intelligently converts Hindi first-person verb gender grammar
 * between Male (पुलिंग) and Female (स्त्रीलिंग).
 */
export function convertHindiGenderGrammar(text: string, targetGender: 'Male' | 'Female'): string {
  if (!text || typeof text !== 'string') return text;

  if (targetGender === 'Male') {
    // Feminine -> Masculine
    return text
      .replace(/भेज\s+दूंगी/g, 'भेज दूंगा')
      .replace(/भेज\s+दूँगी/g, 'भेज दूँगा')
      .replace(/सकती\s+हूं/g, 'सकता हूं')
      .replace(/सकती\s+हूँ/g, 'सकता हूँ')
      .replace(/रही\s+हूं/g, 'रहा हूं')
      .replace(/रही\s+हूँ/g, 'रहा हूँ')
      .replace(/रहूंगी/g, 'रहूंगा')
      .replace(/रहूँगी/g, 'रहूँगा')
      .replace(/चाहती\s+हूं/g, 'चाहता हूं')
      .replace(/चाहती\s+हूँ/g, 'चाहता हूँ')
      .replace(/करती\s+हूं/g, 'करता हूं')
      .replace(/करती\s+हूँ/g, 'करता हूँ')
      .replace(/आई\s+हूं/g, 'आया हूं')
      .replace(/आई\s+हूँ/g, 'आया हूँ')
      .replace(/गई\s+हूं/g, 'गया हूं')
      .replace(/गई\s+हूँ/g, 'गया हूँ')
      .replace(/करूंगी/g, 'करूंगा')
      .replace(/करूँगी/g, 'करूँगा')
      .replace(/बताऊंगी/g, 'बताऊंगा')
      .replace(/बताऊँगी/g, 'बताऊँगा')
      .replace(/दूंगी/g, 'दूंगा')
      .replace(/दूँगी/g, 'दूँगा')
      .replace(/लूंगी/g, 'लूंगा')
      .replace(/लूँगी/g, 'लूँगा')
      .replace(/पाऊंगी/g, 'पाऊंगा')
      .replace(/पाऊँगी/g, 'पाऊँगा')
      .replace(/देखूंगी/g, 'देखूंगा')
      .replace(/देखूँगी/g, 'देखूँगा')
      .replace(/सुनूंगी/g, 'सुनूंगा')
      .replace(/सुनूँगी/g, 'सुनूँगा')
      .replace(/समझाऊंगी/g, 'समझाऊंगा')
      .replace(/समझाऊँगी/g, 'समझाऊँगा');
  } else {
    // Masculine -> Feminine
    return text
      .replace(/भेज\s+दूंगा/g, 'भेज दूंगी')
      .replace(/भेज\s+दूँगा/g, 'भेज दूँगी')
      .replace(/सकता\s+हूं/g, 'सकती हूं')
      .replace(/सकता\s+हूँ/g, 'सकती हूँ')
      .replace(/रहा\s+हूं/g, 'रही हूं')
      .replace(/रहा\s+हूँ/g, 'रही हूँ')
      .replace(/रहूंगा/g, 'रहूंगी')
      .replace(/रहूँगा/g, 'रहूँगी')
      .replace(/चाहता\s+हूं/g, 'चाहती हूं')
      .replace(/चाहता\s+हूँ/g, 'चाहती हूँ')
      .replace(/करता\s+हूं/g, 'करती हूं')
      .replace(/करता\s+हूँ/g, 'करती हूँ')
      .replace(/आया\s+हूं/g, 'आई हूं')
      .replace(/आया\s+हूँ/g, 'आई हूँ')
      .replace(/गया\s+हूं/g, 'गई हूं')
      .replace(/गया\s+हूँ/g, 'गई हूँ')
      .replace(/करूंगा/g, 'करूंगी')
      .replace(/करूँगा/g, 'करूँगी')
      .replace(/बताऊंगा/g, 'बताऊंगी')
      .replace(/बताऊँगा/g, 'बताऊँगी')
      .replace(/दूंगा/g, 'दूंगी')
      .replace(/दूँगा/g, 'दूँगी')
      .replace(/लूंगा/g, 'लूंगी')
      .replace(/लूँगा/g, 'लूँगी')
      .replace(/पाऊंगा/g, 'पाऊंगी')
      .replace(/पाऊँगा/g, 'पाऊँगी')
      .replace(/देखूंगा/g, 'देखूंगी')
      .replace(/देखूँगा/g, 'देखूँगी')
      .replace(/सुनूंगा/g, 'सुनूंगी')
      .replace(/सुनूँगा/g, 'सुनूँगी')
      .replace(/समझाऊंगा/g, 'समझाऊंगी')
      .replace(/समझाऊँगा/g, 'समझाऊँगी');
  }
}

export function getPromptForVoiceAndLanguage(
  voiceName: string,
  lang: 'hi' | 'en' | 'bn'
): string {
  const profile = VOICE_PROFILES.find((v) => v.apiVoiceName === voiceName);
  if (profile?.hardcodedTestSentence?.[lang]) {
    return profile.hardcodedTestSentence[lang]!;
  }
  if (lang === 'hi') {
    return profile?.gender === 'Male'
      ? HARDCODED_TEST_LINE_HINDI_MALE
      : HARDCODED_TEST_LINE_HINDI_FEMALE;
  }
  if (lang === 'bn') return HARDCODED_TEST_LINE_BENGALI;
  return HARDCODED_TEST_LINE_ENGLISH;
}

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
      hi: '[laughter] कन्फर्म करने के लिए धन्यवाद। मैं आपको पेमेंट लिंक भेज दूंगी। कृपया पेमेंट पूरा कर दें, ताकि आपकी पॉलिसी के लाभ बिना किसी रुकावट के जारी रहें। हमें आपके रिन्यूअल का इंतजार रहेगा।',
      en: 'Thank you for confirming. I will send you the verification link right away. Please complete the setup so your benefits continue smoothly without interruption.',
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
      hi: '[laughter] कन्फर्म करने के लिए धन्यवाद। मैं आपको पेमेंट लिंक भेज दूंगा। कृपया पेमेंट पूरा कर दें, ताकि आपकी पॉलिसी के लाभ बिना किसी रुकावट के जारी रहें। हमें आपके रिन्यूअल का इंतजार रहेगा।',
      en: 'Thank you for confirming. I will send you the verification link right away. Please complete the setup so your benefits continue smoothly without interruption.',
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
      hi: '[laughter] कन्फर्म करने के लिए बहुत धन्यवाद! मैं आपको तुरंत पेमेंट लिंक भेज दूंगी। कृपया इसे पूरा कर लें ताकि आपकी पॉलिसी के सारे फायदे सुरक्षित रहें। हमें आपकी सहायता करके खुशी होगी।',
      en: 'Thank you so much for confirming! I will send over your payment link immediately. Please complete the setup so your benefits continue smoothly.',
      bn: 'নিশ্চিত করার জন্য অনেক ধন্যবাদ! আমি এখনই আপনার জন্য পেমেন্ট লিঙ্ক পাঠিয়ে দিচ্ছি। অনুগ্রহ করে পেমেন্ট সম্পূর্ণ করে আপনার পলিসি সুরক্ষিত রাখুন।',
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
      hi: '[laughter] कन्फर्म करने के लिए आपका धन्यवाद। मैं आपको सुरक्षित पेमेंट लिंक भेज दूंगा। कृपया निर्धारित समय में भुगतान पूर्ण कर लें, ताकि आपकी पॉलिसी निर्बाध रूप से जारी रहे।',
      en: 'Thank you for confirming. I will dispatch the official documentation and payment link promptly. Please complete the verification at your earliest convenience.',
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
      hi: '[laughter] कन्फर्म करने के लिए धन्यवाद। मैं आपको तुरंत पेमेंट लिंक भेज दूंगी। कृपया बिना किसी देरी के पेमेंट पूरा कर दें, ताकि आपकी पॉलिसी के लाभ बिना रुकावट के जारी रहें।',
      en: 'Thank you for confirming. I will send you the instant payment link right away. Please complete the transaction to keep your policy active.',
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
      hi: '[laughter] कन्फर्म करने के लिए आपका बहुत धन्यवाद। मैं आपको सुरक्षित पेमेंट लिंक भेज दूंगी। कृपया धैर्यपूर्वक पेमेंट पूरा कर लें, ताकि आपके सभी लाभ सुचारू रूप से बने रहें।',
      en: 'Thank you kindly for confirming. I will share the step-by-step verification link with you now. Please take your time to complete it smoothly.',
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
