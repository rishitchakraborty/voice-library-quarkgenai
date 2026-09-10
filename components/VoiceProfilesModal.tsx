'use client';

import React, { useState } from 'react';
import {
  X,
  Volume2,
  Globe2,
  CheckCircle,
  Sparkles,
  Play,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { VoiceProfile } from '@/lib/types';
import {
  VOICE_PROFILES,
  ACTIVE_LANGUAGES,
  UPCOMING_GLOBAL_LANGUAGES,
} from '@/lib/voice-data';

interface VoiceProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVoiceForTest: (voiceName: string, language: 'hi' | 'en' | 'bn', testLine: string) => void;
}

export const VoiceProfilesModal: React.FC<VoiceProfilesModalProps> = ({
  isOpen,
  onClose,
  onSelectVoiceForTest,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'roadmap'>('active');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredVoices = VOICE_PROFILES.filter((v) => {
    if (selectedLangFilter === 'all') return true;
    return v.supportedLanguages.includes(selectedLangFilter);
  });

  return (
    <div
      id="voice-profiles-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="voice-profiles-modal-dialog"
        className="w-full max-w-3xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
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
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore available voice personas for Hindi, English & Bengali, plus the 18+ global languages roadmap
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
        <div className="px-6 pt-3 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <button
              id="tab-active-voices"
              onClick={() => setActiveTab('active')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'active'
                  ? 'border-[#0084FF] text-[#0084FF]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Supported Voices (Hindi, English, Bengali)
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
              <span>18+ Global Languages Roadmap</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800">
                Future Updates
              </span>
            </button>
          </div>

          {activeTab === 'active' && (
            <div className="flex items-center gap-1 pb-2">
              <span className="text-[11px] text-slate-400 mr-1">Filter:</span>
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
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'active' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVoices.map((voice) => {
                const primaryLang = (
                  voice.supportedLanguages.includes('hi')
                    ? 'hi'
                    : voice.supportedLanguages[0]
                ) as 'hi' | 'en' | 'bn';
                const testLine =
                  voice.hardcodedTestSentence[primaryLang] ||
                  voice.hardcodedTestSentence.en ||
                  voice.hardcodedTestSentence.hi ||
                  '';

                return (
                  <div
                    key={voice.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:border-amber-400 hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-stone-900 capitalize">
                              {voice.displayName}
                            </span>
                            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 font-medium">
                              {voice.gender}
                            </span>
                          </div>
                          <p className="text-xs text-amber-800/90 font-medium mt-0.5">
                            {voice.accent}
                          </p>
                        </div>

                        {/* Language badges */}
                        <div className="flex items-center gap-1">
                          {voice.supportedLanguages.map((l) => (
                            <span
                              key={l}
                              className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white text-stone-700 border border-stone-200"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 mb-2 leading-relaxed">
                        {voice.persona}
                      </p>

                      <div className="text-[11px] text-stone-500 mb-3 bg-white p-2 rounded-xl border border-stone-100">
                        <strong className="text-stone-700">Best For:</strong> {voice.bestFor}
                      </div>

                      {/* Hardcoded test line snippet */}
                      <div className="text-[11px] text-slate-600 bg-sky-50/60 p-2.5 rounded-xl border border-sky-200/50 mb-3">
                        <span className="font-semibold text-sky-950 block mb-0.5">
                          Hardcoded Benchmark Test Sentence:
                        </span>
                        <p className="italic line-clamp-2 text-slate-700">{testLine}</p>
                      </div>
                    </div>

                    <button
                      id={`test-voice-btn-${voice.apiVoiceName}`}
                      onClick={() => {
                        onSelectVoiceForTest(voice.apiVoiceName, primaryLang, testLine);
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-[#0084FF] hover:text-white text-[#0084FF] border border-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs group"
                    >
                      <Volume2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>Test & Synthesize This Voice</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <div className="bg-gradient-to-r from-sky-50 to-indigo-50/60 rounded-2xl p-4 border border-sky-200 mb-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0084FF]" />
                  Upcoming 18+ Global Languages Expansion
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Our architecture is actively expanding from the primary Hindi, English, and Bengali foundations to support 18+ regional and international languages for universal reach and worldwide voice applications.
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
                        Q3-Q4
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
          <span>Supported: Hindi, English, Bengali • 18+ Future Targets</span>
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
