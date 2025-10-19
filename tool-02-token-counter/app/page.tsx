'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Calculator, Copy, TrendingUp, DollarSign, Clock, Users } from 'lucide-react';
import { countTokens, calculateCost, estimateMonthlyCost, formatCost, formatNumber, getTextStats } from '../lib/tokenizers';
import { getAllModels, getModelInfo, compareModels, getContextWarning } from '../lib/modelPricing';
import { ModelInfo, ModelComparison } from '../lib/tokenizers';

export default function TokenCounterPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [requestsPerDay, setRequestsPerDay] = useState(100);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisons, setComparisons] = useState<ModelComparison[]>([]);
  const [copied, setCopied] = useState(false);

  const allModels = getAllModels();
  const modelInfo = getModelInfo(selectedModel);

  // Update token counts when text changes
  useEffect(() => {
    if (inputText.trim()) {
      const tokens = countTokens(inputText, selectedModel);
      setInputTokens(tokens);
    } else {
      setInputTokens(0);
    }
  }, [inputText, selectedModel]);

  useEffect(() => {
    if (outputText.trim()) {
      const tokens = countTokens(outputText, selectedModel);
      setOutputTokens(tokens);
    } else {
      setOutputTokens(0);
    }
  }, [outputText, selectedModel]);

  // Update comparisons when tokens change
  useEffect(() => {
    if (inputTokens > 0 || outputTokens > 0) {
      const newComparisons = compareModels(inputTokens, outputTokens);
      setComparisons(newComparisons);
    }
  }, [inputTokens, outputTokens]);

  const currentCost = modelInfo ? calculateCost(inputTokens, outputTokens, modelInfo) : 0;
  const monthlyCost = modelInfo ? estimateMonthlyCost(inputTokens + outputTokens, requestsPerDay, modelInfo) : 0;
  const contextWarning = modelInfo ? getContextWarning(inputTokens, modelInfo) : null;
  const inputStats = getTextStats(inputText);
  const outputStats = getTextStats(outputText);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyTokenCount = () => {
    const text = `Input: ${inputTokens} tokens\nOutput: ${outputTokens} tokens\nTotal: ${inputTokens + outputTokens} tokens`;
    copyToClipboard(text);
  };

  const copyCostBreakdown = () => {
    const text = `Cost Breakdown for ${modelInfo?.name}:
This request: ${formatCost(currentCost)}
Per 1K requests: ${formatCost(currentCost * 1000)}
Per 10K requests: ${formatCost(currentCost * 10000)}
Monthly (${requestsPerDay} requests/day): ${formatCost(monthlyCost)}`;
    copyToClipboard(text);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Token Counter &{' '}
            <span className="text-blue-600 dark:text-blue-400">Cost Calculator</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Calculate tokens and API costs for GPT-4, Claude, Gemini, and other LLM models.
            Compare prices across models and optimize your AI spending.
          </p>
        </div>

        {/* Model Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Model Selection</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(allModels).map(([key, model]) => (
                  <option key={key} value={key}>
                    {model.name} ({model.provider})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Requests per Day
              </label>
              <input
                type="number"
                value={requestsPerDay}
                onChange={(e) => setRequestsPerDay(Number(e.target.value))}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10000"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {showComparison ? 'Hide' : 'Compare'} Models
              </button>
            </div>
          </div>
          {modelInfo && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Input:</span>
                  <span className="ml-2 font-medium">${modelInfo.input}/1K tokens</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Output:</span>
                  <span className="ml-2 font-medium">${modelInfo.output}/1K tokens</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Context:</span>
                  <span className="ml-2 font-medium">{formatNumber(modelInfo.context)} tokens</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Provider:</span>
                  <span className="ml-2 font-medium">{modelInfo.provider}</span>
                </div>
              </div>
              {contextWarning && (
                <div className="mt-2 text-amber-600 dark:text-amber-400 text-sm">
                  {contextWarning}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input/Output Fields */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Input Prompt</h3>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                ({inputStats.characters} chars, {inputStats.words} words)
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium text-blue-600 dark:text-blue-400">{inputTokens}</span> tokens
              </div>
              <button
                onClick={copyTokenCount}
                className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Expected Output</h3>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                ({outputStats.characters} chars, {outputStats.words} words)
              </span>
            </div>
            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="Enter expected output here..."
              className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium text-green-600 dark:text-green-400">{outputTokens}</span> tokens
              </div>
              <button
                onClick={copyTokenCount}
                className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cost Breakdown</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCost(currentCost)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">This Request</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCost(currentCost * 1000)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Per 1K Requests</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCost(currentCost * 10000)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Per 10K Requests</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCost(monthlyCost)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Monthly</div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={copyCostBreakdown}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Cost Breakdown
            </button>
          </div>
        </div>

        {/* Model Comparison */}
        {showComparison && comparisons.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Model Comparison</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Model</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Provider</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-900 dark:text-white">Cost</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-900 dark:text-white">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((comparison) => (
                    <tr key={comparison.model} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {comparison.modelInfo.name}
                          </span>
                          {comparison.isCheapest && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                              Cheapest
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {comparison.modelInfo.provider}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${comparison.isCheapest ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                          {formatCost(comparison.cost)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                        {formatNumber(comparison.modelInfo.context)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Enter Your Text</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Paste your prompt and expected output to calculate token usage
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Select Model</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Choose your AI model to see accurate pricing and token counts
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Compare & Optimize</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Compare costs across models and optimize your AI spending
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What are tokens?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Tokens are the basic units that AI models use to process text. Roughly, 1 token = 4 characters in English.
                The exact count depends on the model and text complexity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How accurate are these calculations?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our tokenizer uses the same algorithms as the official APIs for maximum accuracy.
                For Claude and Gemini, we use the closest available approximation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Why do different models have different costs?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Each model has different capabilities, training costs, and performance characteristics.
                More powerful models typically cost more but may require fewer tokens to achieve the same result.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How can I reduce my AI costs?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Use cheaper models for simple tasks, optimize your prompts to be more concise,
                batch multiple requests together, and consider the cost vs. quality trade-off for each use case.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

