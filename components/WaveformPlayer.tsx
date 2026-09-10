'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Repeat,
  Download,
  Check,
  Sparkles,
} from 'lucide-react';
import { downloadAudioFile, convertWavToMp3 } from '@/lib/audio-encoder';

interface WaveformPlayerProps {
  id?: string;
  audioUrl?: string;
  audioBlob?: Blob;
  peaks?: number[];
  title: string;
  voiceName?: string;
  language?: string;
  speed?: number;
  duration?: number;
  compact?: boolean;
  onEnded?: () => void;
  primaryAction?: React.ReactNode;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  id = 'waveform-player',
  audioUrl,
  audioBlob,
  peaks = [],
  title,
  voiceName = 'diya',
  language,
  speed = 1.0,
  duration = 0,
  compact = false,
  onEnded,
  primaryAction,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [playbackRate, setPlaybackRate] = useState(speed);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Default bars if peaks not provided
  const displayPeaks =
    peaks && peaks.length >= 24
      ? peaks
      : Array.from({ length: 48 }, (_, i) => 0.15 + 0.7 * Math.abs(Math.sin((i + 1) * 0.45)));

  // Setup audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) onEnded();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  // Update speed when prop changes
  useEffect(() => {
    if (audioRef.current && speed) {
      audioRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
  }, [speed]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((err) => {
        console.warn('Audio playback prevented or failed:', err);
      });
    } else {
      audio.pause();
    }
  }, []);

  const seekTo = (percent: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = totalDuration || audio.duration || duration || 1;
    const target = Math.max(0, Math.min(dur, percent * dur));
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(percent);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [0.8, 1.0, 1.25, 1.5, 1.8];
    const currentIndex = rates.findIndex((r) => Math.abs(r - playbackRate) < 0.05);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent =
    totalDuration > 0 ? Math.min(100, (currentTime / totalDuration) * 100) : 0;

  // Handle Download in WAV / MP3
  const handleDownload = async (format: 'wav' | 'mp3') => {
    setDownloadingFormat(format);
    const sanitizedTitle = (title || 'voice-clip')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const filename = `${sanitizedTitle}-${voiceName}-${Date.now()}.${format}`;

    try {
      let blobToUse = audioBlob;

      // If we don't have blob directly, fetch it from url
      if (!blobToUse && audioUrl) {
        const res = await fetch(audioUrl);
        blobToUse = await res.blob();
      }

      if (!blobToUse) {
        throw new Error('No audio source available for download');
      }

      if (format === 'wav') {
        downloadAudioFile(blobToUse, filename);
      } else {
        // Convert WAV to MP3 using lamejs
        const arrayBuffer = await blobToUse.arrayBuffer();
        const mp3Blob = await convertWavToMp3(arrayBuffer);
        downloadAudioFile(mp3Blob, filename);
      }

      setDownloadSuccess(format);
      setTimeout(() => setDownloadSuccess(null), 2500);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloadingFormat(null);
      setShowDownloadMenu(false);
    }
  };

  return (
    <div
      id={id}
      className={`relative w-full rounded-2xl border border-stone-200 bg-white shadow-xs transition-all ${
        compact ? 'p-3 sm:p-4' : 'p-4 sm:p-6'
      }`}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        loop={isLooping}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-stone-900 text-sm sm:text-base truncate tracking-tight">
              {title}
            </h4>
            {language && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 uppercase tracking-wider">
                {language}
              </span>
            )}
            {voiceName && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200/70 capitalize">
                Voice: {voiceName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {primaryAction}

          {/* Download Dropdown */}
          <div className="relative">
            <button
              id={`${id}-download-btn`}
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              disabled={!audioUrl && !audioBlob}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors disabled:opacity-50"
              title="Download audio clip"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 uppercase">{downloadSuccess}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  <span className="hidden sm:inline">Download</span>
                </>
              )}
            </button>

            {showDownloadMenu && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white border border-stone-200 shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  id={`${id}-dl-wav`}
                  onClick={() => handleDownload('wav')}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3 py-2 text-xs text-stone-800 hover:bg-stone-50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold block">WAV (.wav)</span>
                    <span className="text-[10px] text-stone-500">Lossless Studio Master</span>
                  </div>
                  {downloadingFormat === 'wav' ? (
                    <span className="text-[10px] text-sky-600 animate-pulse">Encoding...</span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">24kHz</span>
                  )}
                </button>
                <button
                  id={`${id}-dl-mp3`}
                  onClick={() => handleDownload('mp3')}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3 py-2 text-xs text-stone-800 hover:bg-stone-50 flex items-center justify-between border-t border-stone-100"
                >
                  <div>
                    <span className="font-semibold block">MP3 (.mp3)</span>
                    <span className="text-[10px] text-stone-500">Compressed & Universal</span>
                  </div>
                  {downloadingFormat === 'mp3' ? (
                    <span className="text-[10px] text-sky-600 animate-pulse">Encoding...</span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">128k</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Waveform Display */}
      <div
        id={`${id}-waveform-container`}
        onClick={handleWaveformClick}
        className="group relative w-full h-16 sm:h-20 bg-slate-50/80 rounded-xl px-3 py-2 border border-slate-200/80 cursor-pointer select-none overflow-hidden flex items-center justify-between gap-1"
        title="Click or scrub to seek playback"
      >
        {/* Progress Background Highlight */}
        <div
          className="absolute inset-y-0 left-0 bg-sky-500/10 transition-[width] duration-75 pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Dynamic Scrub Cursor */}
        <div
          className="absolute inset-y-0 w-0.5 bg-[#0084FF] shadow-[0_0_8px_rgba(0,132,255,0.7)] pointer-events-none transition-[left] duration-75 z-10"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="w-2.5 h-2.5 bg-[#0084FF] rounded-full -ml-1 -mt-0.5 shadow-sm" />
        </div>

        {/* Waveform Bars */}
        {displayPeaks.map((peak, index) => {
          const barPercent = (index / displayPeaks.length) * 100;
          const isPassed = barPercent <= progressPercent;
          const heightPercent = Math.max(12, Math.min(100, Math.round(peak * 100)));

          return (
            <div
              key={index}
              className="flex-1 flex items-center justify-center h-full transition-all duration-75"
            >
              <div
                className={`w-full max-w-[4px] rounded-full transition-colors duration-150 ${
                  isPassed
                    ? 'bg-gradient-to-t from-[#0084FF] to-[#00C2FF]'
                    : 'bg-slate-200 group-hover:bg-slate-300'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Transport Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          {/* Main Play / Pause Button */}
          <button
            id={`${id}-play-toggle`}
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#0084FF] hover:bg-[#0070DD] text-white flex items-center justify-center shadow-sm transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          {/* Restart Button */}
          <button
            id={`${id}-restart`}
            onClick={() => seekTo(0)}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            title="Restart clip"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Time Display */}
          <div className="font-mono text-stone-800 tracking-tight font-medium text-xs sm:text-sm pl-1">
            <span>{formatTime(currentTime)}</span>
            <span className="text-stone-400 mx-1">/</span>
            <span className="text-stone-500">{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Right side controls: Speed, Loop, Volume */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Speed Preset Cycle Button */}
          <button
            id={`${id}-speed-badge`}
            onClick={cyclePlaybackRate}
            className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition-colors"
            title="Click to cycle playback speed"
          >
            {playbackRate.toFixed(2).replace(/\.00$/, '')}x
          </button>

          {/* Loop Button */}
          <button
            id={`${id}-loop-toggle`}
            onClick={() => setIsLooping(!isLooping)}
            className={`p-1.5 rounded-lg transition-colors ${
              isLooping
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
            title={isLooping ? 'Looping enabled' : 'Loop disabled'}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-1.5 pl-1 border-l border-stone-200">
            <button
              id={`${id}-mute-toggle`}
              onClick={toggleMute}
              className="p-1 rounded text-stone-500 hover:text-stone-800"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-stone-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-stone-600" />
              )}
            </button>
            <input
              id={`${id}-volume-slider`}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={changeVolume}
              className="w-16 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#0084FF]"
              title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
