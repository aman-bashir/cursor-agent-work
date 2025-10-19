'use client';

import { useState, useEffect } from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  Sparkles, 
  Shuffle,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { ColorPalette, Theme, generateRandomPalette, generateThemePalette } from '../lib/colorGenerator';
import { cn } from '../lib/utils';
import ThemeSelector from '../components/ThemeSelector';
import ColorPaletteDisplay from '../components/ColorPaletteDisplay';
import ImageColorExtractor from '../components/ImageColorExtractor';

export default function ColorPaletteGeneratorPage() {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);
  const [activeTab, setActiveTab] = useState<'theme' | 'extract' | 'random'>('theme');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate initial random palette
  useEffect(() => {
    if (!currentPalette) {
      const initialPalette = generateRandomPalette();
      setCurrentPalette(initialPalette);
    }
  }, [currentPalette]);

  const handleThemeSelect = (theme: Theme) => {
    setIsGenerating(true);
    setTimeout(() => {
      const palette = generateThemePalette(theme);
      setCurrentPalette(palette);
      setIsGenerating(false);
    }, 500);
  };

  const handleRandomGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const palette = generateRandomPalette();
      setCurrentPalette(palette);
      setIsGenerating(false);
    }, 500);
  };

  const handleColorsExtracted = (colors: string[]) => {
    const palette: ColorPalette = {
      id: Date.now().toString(),
      name: 'Extracted Palette',
      colors: colors.slice(0, 5), // Limit to 5 colors
      type: 'extracted',
      harmony: 'extracted',
      createdAt: new Date().toISOString()
    };
    setCurrentPalette(palette);
  };

  const handleRegenerate = () => {
    if (activeTab === 'random') {
      handleRandomGenerate();
    } else if (activeTab === 'theme') {
      // Regenerate with current theme (if any)
      handleRandomGenerate();
    }
  };

  const handleReset = () => {
    setCurrentPalette(null);
    setActiveTab('theme');
  };

  const tabs = [
    { id: 'theme', label: 'Theme Generator', icon: Sparkles },
    { id: 'extract', label: 'Image Extractor', icon: ImageIcon },
    { id: 'random', label: 'Random Generator', icon: Shuffle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Palette className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Color Palette Generator
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Create beautiful color palettes with themes, extract colors from images, or generate random combinations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-900 dark:text-white">
                Generating your palette...
              </p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'theme' && (
            <ThemeSelector
              onThemeSelect={handleThemeSelect}
              onRandomGenerate={handleRandomGenerate}
            />
          )}

          {activeTab === 'extract' && (
            <ImageColorExtractor
              onColorsExtracted={handleColorsExtracted}
            />
          )}

          {activeTab === 'random' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Shuffle className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Random Generator
                </h2>
              </div>
              
              <div className="text-center py-12">
                <Shuffle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Generate Random Palette
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Click the button below to generate a completely random color palette
                </p>
                <button
                  onClick={handleRandomGenerate}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mx-auto"
                >
                  <Shuffle className="w-5 h-5" />
                  Generate Random Palette
                </button>
              </div>
            </div>
          )}

          {/* Current Palette Display */}
          {currentPalette && (
            <ColorPaletteDisplay
              palette={currentPalette}
              onRegenerate={handleRegenerate}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Theme-Based Generation
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Choose from curated themes like nature, retro, contemporary, and more. Each theme generates harmonious color palettes.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Image Color Extraction
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Upload any image and extract its dominant colors. Perfect for creating palettes inspired by photos, artwork, or designs.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Shuffle className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Random Generation
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Generate completely random color palettes for inspiration. Great for exploring new color combinations and breaking creative blocks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>Powered by advanced color theory and harmony algorithms</p>
        </div>
      </div>
    </div>
  );
}