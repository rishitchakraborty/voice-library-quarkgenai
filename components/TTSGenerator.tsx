'use client';

import React, { useState, useId, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  RotateCcw,
  Sliders,
  AlertCircle,
  Plus,
  BookmarkCheck,
  Languages,
  CheckCircle2,
  ChevronDown,
  Volume2,
  Filter,
  Users,
} from 'lucide-react';
import { AudioClip, VoiceProfile, SupportedLanguage, VoiceCategory } from '@/lib/types';
import {
  VOICE_PROFILES,
  VOICE_CATEGORIES,
  ACTIVE_LANGUAGES,
  HARDCODED_TEST_LINE_HINDI_FEMALE,
  HARDCODED_TEST_LINE_HINDI_MALE,
  HARDCODED_TEST_LINE_HINDI,
  HARDCODED_TEST_LINE_ENGLISH,
  HARDCODED_TEST_LINE_BENGALI,
  convertHindiGenderGrammar,
  getPromptForVoiceAndLanguage,
} from '@/lib/voice-data';
import { extractWaveformPeaks, generateSyntheticWaveform } from '@/lib/audio-encoder';
import { WaveformPlayer } from './WaveformPlayer';

interface TTSGeneratorProps {
  onSaveToLibrary: (clip: AudioClip) => void;
  onOpenSettings: () => void;
  onOpenLanguagesModal: () => void;
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  maxWordsLimit?: number;
  externalVoiceSelection?: {
    voiceName: string;
    language: SupportedLanguage;
    promptText: string;
  } | null;
}

