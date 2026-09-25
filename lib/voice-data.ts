import { VoiceProfile, LanguageInfo, VoiceCategory, CategoryInfo } from './types';

export const HARDCODED_TEST_LINE_HINDI_FEMALE =
  "[laughter] कन्फर्म करने के लिए धन्यवाद। मैं आपको पेमेंट लिंक भेज दूंगी। कृपया पेमेंट पूरा कर दें, ताकि आपकी पॉलिसी के लाभ बिना किसी रुकावट के जारी रहें। हमें आपके रिन्यूअल का इंतजार रहेगा।";

export const HARDCODED_TEST_LINE_HINDI_MALE =
  "[laughter] कन्फर्म करने के लिए धन्यवाद। मैं आपको पेमेंट लिंक भेज दूंगा। कृपया पेमेंट पूरा कर दें, ताकि आपकी पॉलिसी के लाभ बिना किसी रुकावट के जारी रहें। हमें आपके रिन्यूअल का इंतजार रहेगा।";

export const HARDCODED_TEST_LINE_HINDI = HARDCODED_TEST_LINE_HINDI_FEMALE;

export const HARDCODED_TEST_LINE_ENGLISH =
  "Thank you for confirming. I will send you the verification link right away. Please complete the setup so your benefits continue smoothly without interruption.";

export const HARDCODED_TEST_LINE_BENGALI =
  "নিশ্চিত করার জন্য আপনাকে ধন্যবাদ। আমি এখনই পেমেন্ট লিঙ্ক পাঠিয়ে দিচ্ছি। আপনার পলিসির সুবিধা অব্যাহত রাখতে অনুগ্রহ করে প্রক্রিয়াটি সম্পন্ন করুন।";

export const HARDCODED_TEST_LINE_MARATHI =
  "नमस्कार! आपल्या सेवेची खात्री केल्याबद्दल धन्यवाद. मी आपल्याला पुढील प्रक्रियेची माहिती आणि सुरक्षित पेमेंट लिंक पाठवत आहे.";

export const HARDCODED_TEST_LINE_TAMIL =
  "வணக்கம்! உங்கள் பதிவை உறுதிப்படுத்தியதற்கு நன்றி. அடுத்த கட்ட தகவல்களையும் பாதுகாப்பான கட்டண இணைப்பையும் உடனே அனுப்புகிறேன்.";

export const HARDCODED_TEST_LINE_TELUGU =
  "నమస్కారం! ధృవీకరించినందుకు ధన్యవాదాలు. మీ వివరాలు మరియు సురక్షితమైన చెల్లింపు లింక్‌ను ఇప్పుడే పంపుతున్నాను.";

export const HARDCODED_TEST_LINE_MALAYALAM =
  "നമസ്കാരം! സ്ഥിരീകരിച്ചതിന് നന്ദി. നിങ്ങളുടെ പേയ്‌മെന്റ് ലിങ്കും തുടർ വിവരങ്ങളും ഞാൻ ഉടൻ അയയ്ക്കാം.";

export const HARDCODED_TEST_LINE_US_ENGLISH =
  "Hello and welcome! Thank you for connecting with our global support team. I will assist you with seamless international account verification.";

export const HARDCODED_TEST_LINE_UK_ENGLISH =
  "Good day! Thank you for reaching out. We are delighted to assist you with your international account enquiries and verification.";

export const HARDCODED_TEST_LINE_ARABIC =
  "مرحباً بكم! شكراً لتواصلكم معنا. يسعدنا تقديم الدعم الكامل وتسهيل جميع إجراءاتكم بكل سهولة وأمان.";

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
      .replace(/लूँगा/g, 'लूँगा')
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
      .replace(/करता\s+हूँ/g, 'करता हूँ')
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
  lang: string
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
  if (lang === 'mr') return HARDCODED_TEST_LINE_MARATHI;
  if (lang === 'ta') return HARDCODED_TEST_LINE_TAMIL;
  if (lang === 'te') return HARDCODED_TEST_LINE_TELUGU;
  if (lang === 'ml') return HARDCODED_TEST_LINE_MALAYALAM;
  if (lang === 'us') return HARDCODED_TEST_LINE_US_ENGLISH;
  if (lang === 'uk') return HARDCODED_TEST_LINE_UK_ENGLISH;
  if (lang === 'ar') return HARDCODED_TEST_LINE_ARABIC;
  return HARDCODED_TEST_LINE_ENGLISH;
}

