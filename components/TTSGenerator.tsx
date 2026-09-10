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
} from 'lucide-react';
import { AudioClip, VoiceProfile } from '@/lib/types';
import {
  VOICE_PROFILES,
  ACTIVE_LANGUAGES,
  HARDCODED_TEST_LINE_HINDI,
  HARDCODED_TEST_LINE_ENGLISH,
  HARDCODED_TEST_LINE_BENGALI,
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
}

export const TTSGenerator: React.FC<TTSGeneratorProps> = ({
  onSaveToLibrary,
  onOpenSettings,
  onOpenLanguagesModal,
  currentSpeed,
  onSpeedChange,
  maxWordsLimit = 60,
}) => {
  const componentId = useId();
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'en' | 'bn'>('hi');
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('diya');
  const [promptInput, setPromptInput] = useState<string>(HARDCODED_TEST_LINE_HINDI);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
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

  // Available voices filtered by language
  const availableVoices = VOICE_PROFILES.filter((v) =>
    v.supportedLanguages.includes(selectedLanguage)
  );

  const handleLanguageSelect = (lang: 'hi' | 'en' | 'bn') => {
    setSelectedLanguage(lang);
    const voicesForLang = VOICE_PROFILES.filter((v) => v.supportedLanguages.includes(lang));
    const stillSupported = voicesForLang.some((v) => v.apiVoiceName === selectedVoiceName);
    if (!stillSupported && voicesForLang.length > 0) {
      setSelectedVoiceName(voicesForLang[0].apiVoiceName);
    }
  };

  // Compute words
  const wordsArray = promptInput.trim().split(/\s+/).filter(Boolean);
  const wordCount = promptInput.trim() ? wordsArray.length : 0;
  const isOverWordLimit = wordCount > maxWordsLimit;
  const wordsRemaining = maxWordsLimit - wordCount;

  // Hardcoded test line loader
  const loadHardcodedTestLine = (lang: 'hi' | 'en' | 'bn' = selectedLanguage) => {
    setSelectedLanguage(lang);
    if (lang === 'hi') {
      setPromptInput(HARDCODED_TEST_LINE_HINDI);
    } else if (lang === 'en') {
      setPromptInput(HARDCODED_TEST_LINE_ENGLISH);
    } else if (lang === 'bn') {
      setPromptInput(HARDCODED_TEST_LINE_BENGALI);
      // Ensure selected voice supports Bengali (rishi or suhana)
      if (selectedVoiceName !== 'rishi' && selectedVoiceName !== 'suhana') {
        setSelectedVoiceName('rishi');
      }
    }
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

  const saveCurrentToLibrary = () => {
    if (!generatedClip) return;

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
        `#${generatedClip.language === 'hi' ? 'Hindi' : generatedClip.language === 'bn' ? 'Bengali' : 'English'}`,
        '#VoiceStudio',
        `#${generatedClip.voiceName.charAt(0).toUpperCase() + generatedClip.voiceName.slice(1)}`,
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

  const selectedVoiceObj = VOICE_PROFILES.find(
    (v) => v.apiVoiceName === selectedVoiceName
  );

  return (
    <div
      id="tts-generator-panel"
      className="bg-white/95 rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 mb-6 backdrop-blur-xs relative overflow-hidden"
    >
      {/* Soft gradient accent border at top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00C2FF] via-[#0084FF] to-[#7C3AED]" />

      {/* Top Bar: Title & Fast Language Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-[11px] shadow-xs">
              TTS v3
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              QuarkGen Multilingual Voice Gen AI Studio
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Developed by QuarkGen.AI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Private LLM Voice Engine • Fast multilingual generation across Hindi, English, Bengali & 18+ Global Languages
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Language Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-0.5 text-xs font-medium border border-slate-200/60">
            {ACTIVE_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                id={`lang-tab-${lang.code}`}
                onClick={() => handleLanguageSelect(lang.code as 'hi' | 'en' | 'bn')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedLanguage === lang.code
                    ? 'bg-[#0084FF] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="mr-1">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>

          {/* 18+ Languages Roadmap button */}
          <button
            id="view-18-languages-btn"
            onClick={onOpenLanguagesModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Explore current and upcoming 18+ global languages"
          >
            <Languages className="w-3.5 h-3.5 text-[#0084FF]" />
            <span className="hidden md:inline">18+ Languages</span>
            <span className="md:hidden">18+</span>
          </button>
        </div>
      </div>

      {/* Voice Selection & Speed Control Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
        {/* Voice Profile Selector */}
        <div className="sm:col-span-7">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Voice Persona ({availableVoices.length} Available in {selectedLanguage.toUpperCase()})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableVoices.map((voice) => {
              const isSelected = selectedVoiceName === voice.apiVoiceName;
              return (
                <button
                  key={voice.id}
                  id={`voice-btn-${voice.apiVoiceName}`}
                  onClick={() => setSelectedVoiceName(voice.apiVoiceName)}
                  className={`text-left p-2.5 rounded-xl border transition-all relative ${
                    isSelected
                      ? 'border-[#0084FF] bg-sky-50/70 ring-2 ring-[#0084FF]/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 capitalize">
                      {voice.displayName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-slate-600 border border-slate-200">
                      {voice.gender.charAt(0)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5" title={voice.persona}>
                    {voice.persona}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Output Speed Slider (0.7 to 1.8) */}
        <div className="sm:col-span-5 bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#0084FF]" />
              Output Speed: <span className="text-[#0084FF] font-mono font-bold">{currentSpeed.toFixed(2)}x</span>
            </span>
            <button
              id="open-settings-shortcut"
              onClick={onOpenSettings}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline underline-offset-2"
            >
              Settings
            </button>
          </div>

          <div className="py-2">
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
              <span>0.7x (Slow)</span>
              <span>1.0x (Normal)</span>
              <span>1.8x (Fast)</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1 pt-1">
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
      </div>

      {/* Prompts, Hardcoded Test Sentence & Word Limitation Tracker */}
      <div className="mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            Prompt Text
            <span className="text-slate-400 font-normal text-[11px]">(supports voice cues like [laughter])</span>
          </label>

          {/* Hard-Coded One-Line Test Sentence Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 hidden sm:inline">Hardcoded Test Line:</span>
            <button
              id="load-test-line-hi"
              onClick={() => loadHardcodedTestLine('hi')}
              className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 transition-colors"
              title="Load standard Hindi test line"
            >
              🇮🇳 Test Hindi
            </button>
            <button
              id="load-test-line-en"
              onClick={() => loadHardcodedTestLine('en')}
              className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
              title="Load standard English test line"
            >
              🌐 Test English
            </button>
            <button
              id="load-test-line-bn"
              onClick={() => loadHardcodedTestLine('bn')}
              className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 transition-colors"
              title="Load standard Bengali test line"
            >
              🇮🇳 Test Bengali
            </button>
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
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            Target Voice: <strong className="text-slate-800 capitalize">{selectedVoiceName}</strong> ({selectedLanguage.toUpperCase()})
          </span>
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
            title="Load hardcoded test line and generate instantly"
          >
            <Zap className="w-3.5 h-3.5 inline mr-1 text-[#0084FF]" />
            1-Click Test Line
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
