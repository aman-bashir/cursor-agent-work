'use client';

import { useState } from 'react';
import { 
  Palette, 
  Shuffle, 
  Sparkles, 
  Search,
  Filter,
  Star,
  TrendingUp
} from 'lucide-react';
import { Theme } from '../lib/colorGenerator';
import themesData from '../data/themes.json';

interface ThemeSelectorProps {
  onThemeSelect: (theme: Theme) => void;
  onRandomGenerate: () => void;
}

export default function ThemeSelector({ onThemeSelect, onRandomGenerate }: ThemeSelectorProps) {
  const [themes] = useState<Theme[]>(themesData as Theme[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMood, setSelectedMood] = useState('All');

  const categories = ['All', ...Array.from(new Set(themes.map(t => t.category)))];
  const moods = ['All', ...Array.from(new Set(themes.map(t => t.mood)))];

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || theme.category === selectedCategory;
    const matchesMood = selectedMood === 'All' || theme.mood === selectedMood;
    return matchesSearch && matchesCategory && matchesMood;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nature': return '🌿';
      case 'retro': return '📺';
      case 'contemporary': return '🏢';
      case 'gentle': return '🌸';
      case 'bold': return '⚡';
      case 'minimalist': return '⚪';
      case 'comfortable': return '🏠';
      case 'refreshing': return '💧';
      case 'seasonal': return '🍂';
      case 'business': return '💼';
      case 'entertainment': return '🎪';
      case 'premium': return '💎';
      case 'technology': return '💻';
      case 'health': return '💚';
      case 'artistic': return '🎨';
      case 'versatile': return '🔄';
      default: return '🎨';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'warm': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
      case 'cool': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'energetic': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'calm': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'professional': return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/20';
      case 'fun': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      case 'minimal': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
      case 'elegant': return 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Theme Generator
        </h2>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search themes..."
              className="w-full p-3 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          <button
            onClick={onRandomGenerate}
            className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Random
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            {moods.map(mood => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThemes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => onThemeSelect(theme)}
            className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
          >
            {/* Theme Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{getCategoryIcon(theme.category)}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {theme.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {theme.description}
                </p>
              </div>
            </div>

            {/* Color Preview */}
            <div className="flex gap-1 mb-3">
              {theme.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded border border-slate-200 dark:border-slate-600"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(theme.mood)}`}>
                {theme.mood}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {theme.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <Palette className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No themes found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Popular Themes */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Popular Themes
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {themes.slice(0, 8).map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeSelect(theme)}
              className="p-3 border border-slate-200 dark:border-slate-600 rounded-lg hover:shadow-md transition-shadow text-left"
            >
              <div className="flex gap-1 mb-2">
                {theme.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {theme.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {themes.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Themes
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {categories.length - 1}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Categories
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {moods.length - 1}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Moods
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
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
