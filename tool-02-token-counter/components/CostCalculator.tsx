'use client';

import React, { useState, useEffect } from 'react';
import { MODEL_PRICING, ModelPricing, calculateCost } from '../lib/modelPricing';
import { TokenCount } from '../lib/tokenizers';
import { formatCurrency, formatNumber } from '../lib/tokenizers';
import { DollarSign, TrendingUp, Calculator, Zap } from 'lucide-react';

interface CostCalculatorProps {
    tokenCount: TokenCount;
    selectedModel: ModelPricing;
    onModelChange: (model: ModelPricing) => void;
}

export function CostCalculator({
    tokenCount,
    selectedModel,
    onModelChange
}: CostCalculatorProps) {
    const [costs, setCosts] = useState(calculateCost(
        tokenCount.inputTokens,
        tokenCount.outputTokens,
        selectedModel
    ));

    useEffect(() => {
        const newCosts = calculateCost(
            tokenCount.inputTokens,
            tokenCount.outputTokens,
            selectedModel
        );
        setCosts(newCosts);
    }, [tokenCount, selectedModel]);

    const costBreakdown = [
        {
            label: 'Input Cost',
            value: costs.inputCost,
            description: `${formatNumber(tokenCount.inputTokens)} tokens × $${selectedModel.inputPricePer1K}/1K`
        },
        {
            label: 'Output Cost',
            value: costs.outputCost,
            description: `${formatNumber(tokenCount.outputTokens)} tokens × $${selectedModel.outputPricePer1K}/1K`
        },
        {
            label: 'Total Cost',
            value: costs.totalCost,
            description: 'Per request'
        }
    ];

    const projections = [
        {
            label: 'Per 1K Requests',
            value: costs.costPer1K * 1000,
            icon: TrendingUp
        },
        {
            label: 'Per 10K Requests',
            value: costs.costPer10K * 10000,
            icon: TrendingUp
        },
        {
            label: 'Per 100K Requests',
            value: costs.costPer100K * 100000,
            icon: TrendingUp
        },
        {
            label: 'Monthly Estimate',
            value: costs.monthlyEstimate,
            icon: Calculator
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Cost Calculator
            </h2>

            {/* Model Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Model:
                </label>
                <select
                    value={selectedModel.name}
                    onChange={(e) => {
                        const model = MODEL_PRICING.find(m => m.name === e.target.value);
                        if (model) onModelChange(model);
                    }}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                    {MODEL_PRICING.map((model) => (
                        <option key={model.name} value={model.name}>
                            {model.name} ({model.provider}) - ${model.inputPricePer1K}/1K input, ${model.outputPricePer1K}/1K output
                        </option>
                    ))}
                </select>
            </div>

            {/* Model Info */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {selectedModel.name} ({selectedModel.provider})
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {selectedModel.description}
                </p>
                <div className="flex gap-4 text-sm">
                    <span className={`px-2 py-1 rounded-full ${selectedModel.quality === 'high' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            selectedModel.quality === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {selectedModel.quality} quality
                    </span>
                    <span className={`px-2 py-1 rounded-full ${selectedModel.speed === 'fast' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            selectedModel.speed === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {selectedModel.speed} speed
                    </span>
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {formatNumber(selectedModel.contextWindow)} context
                    </span>
                </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    Cost Breakdown
                </h3>
                <div className="space-y-3">
                    {costBreakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <div>
                                <div className="font-medium text-slate-800 dark:text-slate-100">
                                    {item.label}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {item.description}
                                </div>
                            </div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {formatCurrency(item.value)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cost Projections */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    Cost Projections
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projections.map((projection, index) => {
                        const IconComponent = projection.icon;
                        return (
                            <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
                                <IconComponent className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(projection.value)}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {projection.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Cost Efficiency Tips */}
            {costs.totalCost > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Cost Optimization Tips
                    </h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                        {tokenCount.inputTokens > tokenCount.outputTokens * 3 && (
                            <li>• Consider shortening your input prompt - it's using {((tokenCount.inputTokens / tokenCount.totalTokens) * 100).toFixed(1)}% of tokens</li>
                        )}
                        {selectedModel.inputPricePer1K > selectedModel.outputPricePer1K * 2 && (
                            <li>• This model charges more for input tokens - optimize your prompts</li>
                        )}
                        {costs.totalCost > 0.01 && (
                            <li>• Consider using a cheaper model like GPT-3.5 Turbo for simple tasks</li>
                        )}
                        <li>• Batch multiple requests together to reduce per-request overhead</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
