'use client';

import React, { useState } from 'react';
import {
  Heart,
  Trash2,
  Tag,
  Plus,
  X,
  FileAudio,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AudioClip } from '@/lib/types';
import { WaveformPlayer } from './WaveformPlayer';

interface ClipCardProps {
  clip: AudioClip;
  onToggleFavorite: (id: string) => void;
  onDeleteClip: (id: string) => void;
  onAddTag: (clipId: string, newTag: string) => void;
  onRemoveTag: (clipId: string, tagToRemove: string) => void;
  onGenerateAudio?: (clipId: string) => Promise<void>;
}

export const ClipCard: React.FC<ClipCardProps> = ({
  clip,
  onToggleFavorite,
  onDeleteClip,
  onAddTag,
  onRemoveTag,
  onGenerateAudio,
}) => {
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    let formatted = newTagInput.trim();
    if (!formatted.startsWith('#')) {
      formatted = `#${formatted}`;
    }
    // Avoid duplicates
    if (!clip.tags.includes(formatted)) {
      onAddTag(clip.id, formatted);
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const formattedDate = new Date(clip.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fileSizeKb = Math.round((clip.fileSizeBytes || 200000) / 1024);

  return (
    <div
      id={`clip-card-${clip.id}`}
      className="group bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all duration-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between relative h-full"
    >
      {/* Top Details & Tags */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                  clip.language === 'hi'
                    ? 'bg-sky-50 text-sky-800 border border-sky-200'
                    : clip.language === 'bn'
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    : 'bg-purple-50 text-purple-800 border border-purple-200'
                }`}
              >
                {clip.language === 'hi'
                  ? '🇮🇳 Hindi'
                  : clip.language === 'bn'
                  ? '🇮🇳 Bengali'
                  : '🌐 English'}
              </span>

              <span className="text-[11px] text-stone-500 font-mono">
                {clip.speed.toFixed(2).replace(/\.00$/, '')}x Speed
              </span>

              {clip.cloudSynced && (
                <span
                  className="text-[10px] text-stone-400 flex items-center gap-1"
                  title="Synced with Cloud Storage"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Cloud
                </span>
              )}
            </div>

            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-tight tracking-tight">
              {clip.title}
            </h3>
          </div>

          {/* Quick Actions (Favorite & Delete) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              id={`fav-${clip.id}`}
              onClick={() => onToggleFavorite(clip.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                clip.isFavorite
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-stone-400 hover:text-rose-600 hover:bg-stone-100'
              }`}
              title={clip.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 ${clip.isFavorite ? 'fill-rose-600' : ''}`}
              />
            </button>

            {showDeleteConfirm ? (
              <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                <button
                  id={`confirm-del-${clip.id}`}
                  onClick={() => onDeleteClip(clip.id)}
                  className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 px-1.5 py-0.5 rounded hover:bg-rose-100"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-[11px] text-stone-500 hover:text-stone-800 px-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                id={`del-${clip.id}`}
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors"
                title="Delete clip"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Transcript / Prompt text */}
        <div className="mb-3 bg-stone-50/70 rounded-xl p-2.5 border border-stone-100 text-xs text-stone-700 leading-relaxed">
          <p className={showFullTranscript ? '' : 'line-clamp-2'}>
            {clip.promptText}
          </p>
          {clip.promptText.length > 90 && (
            <button
              onClick={() => setShowFullTranscript(!showFullTranscript)}
              className="mt-1 text-[11px] font-semibold text-[#0084FF] hover:text-[#0070DD] flex items-center gap-0.5"
            >
              {showFullTranscript ? (
                <>
                  <span>Show less</span>
                  <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  <span>Show full prompt</span>
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Multiple Voice Tags list */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {clip.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 group/tag hover:bg-slate-200 transition-colors"
            >
              <span>{tag}</span>
              <button
                onClick={() => onRemoveTag(clip.id, tag)}
                className="text-slate-400 hover:text-rose-600 transition-colors ml-0.5"
                title={`Remove tag ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {isAddingTag ? (
            <form onSubmit={handleAddTagSubmit} className="inline-flex items-center gap-1">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="e.g. Sales"
                autoFocus
                className="w-20 px-2 py-0.5 text-xs rounded-md border border-[#0084FF] focus:outline-none focus:ring-1 focus:ring-[#0084FF] bg-white"
              />
              <button
                type="submit"
                className="text-xs px-2 py-0.5 bg-[#0084FF] text-white rounded-md font-semibold hover:bg-[#0070DD]"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingTag(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border border-dashed border-slate-300 text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Tag</span>
            </button>
          )}
        </div>
      </div>

      {/* Waveform Player Component */}
      <div className="mt-1">
        <WaveformPlayer
          id={`player-${clip.id}`}
          audioUrl={clip.audioBlobUrl}
          peaks={clip.peaks}
          title={clip.title}
          voiceName={clip.voiceName}
          language={clip.language}
          speed={clip.speed}
          duration={clip.duration}
          compact={true}
          onGenerateSpeech={onGenerateAudio ? () => onGenerateAudio(clip.id) : undefined}
        />
      </div>

      {/* Meta Footer */}
      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-3 mt-3 border-t border-stone-100">
        <span suppressHydrationWarning className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <FileAudio className="w-3 h-3" />
          {fileSizeKb} KB
        </span>
      </div>
    </div>
  );
};
