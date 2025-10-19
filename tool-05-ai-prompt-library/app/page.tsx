'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, Star, Users, Clock, Heart, Copy } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CategoryGrid from '../components/CategoryGrid';
import PromptCard from '../components/PromptCard';
import PromptOptimizer from '../components/PromptOptimizer';
import {
  searchPrompts,
  getPopularPrompts,
  getRecentPrompts,
  getCategories,
  getModels,
  getDifficulties,
  getPromptStats,
  Prompt,
  SearchFilters
} from '../lib/search';

export default function Home() {
  const [searchResults, setSearchResults] = useState<Prompt[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedPrompts, setCopiedPrompts] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<'library' | 'optimizer'>('library');

  const categories = getCategories();
  const models = getModels();
  const difficulties = getDifficulties();
  const popularPrompts = getPopularPrompts(6);
  const recentPrompts = getRecentPrompts(6);
  const stats = getPromptStats();

  // Calculate prompt counts per category
  const promptCounts = categories.reduce((acc, category) => {
    acc[category] = searchPrompts('', { category }).length;
    return acc;
  }, {} as { [key: string]: number });

  // Get popular prompts per category
  const popularPromptsByCategory = categories.reduce((acc, category) => {
    acc[category] = searchPrompts('', { category, sortBy: 'popularity' })
      .slice(0, 3)
      .map(p => p.item.title);
    return acc;
  }, {} as { [key: string]: string[] });

  useEffect(() => {
    // Load initial popular prompts
    setSearchResults(popularPrompts);
  }, []);

  const handleSearch = (query: string, filters: SearchFilters) => {
    setIsSearching(true);
    setTimeout(() => {
      const results = searchPrompts(query, filters);
      setSearchResults(results.map(r => r.item));
      setIsSearching(false);
    }, 300);
  };

  const handleCopy = (prompt: Prompt) => {
    setCopiedPrompts(prev => new Set([...prev, prompt.id]));
    setTimeout(() => {
      setCopiedPrompts(prev => {
        const newSet = new Set(prev);
        newSet.delete(prompt.id);
        return newSet;
      });
    }, 2000);
  };

  const handleFavorite = (prompt: Prompt) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(prompt.id)) {
        newSet.delete(prompt.id);
      } else {
        newSet.add(prompt.id);
      }
      return newSet;
    });
  };

  const handleCategorySelect = (category: string) => {
    handleSearch('', { category });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            AI Prompt Library &{' '}
            <span className="text-blue-600 dark:text-blue-400">Optimizer</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Discover {stats.totalPrompts}+ curated AI prompts for ChatGPT, Claude, and Gemini.
            Optimize your prompts for better results. Copy-paste ready templates.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveSection('library')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeSection === 'library'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
            >
              Prompt Library
            </button>
            <button
              onClick={() => setActiveSection('optimizer')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeSection === 'optimizer'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
            >
              Prompt Optimizer
            </button>
          </div>
        </div>

        {activeSection === 'library' ? (
          <>
            {/* Search Bar */}
            <SearchBar
              onSearch={handleSearch}
              categories={categories}
              models={models}
              difficulties={difficulties}
              isLoading={isSearching}
            />

            {/* Category Grid */}
            <CategoryGrid
              categories={categories}
              onCategorySelect={handleCategorySelect}
              promptCounts={promptCounts}
              popularPrompts={popularPromptsByCategory}
            />

            {/* Featured Prompts */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Featured Prompts
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onCopy={handleCopy}
                    onFavorite={handleFavorite}
                    isFavorited={favorites.has(prompt.id)}
                    showDetails={false}
                  />
                ))}
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Search Results
                  </h2>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {searchResults.length} prompts found
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onCopy={handleCopy}
                      onFavorite={handleFavorite}
                      isFavorited={favorites.has(prompt.id)}
                      showDetails={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.totalPrompts}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Total Prompts
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stats.totalCategories}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Categories
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {stats.totalModels}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  AI Models
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {stats.averageViews.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Avg Views
                </div>
              </div>
            </div>
          </>
        ) : (
          <PromptOptimizer />
        )}

        {/* How to Use */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Browse & Search</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Explore our categorized prompt library or use the search to find specific prompts
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Copy & Customize</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Copy the prompt template and customize it with your specific requirements
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Optimize & Improve</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Use our optimizer to improve your prompts for better AI results
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What are AI prompts?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                AI prompts are instructions or questions you give to AI models like ChatGPT, Claude, or Gemini to get specific outputs.
                Well-crafted prompts can significantly improve the quality and relevance of AI responses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I use these prompts?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Simply copy the prompt template, replace the placeholder text (like [TOPIC] or [AUDIENCE]) with your specific information,
                and paste it into your AI tool of choice.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Are these prompts free to use?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes! All prompts in our library are completely free to use. You can copy, modify, and use them for any purpose.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Which AI models work best with these prompts?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our prompts are designed to work with all major AI models including GPT-4, Claude 3.5 Sonnet, and Gemini Pro.
                Each prompt includes recommendations for the best-performing models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}