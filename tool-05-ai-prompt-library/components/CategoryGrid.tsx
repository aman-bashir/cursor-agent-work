'use client';

import { useState } from 'react';
import {
    FileText,
    Megaphone,
    Briefcase,
    Code,
    Palette,
    GraduationCap,
    Search,
    User,
    TrendingUp,
    Star
} from 'lucide-react';

interface Category {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
    promptCount: number;
    popularPrompts: string[];
}

interface CategoryGridProps {
    categories: string[];
    onCategorySelect: (category: string) => void;
    promptCounts: { [key: string]: number };
    popularPrompts: { [key: string]: string[] };
}

export default function CategoryGrid({
    categories,
    onCategorySelect,
    promptCounts,
    popularPrompts
}: CategoryGridProps) {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
        'Content Writing': FileText,
        'Marketing': Megaphone,
        'Business': Briefcase,
        'Development': Code,
        'Creative': Palette,
        'Education': GraduationCap,
        'SEO': Search,
        'Personal': User
    };

    const categoryColors: { [key: string]: string } = {
        'Content Writing': 'bg-blue-500',
        'Marketing': 'bg-green-500',
        'Business': 'bg-purple-500',
        'Development': 'bg-orange-500',
        'Creative': 'bg-pink-500',
        'Education': 'bg-indigo-500',
        'SEO': 'bg-yellow-500',
        'Personal': 'bg-teal-500'
    };

    const categoryDescriptions: { [key: string]: string } = {
        'Content Writing': 'Blog posts, articles, social media content, and copywriting prompts',
        'Marketing': 'Ad copy, campaigns, email marketing, and promotional content',
        'Business': 'Business plans, reports, analysis, and strategic planning',
        'Development': 'Code generation, debugging, documentation, and technical writing',
        'Creative': 'Stories, scripts, creative writing, and artistic content',
        'Education': 'Lesson plans, study guides, explanations, and educational content',
        'SEO': 'Keyword research, meta descriptions, and search optimization',
        'Personal': 'Career advice, productivity, and personal development'
    };

    const getCategoryData = (category: string): Category => ({
        name: category,
        icon: categoryIcons[category] || FileText,
        color: categoryColors[category] || 'bg-gray-500',
        description: categoryDescriptions[category] || 'AI prompts for various use cases',
        promptCount: promptCounts[category] || 0,
        popularPrompts: popularPrompts[category] || []
    });

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Browse by Category
                </h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Explore our curated collection of AI prompts organized by category.
                    Each category contains specialized prompts designed for specific use cases.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => {
                    const categoryData = getCategoryData(category);
                    const Icon = categoryData.icon;
                    const isHovered = hoveredCategory === category;

                    return (
                        <div
                            key={category}
                            onClick={() => onCategorySelect(category)}
                            onMouseEnter={() => setHoveredCategory(category)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            className="group cursor-pointer"
                        >
                            <div className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${isHovered
                                    ? 'transform scale-105 shadow-xl'
                                    : 'shadow-lg hover:shadow-xl'
                                } bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600`}>

                                {/* Icon */}
                                <div className={`w-12 h-12 ${categoryData.color} rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''
                                    }`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {categoryData.name}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                                    {categoryData.description}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">
                                        {categoryData.promptCount} prompts
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-slate-600 dark:text-slate-300">
                                            Popular
                                        </span>
                                    </div>
                                </div>

                                {/* Popular Prompts Preview */}
                                {categoryData.popularPrompts.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                            Popular prompts:
                                        </p>
                                        <div className="space-y-1">
                                            {categoryData.popularPrompts.slice(0, 2).map((prompt, index) => (
                                                <div
                                                    key={index}
                                                    className="text-xs text-slate-600 dark:text-slate-300 truncate"
                                                >
                                                    • {prompt}
                                                </div>
                                            ))}
                                            {categoryData.popularPrompts.length > 2 && (
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    +{categoryData.popularPrompts.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Hover Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${categoryData.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Object.values(promptCounts).reduce((sum, count) => sum + count, 0)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        Total Prompts
                    </div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {categories.length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        Categories
                    </div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        3+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        AI Models
                    </div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        100%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        Free Access
                    </div>
                </div>
            </div>
        </div>
    );
}
