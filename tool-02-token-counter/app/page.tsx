'use client';

import React, { useState } from 'react';
import { TokenCounter } from '../components/TokenCounter';
import { CostCalculator } from '../components/CostCalculator';
import { ComparisonTable } from '../components/ComparisonTable';
import { MODEL_PRICING, ModelPricing } from '../lib/modelPricing';
import { TokenCount } from '../lib/tokenizers';
import { FileText, Calculator, BarChart3, Copy, Download } from 'lucide-react';

export default function TokenCounterPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelPricing>(MODEL_PRICING[0]);
  const [tokenCount, setTokenCount] = useState<TokenCount>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    characters: 0,
    words: 0,
    lines: 0
  });

  const handleTokenCountChange = (count: TokenCount) => {
    setTokenCount(count);
  };

  const handleModelChange = (model: ModelPricing) => {
    setSelectedModel(model);
  };

  const handleCopyInput = () => {
    navigator.clipboard.writeText(inputText);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleClearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const examplePrompts = [
    "Write a professional email to a client about project delays",
    "Explain quantum computing in simple terms",
    "Create a marketing strategy for a new mobile app",
    "Write a Python function to sort a list of dictionaries",
    "Summarize the key points of a business meeting"
  ];

  const loadExamplePrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-4 text-blue-600 dark:text-blue-400">
            AI Token Counter & Cost Calculator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Count tokens, calculate costs, and compare AI models. Get accurate pricing estimates for GPT-4, Claude, Gemini, and more.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {tokenCount.totalTokens.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Tokens</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tokenCount.characters.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Characters</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {tokenCount.words.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Words</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {selectedModel.name}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Selected Model</div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Try Example Prompts
          </h2>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => loadExamplePrompt(prompt)}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input/Output Text Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Input Text */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Input Text (Prompt)
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyInput}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  title="Copy input text"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your prompt or input text here..."
              className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {inputText.length.toLocaleString()} characters
            </div>
          </div>

          {/* Output Text */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Output Text (Response)
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyOutput}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  title="Copy output text"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="Enter the AI response or output text here..."
              className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {outputText.length.toLocaleString()} characters
            </div>
          </div>
        </div>

        {/* Clear All Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleClearAll}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Clear All Text
          </button>
        </div>

        {/* Token Counter */}
        <TokenCounter
          inputText={inputText}
          outputText={outputText}
          modelName={selectedModel.name}
          onTokenCountChange={handleTokenCountChange}
        />

        {/* Cost Calculator */}
        <div className="mt-8">
          <CostCalculator
            tokenCount={tokenCount}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>

        {/* Model Comparison */}
        <div className="mt-8">
          <ComparisonTable tokenCount={tokenCount} />
        </div>

        {/* How to Use Section */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            How to Use This Tool
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                Step 1: Enter Your Text
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>• Paste your prompt in the "Input Text" field</li>
                <li>• Add the AI response in the "Output Text" field (optional)</li>
                <li>• Use example prompts to get started quickly</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                Step 2: Analyze Costs
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>• View real-time token counting and cost estimates</li>
                <li>• Compare different AI models side-by-side</li>
                <li>• Get optimization tips to reduce costs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
          <p>Powered by Next.js, Tailwind CSS, and real-time token counting.</p>
        </div>
      </div>
    </div>
  );
}