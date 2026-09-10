'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  X,
  Check,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { AudioClip } from '@/lib/types';
import { extractWaveformPeaks, generateSyntheticWaveform } from '@/lib/audio-encoder';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMemo: (clip: AudioClip) => void;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onSaveMemo,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [memoTitle, setMemoTitle] = useState('Voice Memo ' + new Date().toLocaleDateString());
  const [memoTags, setMemoTags] = useState<string[]>(['#VoiceMemo', '#CustomerSupport']);
  const [tagInput, setTagInput] = useState('');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.error('Microphone error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to access microphone. Please ensure microphone permissions are granted.';
      setPermissionError(msg);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    setIsRecording(false);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    let t = tagInput.trim();
    if (!t.startsWith('#')) t = `#${t}`;
    if (!memoTags.includes(t)) {
      setMemoTags([...memoTags, t]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setMemoTags(memoTags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!audioBlob || !audioUrl) return;

    let peaks: number[] = [];
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const arrayBuf = await audioBlob.arrayBuffer();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuf);
      peaks = extractWaveformPeaks(decodedBuffer, 64);
      await audioCtx.close();
    } catch {
      peaks = generateSyntheticWaveform(64, 55);
    }

    const newClip: AudioClip = {
      id: `memo-${Date.now()}`,
      title: memoTitle || 'Recorded Voice Memo',
      promptText: 'Recorded user voice memo audio capture.',
      voiceName: 'user-mic',
      language: 'en',
      speed: 1.0,
      duration: Math.max(1, recordingDuration),
      createdAt: new Date().toISOString(),
      tags: memoTags,
      peaks,
      isFavorite: false,
      type: 'memo',
      cloudSynced: true,
      fileSizeBytes: audioBlob.size,
      audioBlobUrl: audioUrl,
    };

    onSaveMemo(newClip);
    onClose();
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      id="voice-recorder-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="voice-recorder-modal-dialog"
        className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
              <Mic className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-stone-900 text-base">Record Voice Memo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          {permissionError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{permissionError}</span>
            </div>
          )}

          {/* Recording Circle / Visualizer */}
          <div className="flex flex-col items-center justify-center py-4">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-rose-100 text-rose-600 ring-8 ring-rose-200/60 animate-pulse'
                  : audioBlob
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              <Mic className={`w-12 h-12 ${isRecording ? 'animate-bounce' : ''}`} />
            </div>

            {/* Timer */}
            <div className="mt-4 font-mono text-2xl font-bold text-stone-900 tracking-tight">
              {formatTimer(recordingDuration)}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {isRecording
                ? 'Recording live audio...'
                : audioBlob
                ? 'Recording captured successfully'
                : 'Click below to start recording voice memo'}
            </p>
          </div>

          {/* Recorder Controls */}
          <div className="flex items-center justify-center gap-3">
            {!isRecording && !audioBlob && (
              <button
                id="start-mic-record-btn"
                onClick={startRecording}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            )}

            {isRecording && (
              <button
                id="stop-mic-record-btn"
                onClick={stopRecording}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Recording</span>
              </button>
            )}

            {audioBlob && (
              <>
                <button
                  onClick={resetRecording}
                  className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>

                {audioUrl && (
                  <audio controls src={audioUrl} className="h-8 max-w-[200px]" />
                )}
              </>
            )}
          </div>

          {/* Title & Tags Form when recording ready */}
          {audioBlob && (
            <div className="space-y-3 pt-3 border-t border-stone-100 text-left">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Memo Title
                </label>
                <input
                  type="text"
                  value={memoTitle}
                  onChange={(e) => setMemoTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Voice Tags
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {memoTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[11px] font-medium flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddTag} className="flex gap-1.5">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag (e.g. #Urgent)"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0084FF]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            id="save-recorded-memo-btn"
            onClick={handleSave}
            disabled={!audioBlob}
            className="px-5 py-2 rounded-xl bg-[#0084FF] hover:bg-[#0070DD] text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            Save to Voice Library
          </button>
        </div>
      </div>
    </div>
  );
};
