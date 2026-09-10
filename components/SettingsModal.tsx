'use client';

import React, { useState } from 'react';
import {
  X,
  Sliders,
  Cloud,
  FileAudio,
  Cpu,
  RefreshCw,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { AppSettings, AudioClip } from '@/lib/types';
import { downloadAudioFile } from '@/lib/audio-encoder';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  clips: AudioClip[];
  onImportClips: (clips: AudioClip[]) => void;
  onClearLibrary: () => void;
  onSyncNow: () => void;
  isSyncing: boolean;
  lastSyncTime: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  clips,
  onImportClips,
  onClearLibrary,
  onSyncNow,
  isSyncing,
  lastSyncTime,
}) => {
  const [speedVal, setSpeedVal] = useState(settings.defaultSpeed);
  const [formatVal, setFormatVal] = useState(settings.defaultDownloadFormat);
  const [wordsVal, setWordsVal] = useState(settings.maxWordsLimit);
  const [cloudSyncVal, setCloudSyncVal] = useState(settings.cloudSyncEnabled);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      defaultSpeed: speedVal,
      defaultDownloadFormat: formatVal,
      maxWordsLimit: wordsVal,
      cloudSyncEnabled: cloudSyncVal,
    });
    onClose();
  };

  const handleExportBackup = () => {
    const dataStr = JSON.stringify(clips, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    downloadAudioFile(blob, `vocalis-voice-library-backup-${Date.now()}.json`);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          onImportClips(parsed);
          setImportStatus(`Successfully restored ${parsed.length} clips!`);
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid backup file format');
        }
      } catch (err) {
        setImportStatus('Failed to read backup file');
      }
    };
    reader.readAsText(file);
  };

  const totalStorageKb = Math.round(
    clips.reduce((acc, c) => acc + (c.fileSizeBytes || 200000), 0) / 1024
  );

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="settings-modal-dialog"
        className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-stone-900 text-base">Studio & Audio Settings</h3>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Audio Output Speed Slider (0.7 to 1.8) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#0084FF]" />
                Default Audio Output Speed
              </label>
              <span className="text-sm font-bold font-mono text-[#0084FF] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                {speedVal.toFixed(2)}x
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage the default playback and synthesis speed for generated audio clips (range: 0.7x to 1.8x).
            </p>

            <div className="pt-2">
              <input
                id="settings-speed-slider"
                type="range"
                min="0.7"
                max="1.8"
                step="0.05"
                value={speedVal}
                onChange={(e) => setSpeedVal(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0084FF]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>0.70x (Slow)</span>
                <span>1.00x (Standard)</span>
                <span>1.80x (Fast)</span>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 pt-1">
              {[0.7, 0.8, 1.0, 1.25, 1.5, 1.8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedVal(s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    Math.abs(speedVal - s) < 0.03
                      ? 'bg-[#0084FF] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Word Limitation for Computational Resource Management */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#0084FF]" />
                Computational Resource Limit
              </label>
              <span className="text-xs font-bold font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {wordsVal} Words Max
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Limits the maximum words per TTS synthesis prompt to manage GPU compute cycles and avoid server throttling.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[40, 60, 80].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWordsVal(w)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    wordsVal === w
                      ? 'bg-sky-50 text-sky-900 border-sky-300 ring-1 ring-sky-400'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {w} Words Limit {w === 60 ? '(Recommended)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Default Download Format */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <FileAudio className="w-4 h-4 text-[#0084FF]" />
              Default Download Format
            </label>
            <p className="text-xs text-slate-500">
              Choose your preferred format for 1-click audio exports. Both WAV and MP3 are always available in the player dropdown.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFormatVal('wav')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formatVal === 'wav'
                    ? 'border-[#0084FF] bg-sky-50/60 ring-2 ring-[#0084FF]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">WAV Audio (.wav)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">24kHz PCM Studio Master</div>
              </button>
              <button
                type="button"
                onClick={() => setFormatVal('mp3')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formatVal === 'mp3'
                    ? 'border-[#0084FF] bg-sky-50/60 ring-2 ring-[#0084FF]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">MP3 Audio (.mp3)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">128kbps Compressed Stream</div>
              </button>
            </div>
          </div>

          {/* Cloud Sync & Storage Engine */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-sky-600" />
                Cloud Sync Capabilities
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={cloudSyncVal}
                  onChange={(e) => setCloudSyncVal(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0084FF]"></div>
              </label>
            </div>

            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Sync Status:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active & Synced
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Library Storage Used:</span>
                <span className="font-mono text-stone-800 font-medium">
                  {totalStorageKb} KB across {clips.length} clips
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Last Synced:</span>
                <span className="text-stone-600">
                  {new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  id="settings-sync-now-btn"
                  type="button"
                  onClick={onSyncNow}
                  disabled={isSyncing}
                  className="flex-1 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Cloud Now'}</span>
                </button>
              </div>
            </div>

            {/* Backup Export & Import */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex-1 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export Library Backup</span>
              </button>

              <label className="flex-1 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-stone-500" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <p className="text-xs text-amber-700 font-medium">{importStatus}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50/50">
          <button
            type="button"
            onClick={onClearLibrary}
            className="text-xs text-rose-600 hover:text-rose-800 underline font-medium"
          >
            Reset to Sample Clips
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-settings-btn"
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0084FF] hover:bg-[#0070DD] transition-colors shadow-xs"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
