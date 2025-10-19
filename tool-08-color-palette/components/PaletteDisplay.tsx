'use client';

import { useState } from 'react';
import { 
  Download, 
  Share2, 
  RefreshCw, 
  Lock, 
  Unlock,
  Shuffle,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { Color } from '../lib/colorGenerator';
import { exportFormats, downloadFile, copyToClipboard, generateShareableUrl } from '../lib/exporters';
import ColorCard from './ColorCard';

interface PaletteDisplayProps {
  colors: Color[];
  onRegenerate: () => void;
  onLockColor: (index: number) => void;
  onUnlockColor: (index: number) => void;
  onAdjustColor: (index: number, adjustments: { hue?: number; saturation?: number; lightness?: number }) => void;
  paletteName?: string;
}

export default function PaletteDisplay({
  colors,
  onRegenerate,
  onLockColor,
  onUnlockColor,
  onAdjustColor,
  paletteName = 'My Palette'
}: PaletteDisplayProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllColors, setShowAllColors] = useState(true);

  const handleExport = (format: typeof exportFormats[0]) => {
    const content = format.generate(colors, paletteName);
    const filename = `${paletteName.toLowerCase().replace(/\s+/g, '-')}.${format.extension}`;
    downloadFile(content, filename, format.mimeType);
    setShowExportMenu(false);
  };

  const handleShare = async () => {
    const url = generateShareableUrl(colors);
    try {
      await copyToClipboard(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share URL:', err);
    }
  };

  const lockedCount = colors.filter(c => c.locked).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {paletteName}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {colors.length} colors • {lockedCount} locked
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAllColors(!showAllColors)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title={showAllColors ? 'Hide details' : 'Show details'}
          >
            {showAllColors ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <button
            onClick={onRegenerate}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title="Generate new palette"
          >
            <Shuffle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {colors.map((color, index) => (
          <ColorCard
            key={index}
            color={color}
            index={index}
            onLock={onLockColor}
            onUnlock={onUnlockColor}
            onAdjust={onAdjustColor}
            showDetails={showAllColors}
            size="medium"
          />
        ))}
      </div>

      {/* Palette Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          Palette Preview
        </h3>
        <div className="flex rounded-lg overflow-hidden shadow-lg">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 h-16 relative group"
              style={{ backgroundColor: color.hex }}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-white/90 dark:bg-slate-800/90 rounded px-2 py-1">
                  <p className="text-xs font-mono text-slate-900 dark:text-white">
                    {color.hex}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          {showExportMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 z-10">
              <div className="p-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Export Format
                </h4>
                <div className="space-y-1">
                  {exportFormats.map((format) => (
                    <button
                      key={format.name}
                      onClick={() => handleExport(format)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      {format.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Share'}
        </button>

        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
      </div>

      {/* Lock Status */}
      {lockedCount > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {lockedCount} color{lockedCount > 1 ? 's' : ''} locked. 
              Only unlocked colors will be regenerated.
            </span>
          </div>
        </div>
      )}

      {/* Color Information */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {colors.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Colors
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {lockedCount}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Locked
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {colors.length - lockedCount}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Available
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            100%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Free
          </div>
        </div>
      </div>
    </div>
  );
}
