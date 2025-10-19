'use client';

import { useState, useEffect } from 'react';
import { Copy, Download, Upload, FileText, AlertCircle, CheckCircle, Settings, Eye } from 'lucide-react';
import { jsonToCsv, CsvOptions } from '../lib/converters/jsonToCsv';
import { jsonToXml, XmlOptions } from '../lib/converters/jsonToXml';
import { jsonToYaml, YamlOptions } from '../lib/converters/jsonToYaml';
import { jsonToSql, SqlOptions } from '../lib/converters/jsonToSql';
import { csvToJson, xmlToJson, yamlToJson } from '../lib/converters/reverseConverters';
import { validateJson, beautifyJson, minifyJson, getJsonStats, formatFileSize } from '../lib/validators';

type Format = 'json' | 'csv' | 'xml' | 'yaml' | 'sql';
type Mode = 'convert' | 'reverse';

export default function JsonConverterPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputFormat, setInputFormat] = useState<Format>('json');
  const [outputFormat, setOutputFormat] = useState<Format>('csv');
  const [mode, setMode] = useState<Mode>('convert');
  const [validation, setValidation] = useState<{ valid: boolean; error?: string; line?: number }>({ valid: true });
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Options for different formats
  const [csvOptions, setCsvOptions] = useState<CsvOptions>({ flatten: true, delimiter: ',', headers: true });
  const [xmlOptions, setXmlOptions] = useState<XmlOptions>({ rootElement: 'root', declaration: true, indent: 2 });
  const [yamlOptions, setYamlOptions] = useState<YamlOptions>({ indent: 2, lineWidth: 80, noRefs: true });
  const [sqlOptions, setSqlOptions] = useState<SqlOptions>({ tableName: 'data', mode: 'BOTH' });

  // Example data
  const exampleData = {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', profile: { age: 30, city: 'New York' } },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', profile: { age: 25, city: 'Los Angeles' } }
    ],
    total: 2,
    active: true
  };

  // Validate input when it changes
  useEffect(() => {
    if (inputText.trim()) {
      if (mode === 'convert' && inputFormat === 'json') {
        setValidation(validateJson(inputText));
      } else if (mode === 'reverse') {
        // For reverse conversion, validate the input format
        try {
          switch (inputFormat) {
            case 'json':
              JSON.parse(inputText);
              break;
            case 'csv':
              csvToJson(inputText);
              break;
            case 'xml':
              xmlToJson(inputText);
              break;
            case 'yaml':
              yamlToJson(inputText);
              break;
          }
          setValidation({ valid: true });
        } catch (error) {
          setValidation({
            valid: false,
            error: error instanceof Error ? error.message : 'Invalid format'
          });
        }
      }
    } else {
      setValidation({ valid: true });
    }
  }, [inputText, inputFormat, mode]);

  // Convert when input or options change
  useEffect(() => {
    if (inputText.trim() && validation.valid) {
      try {
        convertData();
      } catch (error) {
        setOutputText(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      setOutputText('');
    }
  }, [inputText, inputFormat, outputFormat, mode, csvOptions, xmlOptions, yamlOptions, sqlOptions, validation.valid]);

  const convertData = () => {
    if (mode === 'convert') {
      // Convert from JSON to other formats
      const jsonData = JSON.parse(inputText);

      switch (outputFormat) {
        case 'csv':
          setOutputText(jsonToCsv(jsonData, csvOptions));
          break;
        case 'xml':
          setOutputText(jsonToXml(jsonData, xmlOptions));
          break;
        case 'yaml':
          setOutputText(jsonToYaml(jsonData, yamlOptions));
          break;
        case 'sql':
          setOutputText(jsonToSql(jsonData, sqlOptions));
          break;
        case 'json':
          setOutputText(beautifyJson(inputText));
          break;
      }
    } else {
      // Reverse conversion
      let jsonData: any;

      switch (inputFormat) {
        case 'csv':
          jsonData = csvToJson(inputText);
          break;
        case 'xml':
          jsonData = xmlToJson(inputText);
          break;
        case 'yaml':
          jsonData = yamlToJson(inputText);
          break;
        case 'json':
          jsonData = JSON.parse(inputText);
          break;
        default:
          throw new Error('Unsupported input format for reverse conversion');
      }

      setOutputText(JSON.stringify(jsonData, null, 2));
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    setInputText(JSON.stringify(exampleData, null, 2));
    setInputFormat('json');
    setMode('convert');
  };

  const formatOptions = [
    { value: 'json', label: 'JSON', icon: '{}' },
    { value: 'csv', label: 'CSV', icon: '📊' },
    { value: 'xml', label: 'XML', icon: '📄' },
    { value: 'yaml', label: 'YAML', icon: '📝' },
    { value: 'sql', label: 'SQL', icon: '🗄️' }
  ];

  const inputStats = getJsonStats(inputText ? JSON.parse(inputText) : {});
  const outputSize = formatFileSize(new Blob([outputText]).size);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            JSON Converter &{' '}
            <span className="text-blue-600 dark:text-blue-400">Formatter</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Convert JSON to CSV, XML, YAML, SQL and vice versa. Fast, free, handles large files.
            Developer-friendly JSON tools with validation and formatting.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Conversion Mode</h2>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Options
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setMode('convert')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${mode === 'convert'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
            >
              JSON → Other Formats
            </button>
            <button
              onClick={() => setMode('reverse')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${mode === 'reverse'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
            >
              Other Formats → JSON
            </button>
          </div>

          {/* Format Selectors */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {mode === 'convert' ? 'Input Format' : 'Source Format'}
              </label>
              <select
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value as Format)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {formatOptions.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.icon} {format.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {mode === 'convert' ? 'Output Format' : 'Target Format'}
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as Format)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                disabled={mode === 'reverse'}
              >
                {formatOptions.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.icon} {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Options Panel */}
          {showOptions && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <h3 className="font-medium text-slate-900 dark:text-white mb-4">Conversion Options</h3>

              {outputFormat === 'csv' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={csvOptions.flatten}
                      onChange={(e) => setCsvOptions({ ...csvOptions, flatten: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Flatten nested objects</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={csvOptions.headers}
                      onChange={(e) => setCsvOptions({ ...csvOptions, headers: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Include headers</span>
                  </label>
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Delimiter</label>
                    <select
                      value={csvOptions.delimiter}
                      onChange={(e) => setCsvOptions({ ...csvOptions, delimiter: e.target.value })}
                      className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab</option>
                    </select>
                  </div>
                </div>
              )}

              {outputFormat === 'xml' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Root Element</label>
                    <input
                      type="text"
                      value={xmlOptions.rootElement}
                      onChange={(e) => setXmlOptions({ ...xmlOptions, rootElement: e.target.value })}
                      className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Indent</label>
                    <input
                      type="number"
                      value={xmlOptions.indent}
                      onChange={(e) => setXmlOptions({ ...xmlOptions, indent: Number(e.target.value) })}
                      className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                      min="0"
                      max="8"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={xmlOptions.declaration}
                      onChange={(e) => setXmlOptions({ ...xmlOptions, declaration: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">XML Declaration</span>
                  </label>
                </div>
              )}

              {outputFormat === 'sql' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Table Name</label>
                    <input
                      type="text"
                      value={sqlOptions.tableName}
                      onChange={(e) => setSqlOptions({ ...sqlOptions, tableName: e.target.value })}
                      className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Mode</label>
                    <select
                      value={sqlOptions.mode}
                      onChange={(e) => setSqlOptions({ ...sqlOptions, mode: e.target.value as 'INSERT' | 'CREATE' | 'BOTH' })}
                      className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                    >
                      <option value="BOTH">CREATE + INSERT</option>
                      <option value="CREATE">CREATE TABLE only</option>
                      <option value="INSERT">INSERT only</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input/Output Fields */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Input</h3>
                {validation.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <button
                onClick={loadExample}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                Example
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter your ${inputFormat.toUpperCase()} data here...`}
              className="w-full h-80 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />

            {!validation.valid && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
                {validation.error}
                {validation.line && ` (Line ${validation.line})`}
              </div>
            )}

            {inputText && validation.valid && inputFormat === 'json' && (
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Size: {formatFileSize(new Blob([inputText]).size)} |
                Depth: {inputStats.depth} |
                Keys: {inputStats.keys} |
                Objects: {inputStats.objects} |
                Arrays: {inputStats.arrays}
              </div>
            )}
          </div>

          {/* Output */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Output</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(outputText)}
                  className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadFile}
                  className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            <textarea
              value={outputText}
              readOnly
              placeholder="Converted output will appear here..."
              className="w-full h-80 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white resize-none font-mono text-sm"
            />

            {outputText && (
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Size: {outputSize}
              </div>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Choose Format</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Select your input and output formats. Supports JSON, CSV, XML, YAML, and SQL.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Paste Data</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Paste your data in the input field. The tool will validate and convert automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Copy & Use</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Copy the converted output or download as a file. All processing happens in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Is my data secure?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes! All conversion happens in your browser. No data is sent to any servers, ensuring complete privacy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What file sizes are supported?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                The tool can handle large files up to several megabytes. Performance depends on your browser's memory capacity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can I convert nested JSON to CSV?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes! Enable the "Flatten nested objects" option to convert complex JSON structures to flat CSV format.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How accurate are the conversions?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Very accurate! We use industry-standard libraries and handle edge cases like special characters, nested objects, and data types.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

