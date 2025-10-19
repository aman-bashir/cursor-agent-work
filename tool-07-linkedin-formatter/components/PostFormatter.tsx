'use client';

import { useState } from 'react';
import { 
  Edit3, 
  Copy, 
  Download, 
  RefreshCw, 
  Check, 
  AlertCircle,
  BarChart3,
  Hash,
  Smile,
  Type
} from 'lucide-react';
import { 
  formatLinkedInPost, 
  FormatOptions, 
  getCharacterCount, 
  getWordCount, 
  getReadingTime,
  validateLinkedInPost,
  formatForMobile
} from '../lib/formatter';
import { analyzeEngagement, getScoreColor, getScoreBgColor, getScoreLabel } from '../lib/analyzer';

export default function PostFormatter() {
  const [inputText, setInputText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [formatOptions, setFormatOptions] = useState<FormatOptions>({
    addLineBreaks: true,
    addEmojis: false,
    addHashtags: false,
    optimizeSpacing: true,
    formatStyle: 'story'
  });
  const [copied, setCopied] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFormat = () => {
    const formatted = formatLinkedInPost(inputText, formatOptions);
    setFormattedText(formatted);
    
    if (showAnalysis) {
      const analysisResult = analyzeEngagement(formatted);
      setAnalysis(analysisResult);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkedin-post.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAnalyze = () => {
    const textToAnalyze = formattedText || inputText;
    if (textToAnalyze.trim()) {
      const analysisResult = analyzeEngagement(textToAnalyze);
      setAnalysis(analysisResult);
      setShowAnalysis(true);
    }
  };

  const validation = validateLinkedInPost(formattedText || inputText);
  const characterCount = getCharacterCount(formattedText || inputText);
  const wordCount = getWordCount(formattedText || inputText);
  const readingTime = getReadingTime(formattedText || inputText);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Edit3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          LinkedIn Post Formatter
        </h2>
      </div>

      {/* Format Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formatOptions.addLineBreaks}
            onChange={(e) => setFormatOptions(prev => ({ ...prev, addLineBreaks: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Line Breaks</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formatOptions.addEmojis}
            onChange={(e) => setFormatOptions(prev => ({ ...prev, addEmojis: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Emojis</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formatOptions.addHashtags}
            onChange={(e) => setFormatOptions(prev => ({ ...prev, addHashtags: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Hashtags</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formatOptions.optimizeSpacing}
            onChange={(e) => setFormatOptions(prev => ({ ...prev, optimizeSpacing: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Optimize Spacing</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Format Style
        </label>
        <select
          value={formatOptions.formatStyle}
          onChange={(e) => setFormatOptions(prev => ({ ...prev, formatStyle: e.target.value as any }))}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="story">Story Format</option>
          <option value="list">List Format</option>
          <option value="hook-body-cta">Hook + Body + CTA</option>
        </select>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Post Content
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your LinkedIn post here..."
          rows={8}
          className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleFormat}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Format Post
        </button>
        <button
          onClick={handleAnalyze}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          Analyze Engagement
        </button>
        {formattedText && (
          <>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {characterCount}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Characters</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {wordCount}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Words</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {readingTime}m
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Read Time</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
          <div className={`text-2xl font-bold ${characterCount > 3000 ? 'text-red-600' : characterCount > 2500 ? 'text-yellow-600' : 'text-green-600'}`}>
            {characterCount > 3000 ? 'Over' : characterCount > 2500 ? 'Near' : 'Good'}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Length</div>
        </div>
      </div>

      {/* Validation Messages */}
      {validation.errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-red-900 dark:text-red-100">Issues to Fix</h3>
          </div>
          <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-900 dark:text-yellow-100">Suggestions</h3>
          </div>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Formatted Output */}
      {formattedText && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Formatted Post
          </label>
          <div className="p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700">
            <pre className="whitespace-pre-wrap text-slate-900 dark:text-white font-sans">
              {formattedText}
            </pre>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {showAnalysis && analysis && (
        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Engagement Analysis
            </h3>
          </div>

          {/* Overall Score */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getScoreBgColor(analysis.score)} ${getScoreColor(analysis.score)}`}>
                {analysis.score}
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {getScoreLabel(analysis.score)} ({analysis.score}/100)
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Overall engagement potential
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900 dark:text-white">Strengths</h4>
              {analysis.strengths.length > 0 ? (
                <ul className="space-y-1">
                  {analysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                      <Check className="w-4 h-4" />
                      {strength}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No major strengths identified</p>
              )}
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900 dark:text-white">Improvements</h4>
              {analysis.improvements.length > 0 ? (
                <ul className="space-y-1">
                  {analysis.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
                      <AlertCircle className="w-4 h-4" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No major improvements needed</p>
              )}
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {analysis.breakdown.hookStrength}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Hook Strength</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {analysis.breakdown.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Length</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {analysis.breakdown.readability}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Readability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {analysis.breakdown.emojiUsage}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Emoji Usage</div>
            </div>
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">Suggestions</h4>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
