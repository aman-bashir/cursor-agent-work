'use client';

import { useState } from 'react';
import {
    Wand2,
    Copy,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Lightbulb,
    Target,
    FileText,
    Clock,
    Star
} from 'lucide-react';
import { optimizePrompt, getOptimizationTips, OptimizationResult } from '../lib/optimizer';

export default function PromptOptimizer() {
    const [inputPrompt, setInputPrompt] = useState('');
    const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'optimizer' | 'tips'>('optimizer');

    const handleOptimize = () => {
        if (!inputPrompt.trim()) return;

        setIsOptimizing(true);
        // Simulate processing time
        setTimeout(() => {
            const result = optimizePrompt(inputPrompt);
            setOptimizationResult(result);
            setIsOptimizing(false);
        }, 1000);
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
        if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
        return 'bg-red-100 dark:bg-red-900/20';
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const tips = getOptimizationTips();

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Wand2 className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Prompt Optimizer
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('optimizer')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'optimizer'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                >
                    Optimizer
                </button>
                <button
                    onClick={() => setActiveTab('tips')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'tips'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                >
                    Best Practices
                </button>
            </div>

            {activeTab === 'optimizer' ? (
                <div className="space-y-6">
                    {/* Input Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Enter your prompt to optimize
                        </label>
                        <textarea
                            value={inputPrompt}
                            onChange={(e) => setInputPrompt(e.target.value)}
                            placeholder="Paste your prompt here to get optimization suggestions..."
                            className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                {inputPrompt.length} characters
                            </span>
                            <button
                                onClick={handleOptimize}
                                disabled={!inputPrompt.trim() || isOptimizing}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                                {isOptimizing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Optimizing...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-4 h-4" />
                                        Optimize Prompt
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    {optimizationResult && (
                        <div className="space-y-6">
                            {/* Score Display */}
                            <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Optimization Score
                                    </span>
                                </div>
                                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${getScoreBgColor(optimizationResult.score)} ${getScoreColor(optimizationResult.score)}`}>
                                    {optimizationResult.score}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                    {optimizationResult.score >= 80 ? 'Excellent!' :
                                        optimizationResult.score >= 60 ? 'Good, but can be improved' :
                                            'Needs significant improvement'}
                                </p>
                            </div>

                            {/* Analysis */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Analysis
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Word Count</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {optimizationResult.analysis.wordCount}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Clarity Score</span>
                                            <span className={`font-medium ${getScoreColor(optimizationResult.analysis.clarityScore)}`}>
                                                {optimizationResult.analysis.clarityScore}/100
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Specificity Score</span>
                                            <span className={`font-medium ${getScoreColor(optimizationResult.analysis.specificityScore)}`}>
                                                {optimizationResult.analysis.specificityScore}/100
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Elements Present
                                    </h3>
                                    <div className="space-y-2">
                                        {[
                                            { key: 'hasContext', label: 'Context', icon: FileText },
                                            { key: 'hasExamples', label: 'Examples', icon: Lightbulb },
                                            { key: 'hasFormat', label: 'Format', icon: FileText },
                                            { key: 'hasConstraints', label: 'Constraints', icon: Clock }
                                        ].map(({ key, label, icon: Icon }) => (
                                            <div key={key} className="flex items-center gap-3 p-2">
                                                {optimizationResult.analysis[key as keyof typeof optimizationResult.analysis] ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                )}
                                                <Icon className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Suggestions */}
                            {optimizationResult.suggestions.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5" />
                                        Optimization Suggestions
                                    </h3>
                                    <div className="space-y-3">
                                        {optimizationResult.suggestions.map((suggestion, index) => (
                                            <div key={index} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(suggestion.priority)}`}>
                                                        {suggestion.priority}
                                                    </span>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                                                            {suggestion.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                                            {suggestion.description}
                                                        </p>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 p-3 rounded border-l-4 border-purple-500">
                                                            {suggestion.suggestion}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Improved Version */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Star className="w-5 h-5" />
                                        Optimized Version
                                    </h3>
                                    <button
                                        onClick={() => handleCopy(optimizationResult.improvedVersion)}
                                        className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm"
                                    >
                                        <Copy className="w-4 h-4" />
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                                    <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
                                        {optimizationResult.improvedVersion}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Tips Tab */
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Prompt Engineering Best Practices
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {tips.map((tip, index) => (
                            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {tip}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