export const TTSGenerator: React.FC<TTSGeneratorProps> = ({
  onSaveToLibrary,
  onOpenSettings,
  onOpenLanguagesModal,
  currentSpeed,
  onSpeedChange,
  maxWordsLimit = 60,
  externalVoiceSelection,
}) => {
  const componentId = useId();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('hi');
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('diya');
  const [promptInput, setPromptInput] = useState<string>(HARDCODED_TEST_LINE_HINDI);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Filters within Studio for fast persona discovery
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<'all' | 'Female' | 'Male'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const [generatedClip, setGeneratedClip] = useState<{
    blob: Blob;
    url: string;
    peaks: number[];
    duration: number;
    title: string;
    prompt: string;
    voiceName: string;
    language: string;
    speed: number;
    saved: boolean;
  } | null>(null);

  // Available voices filtered by language, gender, and category
  const availableVoices = VOICE_PROFILES.filter((v) => {
    // 1. Language match
    if (!v.supportedLanguages.includes(selectedLanguage)) return false;
    // 2. Gender match
    if (selectedGenderFilter !== 'all' && v.gender !== selectedGenderFilter) return false;
    // 3. Category match
    if (selectedCategoryFilter !== 'all' && v.category !== selectedCategoryFilter) return false;
    return true;
  });

  useEffect(() => {
    if (externalVoiceSelection) {
      setSelectedVoiceName(externalVoiceSelection.voiceName);
      setSelectedLanguage(externalVoiceSelection.language);
      setPromptInput(externalVoiceSelection.promptText);
    }
  }, [externalVoiceSelection]);

  // Voice Persona selection handler: updates target voice, switches prompt text and applies gender grammar
  const handleVoiceSelect = (voice: VoiceProfile) => {
    setSelectedVoiceName(voice.apiVoiceName);

    // If the selected voice does not support current language, switch to its first supported language
    let langToUse = selectedLanguage;
    if (!voice.supportedLanguages.includes(selectedLanguage)) {
      langToUse = voice.supportedLanguages[0] as SupportedLanguage;
      setSelectedLanguage(langToUse);
    }

    const tailoredSentence =
      voice.hardcodedTestSentence?.[langToUse] ||
      getPromptForVoiceAndLanguage(voice.apiVoiceName, langToUse);

    // Check if the current prompt matches benchmark lines or is empty
    const isDefaultOrBenchmark =
      !promptInput.trim() ||
      VOICE_PROFILES.some((p) =>
        Object.values(p.hardcodedTestSentence).includes(promptInput.trim())
      ) ||
      promptInput.trim() === HARDCODED_TEST_LINE_HINDI_FEMALE ||
      promptInput.trim() === HARDCODED_TEST_LINE_HINDI_MALE;

    if (isDefaultOrBenchmark && tailoredSentence) {
      setPromptInput(tailoredSentence);
    } else if (langToUse === 'hi') {
      // If user has custom text in Hindi, convert its gender grammar to match the voice
      const converted = convertHindiGenderGrammar(promptInput, voice.gender as 'Male' | 'Female');
      setPromptInput(converted);
    } else if (tailoredSentence) {
      setPromptInput(tailoredSentence);
    }

    setGenerationError(null);
  };

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    const voicesForLang = VOICE_PROFILES.filter((v) => v.supportedLanguages.includes(lang));
    let voiceToUse = selectedVoiceName;
    const stillSupported = voicesForLang.some((v) => v.apiVoiceName === selectedVoiceName);
    if (!stillSupported && voicesForLang.length > 0) {
      voiceToUse = voicesForLang[0].apiVoiceName;
      setSelectedVoiceName(voiceToUse);
    }

    const activeVoice = VOICE_PROFILES.find((v) => v.apiVoiceName === voiceToUse);
    const testLine =
      activeVoice?.hardcodedTestSentence?.[lang] ||
      getPromptForVoiceAndLanguage(voiceToUse, lang);
    setPromptInput(testLine);
  };

  // Compute words
  const wordsArray = promptInput.trim().split(/\s+/).filter(Boolean);
  const wordCount = promptInput.trim() ? wordsArray.length : 0;
  const isOverWordLimit = wordCount > maxWordsLimit;
  const wordsRemaining = maxWordsLimit - wordCount;

  // Hardcoded test line loader respecting active voice and language
  const loadHardcodedTestLine = (lang: SupportedLanguage = selectedLanguage) => {
    setSelectedLanguage(lang);
    let voiceToUse = selectedVoiceName;
    const voiceObj = VOICE_PROFILES.find((v) => v.apiVoiceName === voiceToUse);

    // If current voice does not support the chosen test language, switch to first compatible voice
    if (voiceObj && !voiceObj.supportedLanguages.includes(lang)) {
      const compatibleVoice = VOICE_PROFILES.find((v) => v.supportedLanguages.includes(lang));
      if (compatibleVoice) {
        voiceToUse = compatibleVoice.apiVoiceName;
        setSelectedVoiceName(voiceToUse);
      }
    }

    const prompt = getPromptForVoiceAndLanguage(voiceToUse, lang);
    setPromptInput(prompt);
  };

  // Generate TTS Audio via /api/tts
  const handleGenerate = async () => {
    if (!promptInput.trim()) {
      setGenerationError('Please enter text to synthesize.');
      return;
    }

    if (isOverWordLimit) {
      setGenerationError(
        `Prompt exceeds the ${maxWordsLimit} word limit to manage computational resources. Please reduce by ${Math.abs(
          wordsRemaining
        )} words.`
      );
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-QuarkGen-Client': 'v3-enterprise-secure',
        },
        body: JSON.stringify({
          input: promptInput.trim(),
          voice: selectedLanguage,
          voice_name: selectedVoiceName,
          speed: currentSpeed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Generation failed with status ${response.status}`
        );
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Decode audio for authentic peaks
      let peaks: number[] = [];
      let duration = 0;

      try {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const audioCtx = new AudioCtxClass();
        const arrayBuf = await audioBlob.arrayBuffer();
        const decodedBuffer = await audioCtx.decodeAudioData(arrayBuf);
        peaks = extractWaveformPeaks(decodedBuffer, 64);
        duration = decodedBuffer.duration;
        await audioCtx.close();
      } catch {
        peaks = generateSyntheticWaveform(64, Math.floor(Math.random() * 1000));
        duration = Math.max(3, wordCount * 0.45);
      }

      const clipTitle =
        promptInput.trim().slice(0, 38).replace(/[\r\n]+/g, ' ') +
        (promptInput.length > 38 ? '...' : '');

      setGeneratedClip({
        blob: audioBlob,
        url: audioUrl,
        peaks,
        duration,
        title: clipTitle,
        prompt: promptInput.trim(),
        voiceName: selectedVoiceName,
        language: selectedLanguage,
        speed: currentSpeed,
        saved: false,
      });
    } catch (err: unknown) {
      console.error('TTS Generation error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to connect to TTS engine. Please check connection.';
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedVoiceObj = VOICE_PROFILES.find(
    (v) => v.apiVoiceName === selectedVoiceName
  );

  const saveCurrentToLibrary = () => {
    if (!generatedClip) return;

    const langName =
      ACTIVE_LANGUAGES.find((l) => l.code === generatedClip.language)?.name ||
      generatedClip.language.toUpperCase();

    const newClip: AudioClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: generatedClip.title,
      promptText: generatedClip.prompt,
      voiceName: generatedClip.voiceName,
      language: generatedClip.language,
      speed: generatedClip.speed,
      duration: Number(generatedClip.duration.toFixed(1)),
      createdAt: new Date().toISOString(),
      tags: [
        `#${langName.replace(/\s+/g, '')}`,
        `#${generatedClip.voiceName.charAt(0).toUpperCase() + generatedClip.voiceName.slice(1)}`,
        `#${selectedVoiceObj?.category ? selectedVoiceObj.category.replace(/[&\s]+/g, '') : 'VoiceStudio'}`,
        `#${selectedVoiceObj?.gender || 'Voice'}`,
      ],
      peaks: generatedClip.peaks,
      isFavorite: false,
      type: 'tts',
      cloudSynced: true,
      fileSizeBytes: generatedClip.blob.size,
      audioBlobUrl: generatedClip.url,
    };

    onSaveToLibrary(newClip);
    setGeneratedClip((prev) => (prev ? { ...prev, saved: true } : null));
  };

  return (
    <div
      id="tts-generator-panel"
      className="bg-white/95 rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 mb-6 backdrop-blur-xs relative overflow-hidden"
    >
      {/* Soft gradient accent border at top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00C2FF] via-[#0084FF] to-[#7C3AED]" />

      {/* Top Bar: Title & Fast Language Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-[11px] shadow-xs">
              TTS v3 API
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              QuarkGen Multilingual Voice Gen AI Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              12 Voice Personas • 10 Languages
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Private LLM Voice Engine • Fast multilingual generation across Hindi, English, Bengali, Marathi, Tamil, Telugu, Malayalam, US/UK English & Arabic
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Language Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-medium border border-slate-200/60 max-w-full overflow-x-auto">
            {ACTIVE_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                id={`lang-tab-${lang.code}`}
                onClick={() => handleLanguageSelect(lang.code as SupportedLanguage)}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-[11px] ${
                  selectedLanguage === lang.code
                    ? 'bg-[#0084FF] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title={`${lang.name} (${lang.nativeName})`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>

          {/* 18+ Languages Roadmap button */}
          <button
            id="view-18-languages-btn"
            onClick={onOpenLanguagesModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
            title="Explore all 12 voice profiles and categories directory"
          >
            <Users className="w-3.5 h-3.5 text-[#0084FF]" />
            <span>Voice Directory</span>
          </button>
        </div>
      </div>

      {/* Voice Selection & Speed Control Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        {/* Voice Profile Selector */}
        <div className="lg:col-span-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-800">
                Voice Personas ({availableVoices.length} Available in {selectedLanguage.toUpperCase()})
              </label>

              {/* Gender filter pills in Studio */}
              <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 text-[10px]">
                <button
                  onClick={() => setSelectedGenderFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    selectedGenderFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedGenderFilter('Female')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    selectedGenderFilter === 'Female'
                      ? 'bg-pink-100 text-pink-700 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ♀ Female
                </button>
                <button
                  onClick={() => setSelectedGenderFilter('Male')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    selectedGenderFilter === 'Male'
                      ? 'bg-blue-100 text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ♂ Male
                </button>
              </div>
            </div>

            {/* Category Filter Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-700 bg-white focus:outline-none focus:border-[#0084FF] cursor-pointer"
              >
                <option value="all">All Categories</option>
                {VOICE_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Voice cards grid */}
          {availableVoices.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
              <p className="text-xs text-slate-600 mb-1">
                No voices found matching this category/gender filter in {selectedLanguage.toUpperCase()}.
              </p>
              <button
                onClick={() => {
                  setSelectedGenderFilter('all');
                  setSelectedCategoryFilter('all');
                }}
                className="text-xs text-[#0084FF] font-semibold hover:underline"
              >
                Reset filters to view all voices
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[290px] overflow-y-auto pr-1">
              {availableVoices.map((voice) => {
                const isSelected = selectedVoiceName === voice.apiVoiceName;
                return (
                  <button
                    key={voice.id}
                    id={`voice-btn-${voice.apiVoiceName}`}
                    onClick={() => handleVoiceSelect(voice)}
                    className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0084FF] bg-sky-50/80 ring-2 ring-[#0084FF]/25 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                    }`}
                  >
                    <div>
                      {/* Name & Gender Badge */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-slate-900 capitalize truncate">
                          {voice.displayName}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              voice.gender === 'Female'
                                ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {voice.gender === 'Female' ? '♀' : '♂'}
                          </span>
                        </div>
                      </div>

                      {/* Category tag */}
                      <div className="text-[10px] text-sky-800 font-semibold truncate mb-1">
                        {voice.category}
                      </div>

                      {/* Persona snippet */}
                      <p
                        className="text-[11px] text-slate-500 line-clamp-2 leading-tight"
                        title={voice.persona}
                      >
                        {voice.persona}
                      </p>
                    </div>

                    {/* Footer: Supported Language Flags & Badge */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
                      <div className="flex items-center gap-0.5 text-[10px]">
                        {voice.supportedLanguages.map((l) => (
                          <span key={l} title={l.toUpperCase()}>
                            {ACTIVE_LANGUAGES.find((lang) => lang.code === l)?.flag || '🌐'}
                          </span>
                        ))}
                      </div>

                      {voice.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold truncate max-w-[80px]">
                          {voice.badge.replace(/^New •\s*/, '')}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Audio Output Speed Slider (0.7 to 1.8) & Target Voice Overview */}
        <div className="lg:col-span-4 bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#0084FF]" />
                Speed: <span className="text-[#0084FF] font-mono font-bold">{currentSpeed.toFixed(2)}x</span>
              </span>
              <button
                id="open-settings-shortcut"
                onClick={onOpenSettings}
                className="text-[11px] text-slate-500 hover:text-slate-800 underline underline-offset-2"
              >
                Settings
              </button>
            </div>

            <div className="py-1">
              <input
                id="tts-speed-slider"
                type="range"
                min="0.7"
                max="1.8"
                step="0.05"
                value={currentSpeed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0084FF]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0.7x</span>
                <span>1.0x (Normal)</span>
                <span>1.8x</span>
              </div>
            </div>

            {/* Quick presets */}
            <div className="flex items-center gap-1 pt-1.5">
              {[0.8, 1.0, 1.25, 1.5, 1.8].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                    Math.abs(currentSpeed - s) < 0.03
                      ? 'bg-[#0084FF] text-white font-bold shadow-xs'
                      : 'bg-slate-200/70 hover:bg-slate-300/80 text-slate-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Active Voice Persona Card Overview */}
          {selectedVoiceObj && (
            <div className="mt-3 pt-3 border-t border-slate-200/80 bg-white p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-900 capitalize flex items-center gap-1">
                  <span>{selectedVoiceObj.displayName}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedVoiceObj.gender === 'Female'
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {selectedVoiceObj.gender === 'Female' ? '♀ Female' : '♂ Male'}
                  </span>
                </span>
                <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                  {selectedVoiceObj.category}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 line-clamp-1 mb-1">
                {selectedVoiceObj.accent}
              </p>
              <div className="text-[10px] text-slate-600 line-clamp-1">
                <strong className="text-slate-700">Best for:</strong> {selectedVoiceObj.bestFor}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prompts, Hardcoded Test Sentence & Word Limitation Tracker */}
      <div className="mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            Prompt Text
            <span className="text-slate-400 font-normal text-[11px]">(supports voice cues like [laughter])</span>
          </label>

          {/* Dynamic Test Sentence Buttons for current voice's supported languages */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 hidden sm:inline">Benchmark Test Lines:</span>
            {selectedVoiceObj ? (
              selectedVoiceObj.supportedLanguages.map((l) => (
                <button
                  key={l}
                  onClick={() => loadHardcodedTestLine(l as SupportedLanguage)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                    selectedLanguage === l
                      ? 'bg-[#0084FF] text-white border-[#0084FF] shadow-2xs'
                      : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-200'
                  }`}
                  title={`Load benchmark test sentence in ${l.toUpperCase()}`}
                >
                  <span>{ACTIVE_LANGUAGES.find((lang) => lang.code === l)?.flag || '🌐'}</span>
                  <span>{ACTIVE_LANGUAGES.find((lang) => lang.code === l)?.name || l.toUpperCase()}</span>
                </button>
              ))
            ) : (
              <button
                onClick={() => loadHardcodedTestLine('hi')}
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200"
              >
                🇮🇳 Test Line
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            id="tts-prompt-textarea"
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Type or paste the text you want to synthesize..."
            className={`w-full rounded-xl border p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
              isOverWordLimit
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-400/30 bg-rose-50/20'
                : 'border-slate-200 focus:border-[#0084FF] focus:ring-2 focus:ring-sky-500/20 bg-slate-50/30'
            }`}
          />

          {/* Word Limitation Tracker */}
          <div className="flex items-center justify-between px-1 mt-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span
                className={`font-semibold font-mono ${
                  isOverWordLimit
                    ? 'text-rose-600'
                    : wordCount > maxWordsLimit * 0.8
                    ? 'text-[#0084FF]'
                    : 'text-slate-500'
                }`}
              >
                {wordCount} / {maxWordsLimit} words
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                {isOverWordLimit ? (
                  <span className="text-rose-600 font-medium">
                    Limit exceeded by {Math.abs(wordsRemaining)} words!
                  </span>
                ) : (
                  <span>{wordsRemaining} words remaining for resource optimization</span>
                )}
              </span>
            </div>

            <button
              id="clear-prompt-btn"
              onClick={() => setPromptInput('')}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Over-Limit Warning */}
        {isOverWordLimit && (
          <div className="flex items-center gap-2 p-2.5 mt-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>
              <strong>Resource Optimization Guard:</strong> Generations are limited to {maxWordsLimit} words per request. Please truncate or shorten the text.
            </span>
          </div>
        )}

        {/* Generation Error */}
        {generationError && (
          <div className="flex items-start gap-2 p-3 mt-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Generation Alert:</span>
              <span>{generationError}</span>
            </div>
            <button
              onClick={() => setGenerationError(null)}
              className="text-rose-500 hover:text-rose-800 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            Target Voice: <strong className="text-slate-800 capitalize">{selectedVoiceObj?.displayName || selectedVoiceName}</strong> ({selectedLanguage.toUpperCase()} • {selectedVoiceObj?.gender || 'Voice'})
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline text-sky-700 font-medium">{selectedVoiceObj?.category}</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline">24 kHz High-Res PCM</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick 1-Click Test Button with Hardcoded Line */}
          <button
            id="quick-test-generate-btn"
            onClick={() => {
              loadHardcodedTestLine(selectedLanguage);
              setTimeout(() => {
                handleGenerate();
              }, 50);
            }}
            disabled={isGenerating}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            title="Load benchmark test line and synthesize instantly"
          >
            <Zap className="w-3.5 h-3.5 inline mr-1 text-[#0084FF]" />
            1-Click Benchmark Test
          </button>

          {/* Primary Generate Button (QuarkGen Dark Obsidian CTA) */}
          <button
            id="generate-tts-btn"
            onClick={handleGenerate}
            disabled={isGenerating || isOverWordLimit || !promptInput.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0A0D14] hover:bg-[#1E293B] shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-800"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing Voice...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#00C2FF]" />
                <span>Generate Voice</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Latest Generation Output Showcase */}
      {generatedClip && (
        <div className="mt-5 pt-5 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Generated Audio Output
            </span>

            <button
              id="add-generated-to-library-btn"
              onClick={saveCurrentToLibrary}
              disabled={generatedClip.saved}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                generatedClip.saved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-[#0084FF] text-white hover:bg-[#0070DD] shadow-xs'
              }`}
            >
              {generatedClip.saved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Saved in Library</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save to Voice Library</span>
                </>
              )}
            </button>
          </div>

          <WaveformPlayer
            id="active-generated-player"
            audioUrl={generatedClip.url}
            audioBlob={generatedClip.blob}
            peaks={generatedClip.peaks}
            title={generatedClip.title}
            voiceName={generatedClip.voiceName}
            language={generatedClip.language}
            speed={generatedClip.speed}
            duration={generatedClip.duration}
          />
        </div>
      )}
    </div>
  );
};
