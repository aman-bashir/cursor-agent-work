'use client';

import React, { useState, useEffect } from 'react';
import { TokenCount } from '../lib/tokenizers';
import { calculateTokenCount } from '../lib/tokenizers';
import { formatNumber } from '../lib/tokenizers';
import { FileText, Hash, Type, AlignLeft } from 'lucide-react';

interface TokenCounterProps {
    inputText: string;
    outputText: string;
    modelName: string;
    onTokenCountChange: (count: TokenCount) => void;
}

export function TokenCounter({
    inputText,
    outputText,
    modelName,
    onTokenCountChange
}: TokenCounterProps) {
    const [tokenCount, setTokenCount] = useState<TokenCount>({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        characters: 0,
        words: 0,
        lines: 0
    });

    useEffect(() => {
        const count = calculateTokenCount(inputText, outputText, modelName);
        setTokenCount(count);
        onTokenCountChange(count);
    }, [inputText, outputText, modelName, onTokenCountChange]);

    const stats = [
        {
            label: 'Input Tokens',
            value: formatNumber(tokenCount.inputTokens),
            icon: FileText,
            color: 'text-blue-600 dark:text-blue-400'
        },
        {
            label: 'Output Tokens',
            value: formatNumber(tokenCount.outputTokens),
            icon: FileText,
            color: 'text-green-600 dark:text-green-400'
        },
        {
            label: 'Total Tokens',
            value: formatNumber(tokenCount.totalTokens),
            icon: Hash,
            color: 'text-purple-600 dark:text-purple-400'
        },
        {
            label: 'Characters',
            value: formatNumber(tokenCount.characters),
            icon: Type,
            color: 'text-orange-600 dark:text-orange-400'
        },
        {
            label: 'Words',
            value: formatNumber(tokenCount.words),
            icon: AlignLeft,
            color: 'text-pink-600 dark:text-pink-400'
        },
        {
            label: 'Lines',
            value: formatNumber(tokenCount.lines),
            icon: AlignLeft,
            color: 'text-indigo-600 dark:text-indigo-400'
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Hash className="w-6 h-6" />
                Token Analysis
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center"
                        >
                            <IconComponent className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                            <div className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                {stat.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Token Distribution */}
            {tokenCount.totalTokens > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                        Token Distribution
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-4 overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{
                                    width: `${(tokenCount.inputTokens / tokenCount.totalTokens) * 100}%`
                                }}
                            />
                        </div>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-4 overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{
                                    width: `${(tokenCount.outputTokens / tokenCount.totalTokens) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <span>Input: {((tokenCount.inputTokens / tokenCount.totalTokens) * 100).toFixed(1)}%</span>
                        <span>Output: {((tokenCount.outputTokens / tokenCount.totalTokens) * 100).toFixed(1)}%</span>
                    </div>
                </div>
            )}

            {/* Model Info */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Model:</strong> {modelName} |
                    <strong> Tokenizer:</strong> {modelName.toLowerCase().includes('gpt') ? 'GPT' :
                        modelName.toLowerCase().includes('claude') ? 'Claude' :
                            modelName.toLowerCase().includes('gemini') ? 'Gemini' : 'GPT'}
                </p>
            </div>
        </div>
    );
}

