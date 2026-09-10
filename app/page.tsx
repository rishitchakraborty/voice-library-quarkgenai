'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Mic,
  Sliders,
  Cloud,
  Search,
  Plus,
  RefreshCw,
  Globe2,
  Sparkles,
  Volume2,
  Bookmark,
  Layers,
  Check,
  Heart,
  FileAudio,
  ShieldCheck,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { AudioClip, AppSettings } from '@/lib/types';
import {
  getStoredClips,
  saveStoredClips,
  getStoredSettings,
  saveStoredSettings,
  getLastCloudSyncTime,
  setLastCloudSyncTime,
  DEFAULT_APP_SETTINGS,
} from '@/lib/storage';
import { DEFAULT_VOICE_TAGS, HARDCODED_TEST_LINE_HINDI } from '@/lib/voice-data';
import { TTSGenerator } from '@/components/TTSGenerator';
import { ClipCard } from '@/components/ClipCard';
import { LibrarySearchFilter } from '@/components/LibrarySearchFilter';
import { SettingsModal } from '@/components/SettingsModal';
import { VoiceProfilesModal } from '@/components/VoiceProfilesModal';
import { VoiceRecorderModal } from '@/components/VoiceRecorderModal';
import { QuarkGenLogo } from '@/components/QuarkGenLogo';
import { QuarkGenBackground } from '@/components/QuarkGenBackground';
import { useInspectProtection } from '@/hooks/useInspectProtection';

