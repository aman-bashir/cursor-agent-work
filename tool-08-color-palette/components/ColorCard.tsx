'use client';

import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  Adjust, 
  Eye,
  EyeOff,
  Download
} from 'lucide-react';
import { Color } from '../lib/colorGenerator';
import { copyToClipboard } from '../lib/exporters';

interface ColorCardProps {
  color: Color;
  index: number;
  onLock?: (index: number) => void;
  onUnlock?: (index: number) => void;
  onAdjust?: (index: number, adjustments: { hue?: number; saturation?: number; lightness?: number }) => void;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ColorCard({ 
  color, 
  index, 
  onLock, 
  onUnlock, 
  onAdjust,
  showDetails = true,
  size = 'medium'
}: ColorCardProps) {
  const [copied, setCopied] = useState(false);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [showAllFormats, setShowAllFormats] = useState(false);
  const [adjustments, setAdjustments] = useState({ hue: 0, saturation: 0, lightness: 0 });

  const handleCopy = async (format: 'hex' | 'rgb' | 'hsl' | 'cmyk') => {
    let text = '';
    switch (format) {
      case 'hex':
        text = color.hex;
        break;
      case 'rgb':
        text = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
        break;
      case 'hsl':
        text = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
        break;
      case 'cmyk':
        text = `cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`;
        break;
    }

    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAdjust = () => {
    if (onAdjust) {
      onAdjust(index, adjustments);
      setAdjustments({ hue: 0, saturation: 0, lightness: 0 });
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-16 h-16';
      case 'large':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg">
      {/* Color Swatch */}
      <div className="relative mb-4">
        <div 
          className={`${getSizeClasses()} rounded-lg shadow-md mx-auto relative overflow-hidden`}
          style={{ backgroundColor: color.hex }}
        >
          {/* Lock/Unlock Button */}
          <button
            onClick={() => color.locked ? onUnlock?.(index) : onLock?.(index)}
            className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-slate-800/80 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            {color.locked ? (
              <Lock className="w-3 h-3 text-slate-600 dark:text-slate-300" />
            ) : (
              <Unlock className="w-3 h-3 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Adjust Button */}
          {onAdjust && (
            <button
              onClick={() => setShowAdjustments(!showAdjustments)}
              className="absolute top-2 left-2 p-1 bg-white/80 dark:bg-slate-800/80 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <Adjust className="w-3 h-3 text-slate-600 dark:text-slate-300" />
            </button>
          )}
        </div>

        {/* Color Name */}
        <div className="text-center mt-2">
          <p className={`font-medium text-slate-900 dark:text-white ${getTextSize()}`}>
            {color.name}
          </p>
        </div>
      </div>

      {/* Color Formats */}
      {showDetails && (
        <div className="space-y-2">
          {/* HEX */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">HEX</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                {color.hex}
              </code>
              <button
                onClick={() => handleCopy('hex')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* RGB */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">RGB</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
              </code>
              <button
                onClick={() => handleCopy('rgb')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* HSL */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">HSL</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
              </code>
              <button
                onClick={() => handleCopy('hsl')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Show More Formats */}
          <button
            onClick={() => setShowAllFormats(!showAllFormats)}
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            {showAllFormats ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showAllFormats ? 'Show Less' : 'Show More'}
          </button>

          {/* Additional Formats */}
          {showAllFormats && (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-600">
              {/* CMYK */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">CMYK</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {color.cmyk.c}%, {color.cmyk.m}%, {color.cmyk.y}%, {color.cmyk.k}%
                  </code>
                  <button
                    onClick={() => handleCopy('cmyk')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Color Adjustments */}
      {showAdjustments && onAdjust && (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
            Adjust Color
          </h4>
          
          <div className="space-y-3">
            {/* Hue */}
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                Hue: {adjustments.hue}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={adjustments.hue}
                onChange={(e) => setAdjustments(prev => ({ ...prev, hue: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                Saturation: {adjustments.saturation}%
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.saturation}
                onChange={(e) => setAdjustments(prev => ({ ...prev, saturation: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Lightness */}
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                Lightness: {adjustments.lightness}%
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.lightness}
                onChange={(e) => setAdjustments(prev => ({ ...prev, lightness: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAdjust}
                className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                Apply
              </button>
              <button
                onClick={() => setAdjustments({ hue: 0, saturation: 0, lightness: 0 })}
                className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
