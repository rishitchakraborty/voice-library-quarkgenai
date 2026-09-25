'use client';

import React, { useState } from 'react';
import {
  X,
  Volume2,
  Globe2,
  Sparkles,
  ArrowRight,
  Headphones,
  BookOpen,
  Radio,
  MessageSquare,
  Award,
  Bell,
  GraduationCap,
  Compass,
  Globe,
  Filter,
  Users,
  Check,
} from 'lucide-react';
import { VoiceProfile, SupportedLanguage } from '@/lib/types';
import {
  VOICE_PROFILES,
  VOICE_CATEGORIES,
  ACTIVE_LANGUAGES,
  UPCOMING_GLOBAL_LANGUAGES,
} from '@/lib/voice-data';

interface VoiceProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVoiceForTest: (voiceName: string, language: SupportedLanguage, testLine: string) => void;
}

export const VoiceProfilesModal: React.FC<VoiceProfilesModalProps> = ({
  isOpen,
  onClose,
  onSelectVoiceForTest,
}) => {
  const [activeTab, setActiveTab] = useState<'voices' | 'categories' | 'roadmap'>('voices');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<'all' | 'Female' | 'Male'>('all');
  // State to track active preview language per voice card
  const [voicePreviewLangs, setVoicePreviewLangs] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const filteredVoices = VOICE_PROFILES.filter((v) => {
    if (selectedLangFilter !== 'all' && !v.supportedLanguages.includes(selectedLangFilter)) {
      return false;
    }
    if (selectedCategoryFilter !== 'all' && v.category !== selectedCategoryFilter) {
      return false;
    }
    if (selectedGenderFilter !== 'all' && v.gender !== selectedGenderFilter) {
      return false;
    }
    return true;
  });

  const femaleCount = VOICE_PROFILES.filter((v) => v.gender === 'Female').length;
  const maleCount = VOICE_PROFILES.filter((v) => v.gender === 'Male').length;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Headphones':
        return <Headphones className="w-4 h-4 text-sky-600" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'Radio':
        return <Radio className="w-4 h-4 text-amber-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'Award':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-pink-600" />;
      case 'Bell':
        return <Bell className="w-4 h-4 text-rose-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-teal-600" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-orange-600" />;
      case 'Globe':
      default:
        return <Globe className="w-4 h-4 text-blue-600" />;
    }
  };

  const getLanguageFlag = (code: string) => {
    const l = ACTIVE_LANGUAGES.find((lang) => lang.code === code);
    return l ? l.flag : '🌐';
  };

  const getLanguageName = (code: string) => {
    const l = ACTIVE_LANGUAGES.find((lang) => lang.code === code);
    return l ? l.name : code.toUpperCase();
  };

  return (
    <div
      id="voice-profiles-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="voice-profiles-modal-dialog"
        className="w-full max-w-4xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                <Globe2 className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                Voice Profiles & Multilingual Ecosystem
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#0084FF] text-white">
                12 Voices Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore 12 enterprise voice personas, categorized by domain, gender, and regional/global languages
            </p>
          </div>

          <button
            id="close-voice-profiles-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-2 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-white gap-2">
          <div className="flex items-center gap-4">
            <button
              id="tab-active-voices"
              onClick={() => setActiveTab('voices')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'voices'
                  ? 'border-[#0084FF] text-[#0084FF]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Voice Library (12 Personas)</span>
            </button>

            <button
              id="tab-categories-voices"
              onClick={() => setActiveTab('categories')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'categories'
                  ? 'border-[#0084FF] text-[#0084FF]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Categories & Gender Matrix</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-semibold">
                10 Domains
              </span>
            </button>

            <button
              id="tab-roadmap-voices"
              onClick={() => setActiveTab('roadmap')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'roadmap'
                  ? 'border-[#0084FF] text-[#0084FF]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>18+ Roadmap</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800">
                Next Waves
              </span>
            </button>
          </div>

          {activeTab === 'voices' && (
            <div className="flex items-center gap-1.5 pb-2 text-xs">
              <span className="text-slate-400 font-medium">Gender:</span>
              <button
                onClick={() => setSelectedGenderFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  selectedGenderFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All (12)
              </button>
              <button
                onClick={() => setSelectedGenderFilter('Female')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  selectedGenderFilter === 'Female'
                    ? 'bg-pink-600 text-white font-semibold'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                <span>♀ Female ({femaleCount})</span>
              </button>
              <button
                onClick={() => setSelectedGenderFilter('Male')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  selectedGenderFilter === 'Male'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <span>♂ Male ({maleCount})</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter bar for Voice Library tab */}
        {activeTab === 'voices' && (
          <div className="px-6 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium">Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#0084FF] cursor-pointer"
              >
                <option value="all">All Categories ({VOICE_CATEGORIES.length})</option>
                {VOICE_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.voicesCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Language filter pills */}
            <div className="flex items-center flex-wrap gap-1">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Language:</span>
              <button
                onClick={() => setSelectedLangFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  selectedLangFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {ACTIVE_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLangFilter(l.code)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    selectedLangFilter === l.code
                      ? 'bg-[#0084FF] text-white font-semibold'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                  title={`${l.name} (${l.nativeName})`}
                >
                  <span className="mr-0.5">{l.flag}</span> {l.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'voices' ? (
            <div>
              {filteredVoices.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm font-semibold text-slate-700">No voice personas match the selected filters</p>
                  <button
                    onClick={() => {
                      setSelectedLangFilter('all');
                      setSelectedCategoryFilter('all');
                      setSelectedGenderFilter('all');
                    }}
                    className="mt-2 text-xs text-[#0084FF] font-semibold hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVoices.map((voice) => {
                    const currentLang = (voicePreviewLangs[voice.apiVoiceName] ||
                      (voice.supportedLanguages.includes('hi')
                        ? 'hi'
                        : voice.supportedLanguages[0])) as SupportedLanguage;

                    const testLine =
                      voice.hardcodedTestSentence[currentLang] ||
                      voice.hardcodedTestSentence[voice.supportedLanguages[0]] ||
                      '';

                    return (
                      <div
                        key={voice.id}
                        className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:border-sky-300 hover:bg-white transition-all shadow-2xs flex flex-col justify-between group"
                      >
                        <div>
                          {/* Top row: Name, Badge, Gender & Category */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-sm text-stone-900 capitalize">
                                  {voice.displayName}
                                </span>

                                {/* Gender badge */}
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                    voice.gender === 'Female'
                                      ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                >
                                  <span>{voice.gender === 'Female' ? '♀ Female' : '♂ Male'}</span>
                                </span>

                                {voice.badge && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                                    {voice.badge}
                                  </span>
                                )}
                              </div>

                              {/* Category Badge */}
                              <div className="mt-1 flex items-center gap-1 text-xs text-sky-800 font-semibold">
                                <span className="p-0.5 rounded bg-sky-100 text-sky-700">
                                  <Sparkles className="w-3 h-3" />
                                </span>
                                <span>{voice.category}</span>
                              </div>
                            </div>

                            {/* Supported Language Flags */}
                            <div className="flex items-center gap-1 flex-wrap shrink-0">
                              {voice.supportedLanguages.map((l) => (
                                <button
                                  key={l}
                                  onClick={() =>
                                    setVoicePreviewLangs((prev) => ({
                                      ...prev,
                                      [voice.apiVoiceName]: l,
                                    }))
                                  }
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                                    currentLang === l
                                      ? 'bg-[#0084FF] text-white border-[#0084FF] shadow-xs'
                                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                                  }`}
                                  title={`Switch preview to ${getLanguageName(l)}`}
                                >
                                  <span>{getLanguageFlag(l)}</span>
                                  <span className="uppercase">{l}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <p className="text-xs text-amber-900/90 font-medium mb-1">
                            {voice.accent}
                          </p>

                          <p className="text-xs text-stone-600 mb-2 leading-relaxed">
                            {voice.persona}
                          </p>

                          <div className="text-[11px] text-stone-600 mb-3 bg-white p-2 rounded-xl border border-stone-100">
                            <strong className="text-stone-800">Best For:</strong> {voice.bestFor}
                          </div>

                          {/* Benchmark Test Line for currently selected language */}
                          <div className="text-[11px] text-slate-600 bg-sky-50/60 p-2.5 rounded-xl border border-sky-200/50 mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sky-950 flex items-center gap-1">
                                <span>{getLanguageFlag(currentLang)}</span>
                                <span>Test Sentence ({getLanguageName(currentLang)}):</span>
                              </span>
                              <span className="text-[10px] text-sky-700 font-mono">
                                Click flag above to switch
                              </span>
                            </div>
                            <p className="italic line-clamp-3 text-slate-700">{testLine}</p>
                          </div>
                        </div>

                        {/* Test Button */}
                        <button
                          id={`test-voice-btn-${voice.apiVoiceName}`}
                          onClick={() => {
                            onSelectVoiceForTest(voice.apiVoiceName, currentLang, testLine);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-xl bg-white hover:bg-[#0084FF] hover:text-white text-[#0084FF] border border-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs group-hover:border-[#0084FF]"
                        >
                          <Volume2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          <span>Load & Synthesize in Studio</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : activeTab === 'categories' ? (
            <div className="space-y-4">
              {/* Directory Overview Header */}
              <div className="bg-gradient-to-r from-sky-50 via-indigo-50/60 to-purple-50/60 rounded-2xl p-4 border border-sky-200">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#0084FF]" />
                  Categories & Gender Directory
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  QuarkGen AI provides 12 high-fidelity voice profiles architected across 10 specialized industry categories. With 10 female personas and 2 commanding male personas, every enterprise use case is supported with authentic resonance.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-sky-200/50">
                  <div className="bg-white/80 p-2 rounded-xl text-center">
                    <span className="text-xs text-slate-500 block">Total Voices</span>
                    <span className="text-base font-bold text-slate-900">12 Personas</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl text-center">
                    <span className="text-xs text-slate-500 block">Gender Split</span>
                    <span className="text-base font-bold text-slate-900">10 ♀ / 2 ♂</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl text-center">
                    <span className="text-xs text-slate-500 block">Active Languages</span>
                    <span className="text-base font-bold text-slate-900">10 Languages</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl text-center">
                    <span className="text-xs text-slate-500 block">Domains</span>
                    <span className="text-base font-bold text-slate-900">10 Categories</span>
                  </div>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {VOICE_CATEGORIES.map((category) => {
                  const matchingVoices = VOICE_PROFILES.filter((v) => v.category === category.name);
                  return (
                    <div
                      key={category.name}
                      className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-[#0084FF]/40 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-slate-100">
                              {getCategoryIcon(category.iconName)}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-slate-900">{category.name}</h5>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {matchingVoices.length} {matchingVoices.length === 1 ? 'Voice' : 'Voices'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                          {category.description}
                        </p>

                        {/* Voices in this category */}
                        <div className="space-y-1.5 mb-2">
                          {matchingVoices.map((voice) => {
                            const primaryLang = (
                              voice.supportedLanguages.includes('hi')
                                ? 'hi'
                                : voice.supportedLanguages[0]
                            ) as SupportedLanguage;
                            const sampleText =
                              voice.hardcodedTestSentence[primaryLang] ||
                              voice.hardcodedTestSentence[voice.supportedLanguages[0]] ||
                              '';

                            return (
                              <div
                                key={voice.id}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-sky-50/50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                      voice.gender === 'Female'
                                        ? 'bg-pink-100 text-pink-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}
                                  >
                                    {voice.gender === 'Female' ? '♀ Female' : '♂ Male'}
                                  </span>
                                  <span className="font-bold text-xs text-slate-900 capitalize">
                                    {voice.displayName}
                                  </span>
                                  <div className="flex items-center gap-0.5 text-[10px] text-slate-400">
                                    {voice.supportedLanguages.map((l) => (
                                      <span key={l}>{getLanguageFlag(l)}</span>
                                    ))}
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    onSelectVoiceForTest(voice.apiVoiceName, primaryLang, sampleText);
                                    onClose();
                                  }}
                                  className="text-[11px] font-semibold text-[#0084FF] hover:text-[#0070DD] flex items-center gap-1 hover:underline"
                                >
                                  <span>Select</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-gradient-to-r from-sky-50 to-indigo-50/60 rounded-2xl p-4 border border-sky-200 mb-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0084FF]" />
                  Upcoming Global Languages Roadmap
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  QuarkGen AI is expanding across the Indian subcontinent and international linguistic hubs. With Marathi, Tamil, Telugu, Malayalam, and Arabic now actively deployed in Phase 1, the following languages represent the upcoming pipeline.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {UPCOMING_GLOBAL_LANGUAGES.map((lang) => (
                  <div
                    key={lang.code}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-600 font-medium">
                        Upcoming
                      </span>
                    </div>
                    <div className="font-bold text-xs text-stone-900">{lang.name}</div>
                    <div className="text-[11px] text-stone-500">{lang.nativeName}</div>
                    <div className="text-[10px] text-amber-700 mt-1.5 font-medium">
                      {lang.voicesCount} Voice Personas
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-100 bg-stone-50/50 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>12 Live Voices: 10 Female • 2 Male</span>
            <span className="text-slate-300">|</span>
            <span>10 Active Languages</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
