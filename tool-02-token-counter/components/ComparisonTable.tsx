'use client';

import React from 'react';
import { MODEL_PRICING, ModelPricing, calculateCost, findBestModel } from '../lib/modelPricing';
import { TokenCount } from '../lib/tokenizers';
import { formatCurrency } from '../lib/tokenizers';
import { Trophy, Zap, Star, DollarSign } from 'lucide-react';

interface ComparisonTableProps {
    tokenCount: TokenCount;
}

export function ComparisonTable({ tokenCount }: ComparisonTableProps) {
    const comparisons = MODEL_PRICING.map(model => ({
        model,
        cost: calculateCost(tokenCount.inputTokens, tokenCount.outputTokens, model)
    })).sort((a, b) => a.cost.totalCost - b.cost.totalCost);

    const cheapest = findBestModel(tokenCount.inputTokens, tokenCount.outputTokens, 'cheapest');
    const fastest = findBestModel(tokenCount.inputTokens, tokenCount.outputTokens, 'fastest');
    const highestQuality = findBestModel(tokenCount.inputTokens, tokenCount.outputTokens, 'highest-quality');

    const getModelBadge = (model: ModelPricing) => {
        if (model.name === cheapest.name) {
            return { icon: DollarSign, text: 'Cheapest', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
        }
        if (model.name === fastest.name) {
            return { icon: Zap, text: 'Fastest', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
        }
        if (model.name === highestQuality.name) {
            return { icon: Star, text: 'Best Quality', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Model Comparison
            </h2>

            {/* Quick Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Cheapest</h3>
                    </div>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">{cheapest.name}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                        {formatCurrency(calculateCost(tokenCount.inputTokens, tokenCount.outputTokens, cheapest).totalCost)} per request
                    </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">Fastest</h3>
                    </div>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{fastest.name}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        {formatCurrency(calculateCost(tokenCount.inputTokens, tokenCount.outputTokens, fastest).totalCost)} per request
                    </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="font-semibold text-purple-800 dark:text-purple-200">Best Quality</h3>
                    </div>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{highestQuality.name}</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                        {formatCurrency(calculateCost(tokenCount.inputTokens, tokenCount.outputTokens, highestQuality).totalCost)} per request
                    </p>
                </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-600">
                            <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Model</th>
                            <th className="text-right py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Cost</th>
                            <th className="text-right py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Input/1K</th>
                            <th className="text-right py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Output/1K</th>
                            <th className="text-center py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Quality</th>
                            <th className="text-center py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Speed</th>
                            <th className="text-right py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Context</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisons.map((comparison, index) => {
                            const badge = getModelBadge(comparison.model);
                            return (
                                <tr
                                    key={index}
                                    className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 ${index === 0 ? 'bg-green-50 dark:bg-green-950' : ''
                                        }`}
                                >
                                    <td className="py-3 px-2">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div className="font-medium text-slate-800 dark:text-slate-100">
                                                    {comparison.model.name}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    {comparison.model.provider}
                                                </div>
                                            </div>
                                            {badge && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                                                    {badge.text}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-right py-3 px-2">
                                        <div className="font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(comparison.cost.totalCost)}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            per request
                                        </div>
                                    </td>
                                    <td className="text-right py-3 px-2 text-slate-600 dark:text-slate-400">
                                        ${comparison.model.inputPricePer1K}
                                    </td>
                                    <td className="text-right py-3 px-2 text-slate-600 dark:text-slate-400">
                                        ${comparison.model.outputPricePer1K}
                                    </td>
                                    <td className="text-center py-3 px-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${comparison.model.quality === 'high' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                comparison.model.quality === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {comparison.model.quality}
                                        </span>
                                    </td>
                                    <td className="text-center py-3 px-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${comparison.model.speed === 'fast' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                comparison.model.speed === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {comparison.model.speed}
                                        </span>
                                    </td>
                                    <td className="text-right py-3 px-2 text-slate-600 dark:text-slate-400">
                                        {comparison.model.contextWindow.toLocaleString()}K
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Cost Savings Analysis */}
            {comparisons.length > 1 && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Cost Savings Analysis
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p>
                            Using <strong>{cheapest.name}</strong> instead of the most expensive model saves you{' '}
                            <strong className="text-green-600 dark:text-green-400">
                                {formatCurrency(comparisons[comparisons.length - 1].cost.totalCost - comparisons[0].cost.totalCost)}
                            </strong>{' '}
                            per request ({((1 - comparisons[0].cost.totalCost / comparisons[comparisons.length - 1].cost.totalCost) * 100).toFixed(1)}% savings).
                        </p>
                        <p className="mt-1">
                            For 1000 requests, that's a savings of{' '}
                            <strong className="text-green-600 dark:text-green-400">
                                {formatCurrency((comparisons[comparisons.length - 1].cost.totalCost - comparisons[0].cost.totalCost) * 1000)}
                            </strong>.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

