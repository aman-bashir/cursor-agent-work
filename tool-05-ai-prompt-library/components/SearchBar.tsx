'use client';

import { useState } from 'react';
import { Search, Filter, X, SortAsc } from 'lucide-react';
import { SearchFilters } from '../lib/search';

interface SearchBarProps {
    onSearch: (query: string, filters: SearchFilters) => void;
    categories: string[];
    models: string[];
    difficulties: string[];
    isLoading?: boolean;
}

export default function SearchBar({
    onSearch,
    categories,
    models,
    difficulties,
    isLoading = false
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        category: '',
        model: '',
        difficulty: '',
        sortBy: 'popularity'
    });

    const handleSearch = () => {
        onSearch(query, filters);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onSearch(query, newFilters);
    };

    const clearFilters = () => {
        const clearedFilters: SearchFilters = {
            category: '',
            model: '',
            difficulty: '',
            sortBy: 'popularity'
        };
        setFilters(clearedFilters);
        onSearch(query, clearedFilters);
    };

    const hasActiveFilters = filters.category || filters.model || filters.difficulty;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
            {/* Search Input */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search prompts by title, description, or content..."
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                    <Search className="w-4 h-4" />
                    Search
                </button>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 border rounded-lg transition-colors flex items-center gap-2 ${showFilters || hasActiveFilters
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Model Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                AI Model
                            </label>
                            <select
                                value={filters.model || ''}
                                onChange={(e) => handleFilterChange('model', e.target.value)}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Models</option>
                                {models.map((model) => (
                                    <option key={model} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Difficulty
                            </label>
                            <select
                                value={filters.difficulty || ''}
                                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Levels</option>
                                {difficulties.map((difficulty) => (
                                    <option key={difficulty} value={difficulty}>
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Sort By
                            </label>
                            <select
                                value={filters.sortBy || 'popularity'}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="popularity">Most Popular</option>
                                <option value="newest">Newest</option>
                                <option value="alphabetical">A-Z</option>
                                <option value="favorites">Most Favorited</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {filters.category && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                            Category: {filters.category}
                            <button
                                onClick={() => handleFilterChange('category', '')}
                                className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.model && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                            Model: {filters.model}
                            <button
                                onClick={() => handleFilterChange('model', '')}
                                className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.difficulty && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                            Level: {filters.difficulty}
                            <button
                                onClick={() => handleFilterChange('difficulty', '')}
                                className="ml-1 hover:text-purple-600 dark:hover:text-purple-300"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
