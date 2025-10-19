'use client';

import { useState } from 'react';
import { 
  Copy, 
  Download, 
  Palette, 
  Check,
  Eye,
  EyeOff,
  Shuffle,
  RotateCcw
} from 'lucide-react';
import { ColorPalette } from '../lib/colorGenerator';
import { cn } from '../lib/utils';

interface ColorPaletteDisplayProps {
  palette: ColorPalette;
  onRegenerate: () => void;
  onReset: () => void;
}

export default function ColorPaletteDisplay({ 
  palette, 
  onRegenerate, 
  onReset 
}: ColorPaletteDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showHex, setShowHex] = useState(true);
  const [showRgb, setShowRgb] = useState(false);
  const [showHsl, setShowHsl] = useState(false);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadPalette = () => {
    const data = {
      name: palette.name,
      colors: palette.colors,
      type: palette.type,
      harmony: palette.harmony,
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSS = () => {
    const cssVars = palette.colors.map((color, index) => 
      `  --color-${index + 1}: ${color};`
    ).join('\n');
    
    const css = `/* ${palette.name} Color Palette */\n:root {\n${cssVars}\n}\n\n/* Usage Examples */\n.color-1 { color: var(--color-1); }\n.color-2 { color: var(--color-2); }\n.color-3 { color: var(--color-3); }\n.color-4 { color: var(--color-4); }\n.color-5 { color: var(--color-5); }`;
    
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, '-')}-palette.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSCSS = () => {
    const scssVars = palette.colors.map((color, index) => 
      `$color-${index + 1}: ${color};`
    ).join('\n');
    
    const scss = `// ${palette.name} Color Palette\n${scssVars}\n\n// Usage Examples\n.color-1 { color: $color-1; }\n.color-2 { color: $color-2; }\n.color-3 { color: $color-3; }\n.color-4 { color: $color-4; }\n.color-5 { color: $color-5; }`;
    
    const blob = new Blob([scss], { type: 'text/scss' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, '-')}-palette.scss`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    const { r, g, b } = rgb;
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Palette className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {palette.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {palette.type} • {palette.harmony} harmony
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Regenerate
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Color Display Options */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Show:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHex(!showHex)}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors",
              showHex 
                ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" 
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            )}
          >
            <Eye className="w-4 h-4" />
            HEX
          </button>
          <button
            onClick={() => setShowRgb(!showRgb)}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors",
              showRgb 
                ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" 
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            )}
          >
            <Eye className="w-4 h-4" />
            RGB
          </button>
          <button
            onClick={() => setShowHsl(!showHsl)}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors",
              showHsl 
                ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" 
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            )}
          >
            <Eye className="w-4 h-4" />
            HSL
          </button>
        </div>
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {palette.colors.map((color, index) => {
          const rgb = hexToRgb(color);
          const hsl = hexToHsl(color);
          
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Color Swatch */}
              <div
                className="h-32 w-full"
                style={{ backgroundColor: color }}
              />
              
              {/* Color Info */}
              <div className="p-4 bg-white dark:bg-slate-800">
                <div className="space-y-2">
                  {showHex && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        HEX:
                      </span>
                      <button
                        onClick={() => copyToClipboard(color, index)}
                        className="flex items-center gap-1 text-sm font-mono text-slate-900 dark:text-white hover:text-purple-600 transition-colors"
                      >
                        {color}
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  {showRgb && rgb && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        RGB:
                      </span>
                      <button
                        onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, index)}
                        className="flex items-center gap-1 text-sm font-mono text-slate-900 dark:text-white hover:text-purple-600 transition-colors"
                      >
                        {rgb.r}, {rgb.g}, {rgb.b}
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  {showHsl && hsl && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        HSL:
                      </span>
                      <button
                        onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, index)}
                        className="flex items-center gap-1 text-sm font-mono text-slate-900 dark:text-white hover:text-purple-600 transition-colors"
                      >
                        {hsl.h}°, {hsl.s}%, {hsl.l}%
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Download Options */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Download Palette
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadPalette}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
          <button
            onClick={downloadCSS}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            CSS
          </button>
          <button
            onClick={downloadSCSS}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            SCSS
          </button>
        </div>
      </div>

      {/* Palette Preview */}
      <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Palette Preview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color Bar */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Color Bar
            </h4>
            <div className="flex h-16 rounded-lg overflow-hidden shadow-md">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          {/* Color Circle */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Color Circle
            </h4>
            <div className="flex items-center justify-center h-16">
              <div className="flex items-center gap-2">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