export const ACTIVE_LANGUAGES: LanguageInfo[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    status: 'active',
    flag: '🇮🇳',
    voicesCount: 10,
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (IN/Global)',
    status: 'active',
    flag: '🌐',
    voicesCount: 10,
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    status: 'active',
    flag: '🇮🇳',
    voicesCount: 3,
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    status: 'active',
    flag: '🇮🇳',
    voicesCount: 1,
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    status: 'active',
    flag: '🇮🇳',
    voicesCount: 1,
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    status: 'active',
    flag: '🇮🇳',
    voicesCount: 1,
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    status: 'active',
    flag: '🇮🇳',
    voicesCount: 1,
  },
  {
    code: 'us',
    name: 'US English',
    nativeName: 'American English',
    status: 'active',
    flag: '🇺🇸',
    voicesCount: 1,
  },
  {
    code: 'uk',
    name: 'UK English',
    nativeName: 'British English',
    status: 'active',
    flag: '🇬🇧',
    voicesCount: 1,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    status: 'active',
    flag: '🇦🇪',
    voicesCount: 1,
  },
];

export const UPCOMING_GLOBAL_LANGUAGES: LanguageInfo[] = [
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', status: 'upcoming', flag: '🇮🇳', voicesCount: 2 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', status: 'upcoming', flag: '🇪🇸', voicesCount: 4 },
  { code: 'fr', name: 'French', nativeName: 'Français', status: 'upcoming', flag: '🇫🇷', voicesCount: 4 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', status: 'upcoming', flag: '🇩🇪', voicesCount: 3 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', status: 'upcoming', flag: '🇯🇵', voicesCount: 3 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', status: 'upcoming', flag: '🇧🇷', voicesCount: 3 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', status: 'upcoming', flag: '🇰🇷', voicesCount: 3 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', status: 'upcoming', flag: '🇮🇹', voicesCount: 2 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', status: 'upcoming', flag: '🇷🇺', voicesCount: 2 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', status: 'upcoming', flag: '🇹🇷', voicesCount: 2 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', status: 'upcoming', flag: '🇮🇩', voicesCount: 2 },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', status: 'upcoming', flag: '🇻🇳', voicesCount: 2 },
];

