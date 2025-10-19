'use client';

import { useState, useEffect } from 'react';
import { Copy, Clock, Code, AlertCircle, CheckCircle, Settings, Play, Calendar } from 'lucide-react';
import { parseCronExpression, getNextExecutions, explainCron, validateCron, buildCronExpression, getFieldOptions, CronParts } from '../lib/cronParser';
import { getAvailableGenerators } from '../lib/codeGenerators';
import { PRESETS, PRESETS_BY_CATEGORY } from '../data/presets';

type Mode = 'build' | 'explain';

export default function CronGeneratorPage() {
  const [mode, setMode] = useState<Mode>('build');
  const [cronExpression, setCronExpression] = useState('0 9 * * 1-5');
  const [cronParts, setCronParts] = useState<CronParts>({
    minute: '0',
    hour: '9',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '1-5'
  });
  const [validation, setValidation] = useState<{ valid: boolean; error?: string; suggestion?: string }>({ valid: true });
  const [explanation, setExplanation] = useState('');
  const [nextExecutions, setNextExecutions] = useState<Array<{ date: Date; formatted: string; relative: string }>>([]);
  const [copied, setCopied] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState('linux');
  const [generatedCode, setGeneratedCode] = useState('');

  const generators = getAvailableGenerators();

  // Update cron expression when parts change
  useEffect(() => {
    const newExpression = buildCronExpression(cronParts);
    setCronExpression(newExpression);
  }, [cronParts]);

  // Validate and explain when expression changes
  useEffect(() => {
    const validationResult = validateCron(cronExpression);
    setValidation(validationResult);

    if (validationResult.valid) {
      try {
        setExplanation(explainCron(cronExpression));
        setNextExecutions(getNextExecutions(cronExpression, 5));
      } catch (error) {
        setExplanation('Unable to explain this expression');
        setNextExecutions([]);
      }
    } else {
      setExplanation('');
      setNextExecutions([]);
    }
  }, [cronExpression]);

  // Generate code when generator changes
  useEffect(() => {
    if (validation.valid) {
      const generator = generators.find(g => g.id === selectedGenerator);
      if (generator) {
        setGeneratedCode(generator.generate(cronExpression, {
          command: '/path/to/your/script.sh',
          description: explanation,
          functionName: 'scheduledTask'
        }));
      }
    }
  }, [selectedGenerator, cronExpression, validation.valid, explanation]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setCronExpression(preset.expression);
    setCronParts(parseCronExpression(preset.expression));
  };

  const updateCronPart = (field: keyof CronParts, value: string) => {
    setCronParts(prev => ({ ...prev, [field]: value }));
  };

  const parseExpression = (expression: string) => {
    try {
      const parts = parseCronExpression(expression);
      setCronParts(parts);
      setCronExpression(expression);
    } catch (error) {
      // Invalid expression, don't update parts
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Cron Expression{' '}
            <span className="text-blue-600 dark:text-blue-400">Generator & Explainer</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Create and understand cron expressions easily. Visual builder, plain English explanations,
            next run times. Free crontab generator for developers and system administrators.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Clock className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cron Tool</h2>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('build')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${mode === 'build'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
            >
              Visual Builder
            </button>
            <button
              onClick={() => setMode('explain')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${mode === 'explain'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
            >
              Explain Cron
            </button>
          </div>

          {/* Expression Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Cron Expression
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cronExpression}
                onChange={(e) => parseExpression(e.target.value)}
                placeholder="0 9 * * 1-5"
                className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <button
                onClick={() => copyToClipboard(cronExpression)}
                className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {!validation.valid && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {validation.error}
                </div>
                {validation.suggestion && (
                  <div className="mt-1 text-xs">
                    Suggestion: {validation.suggestion}
                  </div>
                )}
              </div>
            )}

            {validation.valid && explanation && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-400 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {explanation}
                </div>
              </div>
            )}
          </div>
        </div>

        {mode === 'build' && (
          <>
            {/* Visual Builder */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Visual Builder</h3>

              <div className="grid md:grid-cols-5 gap-4">
                {(['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <select
                      value={cronParts[field]}
                      onChange={(e) => updateCronPart(field, e.target.value)}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {getFieldOptions(field).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Common Patterns</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(PRESETS_BY_CATEGORY).map(([category, presets]) => (
                  <div key={category}>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-3 capitalize">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {presets.slice(0, 4).map((preset) => (
                        <button
                          key={preset.expression}
                          onClick={() => applyPreset(preset)}
                          className="w-full text-left p-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        >
                          <div className="font-mono text-sm text-blue-600 dark:text-blue-400">
                            {preset.expression}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {preset.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Next Executions */}
        {validation.valid && nextExecutions.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Next 5 Executions</h3>
            </div>

            <div className="space-y-2">
              {nextExecutions.map((execution, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {execution.formatted}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {execution.relative}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Generators */}
        {validation.valid && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generate Code</h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Platform
              </label>
              <select
                value={selectedGenerator}
                onChange={(e) => setSelectedGenerator(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {generators.map(generator => (
                  <option key={generator.id} value={generator.id}>
                    {generator.name} - {generator.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Generated Code
                </label>
                <button
                  onClick={() => copyToClipboard(generatedCode)}
                  className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <textarea
                value={generatedCode}
                readOnly
                className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white resize-none font-mono text-sm"
              />
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
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Build or Explain</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Use the visual builder to create cron expressions or paste an existing one to understand it.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">See Next Runs</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                View the next 5 execution times to verify your schedule works as expected.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Generate Code</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Get ready-to-use code for your platform: Linux, AWS, Kubernetes, Node.js, Python, and more.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What is a cron expression?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                A cron expression is a string of 5 fields that defines when a scheduled task should run.
                The fields represent: minute, hour, day of month, month, and day of week.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I schedule a task to run every weekday at 9 AM?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Use the expression: <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">0 9 * * 1-5</code>.
                This means: minute 0, hour 9, any day of month, any month, Monday through Friday.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What's the difference between * and ? in cron expressions?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">*</code> means "any value" and can be used in any field.
                <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">?</code> means "no specific value" and is typically used in day of month or day of week fields when the other is specified.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can I use this tool for different platforms?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes! The tool generates code for multiple platforms including Linux crontab, AWS CloudWatch Events,
                Kubernetes CronJobs, Node.js, Python, GitHub Actions, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

