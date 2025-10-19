'use client';

import { useState } from 'react';
import { Copy, Heart, Eye, Star, Tag, Users, Clock } from 'lucide-react';
import { Prompt } from '../lib/search';

interface PromptCardProps {
    prompt: Prompt;
    onCopy: (prompt: Prompt) => void;
    onFavorite: (prompt: Prompt) => void;
    isFavorited?: boolean;
    showDetails?: boolean;
}

export default function PromptCard({
    prompt,
    onCopy,
    onFavorite,
    isFavorited = false,
    showDetails = false
}: PromptCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            onCopy(prompt);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleFavorite = () => {
        onFavorite(prompt);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {prompt.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">
                        {prompt.description}
                    </p>
                </div>
                <button
                    onClick={handleFavorite}
                    className={`ml-4 p-2 rounded-lg transition-colors ${isFavorited
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {prompt.category.slice(0, 2).map((cat) => (
                    <span
                        key={cat}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium"
                    >
                        {cat}
                    </span>
                ))}
                {prompt.category.length > 2 && (
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full">
                        +{prompt.category.length - 2}
                    </span>
                )}
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${getDifficultyColor(prompt.difficulty)}`}>
                    {prompt.difficulty}
                </span>
            </div>

            {/* Prompt Preview */}
            {showDetails && (
                <div className="mb-4">
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                        <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
                            {prompt.content.length > 200
                                ? `${prompt.content.substring(0, 200)}...`
                                : prompt.content
                            }
                        </pre>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{prompt.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{prompt.favorites}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(prompt.createdAt)}</span>
                </div>
            </div>

            {/* AI Models */}
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-slate-400" />
                <div className="flex flex-wrap gap-1">
                    {prompt.aiModel.slice(0, 3).map((model) => (
                        <span
                            key={model}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded"
                        >
                            {model}
                        </span>
                    ))}
                    {prompt.aiModel.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded">
                            +{prompt.aiModel.length - 3}
                        </span>
                    )}
                </div>
            </div>

            {/* Tags */}
            {prompt.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                        {prompt.tags.length > 4 && (
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded">
                                +{prompt.tags.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
                <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
}