export default function VoiceLibraryPage() {
  const [clips, setClips] = useState<AudioClip[]>(() => getStoredClips());
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [currentSpeed, setCurrentSpeed] = useState<number>(() => {
    const s = getStoredSettings();
    return s.defaultSpeed || 1.0;
  });
  const [lastSyncTime, setLastSyncTimeState] = useState<string>(() => getLastCloudSyncTime());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Enterprise Inspect and Route Protection Guard
  const { securityNotice, dismissNotice } = useInspectProtection();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('all');
  const [selectedVoiceFilter, setSelectedVoiceFilter] = useState('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'duration-desc' | 'duration-asc' | 'title'
  >('newest');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceProfilesOpen, setIsVoiceProfilesOpen] = useState(false);
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);

  // Sync clips changes to localStorage
  const updateClips = useCallback((newClips: AudioClip[]) => {
    setClips(newClips);
    saveStoredClips(newClips);
  }, []);

  // Update Settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setCurrentSpeed(newSettings.defaultSpeed);
    saveStoredSettings(newSettings);
  };

  // Cloud Sync simulation
  const handleCloudSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      setLastCloudSyncTime(now);
      setLastSyncTimeState(now);
      setIsSyncing(false);
      setSyncToast('Cloud library successfully synchronized');
      setTimeout(() => setSyncToast(null), 3500);
    }, 900);
  };

  // Add new clip to library
  const handleSaveToLibrary = (clip: AudioClip) => {
    const updated = [clip, ...clips];
    updateClips(updated);
    setSyncToast(`Saved "${clip.title}" to Voice Library`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    const updated = clips.map((c) =>
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    );
    updateClips(updated);
  };

  // Delete clip
  const handleDeleteClip = (id: string) => {
    const updated = clips.filter((c) => c.id !== id);
    updateClips(updated);
  };

  // Add Tag to Clip
  const handleAddTag = (clipId: string, newTag: string) => {
    const updated = clips.map((c) =>
      c.id === clipId ? { ...c, tags: [...c.tags, newTag] } : c
    );
    updateClips(updated);
  };

  // Remove Tag from Clip
  const handleRemoveTag = (clipId: string, tagToRemove: string) => {
    const updated = clips.map((c) =>
      c.id === clipId ? { ...c, tags: c.tags.filter((t) => t !== tagToRemove) } : c
    );
    updateClips(updated);
  };

  // Reset to initial seed clips
  const handleResetToSeedClips = () => {
    localStorage.removeItem('vocalis_voice_clips_v1');
    const fresh = getStoredClips();
    setClips(fresh);
    setIsSettingsOpen(false);
  };

  // Available tags collection
  const allAvailableTags = useMemo(() => {
    const set = new Set<string>(DEFAULT_VOICE_TAGS);
    clips.forEach((c) => {
      c.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [clips]);

  // Filtered and Sorted Clips
  const filteredClips = useMemo(() => {
    return clips
      .filter((clip) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = clip.title.toLowerCase().includes(q);
          const matchPrompt = clip.promptText.toLowerCase().includes(q);
          const matchVoice = clip.voiceName.toLowerCase().includes(q);
          const matchTag = clip.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchPrompt && !matchVoice && !matchTag) {
            return false;
          }
        }

        // Language
        if (
          selectedLanguageFilter !== 'all' &&
          clip.language !== selectedLanguageFilter
        ) {
          return false;
        }

        // Voice
        if (
          selectedVoiceFilter !== 'all' &&
          clip.voiceName !== selectedVoiceFilter
        ) {
          return false;
        }

        // Tag
        if (selectedTagFilter && !clip.tags.includes(selectedTagFilter)) {
          return false;
        }

        // Favorites
        if (onlyFavorites && !clip.isFavorite) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'duration-desc') {
          return b.duration - a.duration;
        }
        if (sortBy === 'duration-asc') {
          return a.duration - b.duration;
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [
    clips,
    searchQuery,
    selectedLanguageFilter,
    selectedVoiceFilter,
    selectedTagFilter,
    onlyFavorites,
    sortBy,
  ]);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-200 selection:text-sky-950 overflow-x-hidden">
      {/* Dynamic Animated QuarkGen Constellation & Node Background */}
      <QuarkGenBackground />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Studio Title with QuarkGen Logo */}
          <div className="flex items-center gap-3.5">
            <QuarkGenLogo size={36} showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Voice Library & Studio
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-900 border border-sky-200 uppercase tracking-wider">
                  QuarkGen TTS v3
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5">
                <span className="font-semibold text-[#0084FF]">Developed by QuarkGen.AI</span>
                <span>•</span>
                <span>Hindi • English • Bengali • 18+ Global Languages</span>
              </p>
            </div>
          </div>

          {/* Cloud Sync & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Enterprise Routing & Inspect Shield Indicator */}
            <div
              id="enterprise-shield-badge"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200/80 text-[11px] font-semibold text-sky-900 shadow-2xs"
              title="Enterprise Security Active: Upstream endpoints and API routes are locked against DevTools inspection"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0084FF] shrink-0" />
              <span>Route & Inspect Guard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0084FF] animate-pulse"></span>
            </div>

            {/* Cloud Sync Status Badge */}
            <button
              id="cloud-sync-status-badge"
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
              title="Click to trigger cloud synchronization"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#0084FF] ${isSyncing ? 'animate-spin' : ''}`}
              />
              <span className="hidden md:inline">
                {isSyncing ? 'Syncing...' : 'Cloud Synced'}
              </span>
            </button>

            {/* Record Memo Button */}
            <button
              id="open-record-memo-btn"
              onClick={() => setIsRecorderOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
              title="Record a live voice memo using microphone"
            >
              <Mic className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Record Memo</span>
            </button>

            {/* Voice Personas & 18+ Languages Catalog */}
            <button
              id="open-voice-personas-btn"
              onClick={() => setIsVoiceProfilesOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
              title="Browse voice profiles and 18+ language roadmap"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#0084FF]" />
              <span className="hidden lg:inline">Voice Personas</span>
            </button>

            {/* Settings Modal Shortcut */}
            <button
              id="open-settings-btn"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
              title="Audio settings (output speed slider 0.7 - 1.8 & download formats)"
            >
              <Sliders className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Cloud Sync Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-medium shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Security Alert Toast for Attempted DevTools/Inspect */}
      {securityNotice && (
        <div
          id="quarkgen-security-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-slate-700/80 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-7 h-7 rounded-xl bg-[#0084FF]/20 border border-[#0084FF]/40 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-[#00A2FF]" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold">QuarkGen Enterprise Shield</span>
            <span className="text-slate-300 font-normal text-[11px]">{securityNotice}</span>
          </div>
          <button
            onClick={dismissNotice}
            className="ml-2 text-slate-400 hover:text-white text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Section 1: Interactive TTS Generator Panel */}
        <TTSGenerator
          onSaveToLibrary={handleSaveToLibrary}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenLanguagesModal={() => setIsVoiceProfilesOpen(true)}
          currentSpeed={currentSpeed}
          onSpeedChange={(spd) => {
            setCurrentSpeed(spd);
            setSettings((prev) => ({ ...prev, defaultSpeed: spd }));
            saveStoredSettings({ ...settings, defaultSpeed: spd });
          }}
          maxWordsLimit={settings.maxWordsLimit || 60}
        />

        {/* Section 2: Voice Library Hub */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#00C2FF] to-[#0084FF] text-white flex items-center justify-center shadow-xs">
                <FileAudio className="w-3.5 h-3.5" />
              </div>
              Voice Library & Audio Vault
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize, search, tag, visualize waveforms, and download high-quality audio clips
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200">
              Total Clips: <strong className="text-[#0084FF]">{clips.length}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200">
              Favorites: <strong className="text-rose-600">{clips.filter((c) => c.isFavorite).length}</strong>
            </span>
          </div>
        </div>

        {/* Search, Filter, Sort & Tags Panel */}
        <LibrarySearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLanguage={selectedLanguageFilter}
          onLanguageChange={setSelectedLanguageFilter}
          selectedVoice={selectedVoiceFilter}
          onVoiceChange={setSelectedVoiceFilter}
          selectedTag={selectedTagFilter}
          onTagChange={setSelectedTagFilter}
          availableTags={allAvailableTags}
          onlyFavorites={onlyFavorites}
          onToggleFavorites={() => setOnlyFavorites(!onlyFavorites)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalClipsCount={clips.length}
          filteredClipsCount={filteredClips.length}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedLanguageFilter('all');
            setSelectedVoiceFilter('all');
            setSelectedTagFilter(null);
            setOnlyFavorites(false);
            setSortBy('newest');
          }}
        />

        {/* Clips Grid / Empty State */}
        {filteredClips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClips.map((clip) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                onToggleFavorite={handleToggleFavorite}
                onDeleteClip={handleDeleteClip}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0084FF] flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              No matching voice clips found
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Try modifying your search keywords or resetting active language and tag filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLanguageFilter('all');
                setSelectedVoiceFilter('all');
                setSelectedTagFilter(null);
                setOnlyFavorites(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#0084FF] text-white text-xs font-semibold hover:bg-[#0070DD] transition-colors shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Global Footer with Developed by QuarkGen.AI attribution */}
      <footer className="relative z-10 mt-16 border-t border-slate-200/80 bg-white/90 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <QuarkGenLogo size={24} showText={true} />
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-slate-600 font-medium">
              Developed by <strong className="text-[#0084FF] font-semibold">QuarkGen.AI</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
            <span>Enterprise Audio v3</span>
            <span>•</span>
            <span>Hindi, English, Bengali & 18+ Languages</span>
            <span>•</span>
            <span>0.7x – 1.8x Speed Control</span>
            <span>•</span>
            <span>WAV / MP3 Master Export</span>
          </div>

          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} QuarkGen.AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        clips={clips}
        onImportClips={(imported) => {
          updateClips(imported);
          setSyncToast(`Imported ${imported.length} audio clips`);
        }}
        onClearLibrary={handleResetToSeedClips}
        onSyncNow={handleCloudSync}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
      />

      {/* Voice Profiles & 18+ Multilingual Roadmap Modal */}
      <VoiceProfilesModal
        isOpen={isVoiceProfilesOpen}
        onClose={() => setIsVoiceProfilesOpen(false)}
        onSelectVoiceForTest={(voiceName, lang, testLine) => {
          // Scroll up to TTS generator
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Voice Memo Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isRecorderOpen}
        onClose={() => setIsRecorderOpen(false)}
        onSaveMemo={handleSaveToLibrary}
      />
    </div>
  );
}
