'use client';

import React from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Heart,
  Tag,
  X,
  Languages,
  ArrowUpDown,
} from 'lucide-react';
import { ACTIVE_LANGUAGES, VOICE_PROFILES } from '@/lib/voice-data';

interface LibrarySearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  availableTags: string[];
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  sortBy: 'newest' | 'oldest' | 'duration-desc' | 'duration-asc' | 'title';
  onSortChange: (sort: 'newest' | 'oldest' | 'duration-desc' | 'duration-asc' | 'title') => void;
  totalClipsCount: number;
  filteredClipsCount: number;
  onResetFilters: () => void;
}

export const LibrarySearchFilter: React.FC<LibrarySearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  selectedVoice,
  onVoiceChange,
  selectedTag,
  onTagChange,
  availableTags,
  onlyFavorites,
  onToggleFavorites,
  sortBy,
  onSortChange,
  totalClipsCount,
  filteredClipsCount,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchQuery ||
    selectedLanguage !== 'all' ||
    selectedVoice !== 'all' ||
    selectedTag !== null ||
    onlyFavorites;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5 mb-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="library-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search audio clips by title, transcript text, voice, or tag..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0084FF] focus:ring-2 focus:ring-sky-500/20 bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort and Favorites Controls */}
        <div className="flex items-center gap-2">
          {/* Favorites Only Toggle */}
          <button
            id="filter-favorites-btn"
            onClick={onToggleFavorites}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              onlyFavorites
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                onlyFavorites ? 'fill-rose-600 text-rose-600' : 'text-slate-400'
              }`}
            />
            <span>Favorites</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              id="library-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="pl-8 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0084FF] appearance-none cursor-pointer hover:bg-slate-50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="duration-desc">Duration (Longest)</option>
              <option value="duration-asc">Duration (Shortest)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Language & Voice Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 mb-3">
        {/* Language Tabs */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 font-medium mr-1">Language:</span>
          <button
            onClick={() => onLanguageChange('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedLanguage === 'all'
                ? 'bg-[#0A0D14] text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {ACTIVE_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedLanguage === lang.code
                  ? 'bg-[#0084FF] text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="mr-1">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>

        {/* Voice Selector Dropdown */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-slate-500 font-medium">Voice:</span>
          <select
            id="library-voice-filter-select"
            value={selectedVoice}
            onChange={(e) => onVoiceChange(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#0084FF] capitalize cursor-pointer"
          >
            <option value="all">All Voices</option>
            {VOICE_PROFILES.map((v) => (
              <option key={v.apiVoiceName} value={v.apiVoiceName}>
                {v.displayName} ({v.gender.charAt(0)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Multiple Voice Tags Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
          <Tag className="w-3 h-3 text-slate-400" />
          Tags:
        </span>

        {availableTags.slice(0, 10).map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onTagChange(isSelected ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#0084FF] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={onResetFilters}
            className="text-xs text-[#0084FF] hover:text-[#0070DD] font-semibold underline ml-auto transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results Count Line */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 mt-3 border-t border-slate-100">
        <span>
          Showing <strong>{filteredClipsCount}</strong> of {totalClipsCount} voice clips
        </span>
        {hasActiveFilters && (
          <span className="text-[#0084FF] font-medium">Filter applied</span>
        )}
      </div>
    </div>
  );
};