export const VOICE_CATEGORIES: CategoryInfo[] = [
  {
    name: 'Customer Support & IVR',
    description: 'Empathetic, clear, and reassuring corporate concierge & advisory personas.',
    iconName: 'Headphones',
    badgeColor: 'sky',
    voicesCount: 2,
  },
  {
    name: 'Audiobooks & Storytelling',
    description: 'Articulate literary cadence and lyrical rhythm for long-form podcasts and novels.',
    iconName: 'BookOpen',
    badgeColor: 'indigo',
    voicesCount: 2,
  },
  {
    name: 'News & Broadcasting',
    description: 'Sharp, authoritative, media-grade diction for prime bulletins, journalism, and live updates.',
    iconName: 'Radio',
    badgeColor: 'amber',
    voicesCount: 1,
  },
  {
    name: 'Conversational & Assistant',
    description: 'Friendly, expressive, and engaging inflections for interactive AI companions and memos.',
    iconName: 'MessageSquare',
    badgeColor: 'emerald',
    voicesCount: 1,
  },
  {
    name: 'Executive & Announcements',
    description: 'Commanding deep baritone presence suitable for institutional announcements and anthems.',
    iconName: 'Award',
    badgeColor: 'purple',
    voicesCount: 1,
  },
  {
    name: 'Commercial & Brand Promos',
    description: 'Dynamic, contemporary urban cadence designed for high-conversion reels and ad spots.',
    iconName: 'Sparkles',
    badgeColor: 'pink',
    voicesCount: 1,
  },
  {
    name: 'Alerts & Notifications',
    description: 'Crisp, urgent, and professional delivery for real-time reminders, OTPs, and banking alerts.',
    iconName: 'Bell',
    badgeColor: 'rose',
    voicesCount: 1,
  },
  {
    name: 'E-Learning & Tutorials',
    description: 'Gentle, patient, and soothing pacing for guided workflows, meditation, and education.',
    iconName: 'GraduationCap',
    badgeColor: 'teal',
    voicesCount: 1,
  },
  {
    name: 'Regional & Vernacular',
    description: 'Authentic regional Indian phonetics across Marathi, Tamil, Telugu, and Malayalam.',
    iconName: 'Compass',
    badgeColor: 'orange',
    voicesCount: 1,
  },
  {
    name: 'Global & Localization',
    description: 'International native accents across US English, UK English, and Gulf Arabic.',
    iconName: 'Globe',
    badgeColor: 'blue',
    voicesCount: 1,
  },
];

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'diya',
    displayName: 'Diya',
    apiVoiceName: 'diya',
    gender: 'Female',
    category: 'Customer Support & IVR',
    categoryDescription: 'Empathetic, clear, and reassuring corporate concierge',
    badge: 'Popular',
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
    category: 'Audiobooks & Storytelling',
    categoryDescription: 'Articulate narrator with deep clarity and balanced pacing',
    badge: 'Polyglot',
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
    category: 'Conversational & Assistant',
    categoryDescription: 'Upbeat and friendly assistant with natural intonation',
    badge: 'Expressive',
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
    category: 'Executive & Announcements',
    categoryDescription: 'Commanding baritone presence for institutional announcements',
    badge: 'Deep Baritone',
    supportedLanguages: ['hi', 'en'],
    accent: 'Deep, Resonant & Authoritative',
    persona: 'Commanding baritone presence suitable for institutional announcements',
    bestFor: 'Executive Announcements, Documentaries, Legal Disclaimers, Brand Anthems',
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
    category: 'Alerts & Notifications',
    categoryDescription: 'Dynamic voice tone designed for quick notices and active calls',
    badge: 'High Energy',
    supportedLanguages: ['hi', 'en'],
    accent: 'Crisp, Energetic & Professional',
    persona: 'Dynamic voice tone designed for quick notices and active calls',
    bestFor: 'Alerts, Banking Notifications, Real-time Reminders, OTP Verification',
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
    category: 'E-Learning & Tutorials',
    categoryDescription: 'Patient and soothing cadence for step-by-step guidance',
    badge: 'Gentle',
    supportedLanguages: ['hi', 'en'],
    accent: 'Gentle, Smooth & Educational',
    persona: 'Patient and soothing cadence for step-by-step guidance',
    bestFor: 'E-learning, Guided Workflows, Meditation, Medical Help',
    hardcodedTestSentence: {
      hi: '[laughter] कन्फर्म करने के लिए आपका बहुत धन्यवाद। मैं आपको सुरक्षित पेमेंट लिंक भेज दूंगी। कृपया धैर्यपूर्वक पेमेंट पूरा कर लें, ताकि आपके सभी लाभ सुचारू रूप से बने रहें।',
      en: 'Thank you kindly for confirming. I will share the step-by-step verification link with you now. Please take your time to complete it smoothly.',
    },
  },
  {
    id: 'anchor',
    displayName: 'Anchor',
    apiVoiceName: 'anchor',
    gender: 'Female',
    category: 'News & Broadcasting',
    categoryDescription: 'Professional news presenter with impeccable diction and journalistic punch',
    badge: 'New • Prime News',
    supportedLanguages: ['hi', 'en'],
    accent: 'Sharp, Confident & Media-Grade Broadcast',
    persona: 'Professional news presenter with impeccable diction and journalistic punch',
    bestFor: 'News Bulletins, Live Broadcasts, Podcasts, Daily Briefings, Press Releases',
    hardcodedTestSentence: {
      hi: 'नमस्कार, मुख्य समाचारों में आपका स्वागत है। आज के विशेष बुलेटिन में हम आपको डिजिटल नवाचार और आर्टिफिशियल इंटेलिजेंस की ताज़ा जानकारियाँ देंगे।',
      en: 'Good evening, welcome to the prime briefing. Here are the top headlines and industry updates shaping the artificial intelligence ecosystem today.',
    },
  },
  {
    id: 'moushumi',
    displayName: 'Moushumi',
    apiVoiceName: 'moushumi',
    gender: 'Female',
    category: 'Audiobooks & Storytelling',
    categoryDescription: 'Warm literary narrator and cultural storyteller with evocative warmth',
    badge: 'New • Literary',
    supportedLanguages: ['bn', 'hi', 'en'],
    accent: 'Lyrical, Expressive & Culturally Rich',
    persona: 'Warm literary narrator and cultural storyteller with evocative warmth',
    bestFor: 'Literary Podcasts, Bengali & Hindi Literature, Heritage Audio, Poetry, Children Stories',
    hardcodedTestSentence: {
      bn: 'নমস্কার, সাহিত্যের আসরে আপনাদের সকলকে স্বাগত। এই পর্বে আমরা আলোচনা করব বাংলার রূপকথা ও ধ্রুপদী কাব্যের ছন্দ নিয়ে।',
      hi: 'नमस्कार, कहानी के इस खूबसूरत सफ़र में आपका स्वागत है। आइए सुनते हैं साहित्य और कल्पना की एक अनूठी दास्तान।',
      en: 'Welcome to our storytelling showcase, celebrating timeless literature, heritage narratives, and evocative audio journeys.',
    },
  },
  {
    id: 'nimisha',
    displayName: 'Nimisha',
    apiVoiceName: 'nimisha',
    gender: 'Female',
    category: 'Commercial & Brand Promos',
    categoryDescription: 'Energetic lifestyle presenter with contemporary urban inflections',
    badge: 'New • Lifestyle',
    supportedLanguages: ['hi', 'en'],
    accent: 'Vibrant, Trendy & Modern Indian Accent',
    persona: 'Energetic lifestyle presenter with contemporary urban inflections',
    bestFor: 'Ad Commercials, Social Media Reels, E-Commerce Promos, Product Showcases',
    hardcodedTestSentence: {
      hi: 'क्या आप तैयार हैं इस सीज़न के सबसे बड़े ऑफ़र के लिए? अभी ऐप डाउनलोड करें और पाएँ शानदार डील्स, कैश-बैक और विशेष उपहार!',
      en: 'Are you ready to elevate your digital experience? Check out our latest collection and unlock exclusive premium rewards today!',
    },
  },
  {
    id: 'padma',
    displayName: 'Padma',
    apiVoiceName: 'padma',
    gender: 'Female',
    category: 'Customer Support & IVR',
    categoryDescription: 'Experienced, trusted advisor with compassionate and steady vocal delivery',
    badge: 'New • Advisory',
    supportedLanguages: ['hi', 'en'],
    accent: 'Mature, Reassuring & Dignified',
    persona: 'Experienced, trusted advisor with compassionate and steady vocal delivery',
    bestFor: 'Healthcare Advisory, Public Service Announcements, Pension & Senior Care, Financial Advisory',
    hardcodedTestSentence: {
      hi: 'नमस्ते, आपके स्वास्थ्य और सुरक्षा की जानकारी के लिए हम सदैव तत्पर हैं। कृपया नियमित परामर्श और आवश्यक दिशानिर्देशों का पालन करें।',
      en: 'Welcome to the wellness care service. Your health, comfort, and peace of mind are our highest priority. Please let us know how we can assist you.',
    },
  },
  {
    id: 'puja',
    displayName: 'Puja',
    apiVoiceName: 'puja',
    gender: 'Female',
    category: 'Regional & Vernacular',
    categoryDescription: 'Multi-dialect regional specialist fluent across Marathi, Tamil, Telugu, and Malayalam',
    badge: 'New • 4 Regional Languages',
    supportedLanguages: ['mr', 'ml', 'ta', 'te'],
    accent: 'Authentic Southern & Western Indian Vernaculars',
    persona: 'Multi-dialect regional specialist fluent across Marathi, Tamil, Telugu, and Malayalam',
    bestFor: 'Regional Banking IVR, State Government Services, Vernacular E-Commerce, Localized Narration',
    hardcodedTestSentence: {
      mr: HARDCODED_TEST_LINE_MARATHI,
      ta: HARDCODED_TEST_LINE_TAMIL,
      te: HARDCODED_TEST_LINE_TELUGU,
      ml: HARDCODED_TEST_LINE_MALAYALAM,
    },
  },
  {
    id: 'marry',
    displayName: 'Marry',
    apiVoiceName: 'marry',
    gender: 'Female',
    category: 'Global & Localization',
    categoryDescription: 'Sophisticated global multilingual narrator with crisp international phonetics',
    badge: 'New • US/UK/Arabic',
    supportedLanguages: ['us', 'uk', 'ar'],
    accent: 'Native International Accents (US, UK & Arabic)',
    persona: 'Sophisticated global multilingual narrator with crisp international phonetics',
    bestFor: 'Global SaaS Platforms, International Travel & Hospitality, Cross-Border Telephony, MENA Expansion',
    hardcodedTestSentence: {
      us: HARDCODED_TEST_LINE_US_ENGLISH,
      uk: HARDCODED_TEST_LINE_UK_ENGLISH,
      ar: HARDCODED_TEST_LINE_ARABIC,
    },
  },
];

export const DEFAULT_VOICE_TAGS = [
  '#CustomerSupport',
  '#NewsBroadcast',
  '#PolicyRenewal',
  '#Storytelling',
  '#IVR',
  '#Narration',
  '#Commercial',
  '#UrgentAlert',
  '#Promo',
  '#VoiceMemo',
  '#Elearning',
  '#RegionalLanguages',
  '#GlobalAccents',
  '#Hindi',
  '#English',
  '#Bengali',
  '#Marathi',
  '#Tamil',
  '#Telugu',
  '#Malayalam',
  '#Arabic',
];
