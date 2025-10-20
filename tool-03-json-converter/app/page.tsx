'use client';

import React, { useState, useEffect } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { FormatSelector, FORMAT_OPTIONS } from '../components/FormatSelector';
import { ConversionOptions } from '../components/ConversionOptions';
import { convertData, ConversionOptions as ConversionOptionsType } from '../lib/converters';
import { validateJson, validateCsv, validateXml, validateYaml, detectFormat } from '../lib/validators';
import { ArrowRight, RefreshCw, FileText, AlertCircle, CheckCircle, Copy, Download } from 'lucide-react';

export default function JsonConverterPage() {
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [fromFormat, setFromFormat] = useState('json');
  const [toFormat, setToFormat] = useState('csv');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState('');
  const [inputValidation, setInputValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });
  const [conversionOptions, setConversionOptions] = useState<ConversionOptionsType>({
    delimiter: ',',
    includeHeaders: true,
    flatten: false,
    tableName: 'data_table',
    indent: 2
  });

  // Example data
  const exampleData = {
    json: JSON.stringify([
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, city: 'New York' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, city: 'Los Angeles' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, city: 'Chicago' }
    ], null, 2),
    csv: 'id,name,email,age,city\n1,John Doe,john@example.com,30,New York\n2,Jane Smith,jane@example.com,25,Los Angeles\n3,Bob Johnson,bob@example.com,35,Chicago',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item>
    <id>1</id>
    <name>John Doe</name>
    <email>john@example.com</email>
    <age>30</age>
    <city>New York</city>
  </item>
  <item>
    <id>2</id>
    <name>Jane Smith</name>
    <email>jane@example.com</email>
    <age>25</age>
    <city>Los Angeles</city>
  </item>
</root>`,
    yaml: `- id: 1
  name: John Doe
  email: john@example.com
  age: 30
  city: New York
- id: 2
  name: Jane Smith
  email: jane@example.com
  age: 25
  city: Los Angeles`,
    sql: `CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  age INT,
  city VARCHAR(100)
);

INSERT INTO users (id, name, email, age, city) VALUES (1, 'John Doe', 'john@example.com', 30, 'New York');
INSERT INTO users (id, name, email, age, city) VALUES (2, 'Jane Smith', 'jane@example.com', 25, 'Los Angeles');`
  };

  // Validate input data
  useEffect(() => {
    if (!inputData.trim()) {
      setInputValidation({ isValid: true });
      return;
    }

    let validation;
    switch (fromFormat) {
      case 'json':
        validation = validateJson(inputData);
        break;
      case 'csv':
        validation = validateCsv(inputData);
        break;
      case 'xml':
        validation = validateXml(inputData);
        break;
      case 'yaml':
        validation = validateYaml(inputData);
        break;
      default:
        validation = { isValid: true };
    }

    setInputValidation(validation);
  }, [inputData, fromFormat]);

  // Auto-detect format
  const handleInputChange = (value: string) => {
    setInputData(value);

    // Auto-detect format if input is empty or very short
    if (value.trim().length < 10) {
      const detectedFormat = detectFormat(value);
      if (detectedFormat !== 'text' && detectedFormat !== fromFormat) {
        setFromFormat(detectedFormat);
      }
    }
  };

  // Convert data
  const handleConvert = async () => {
    if (!inputData.trim()) {
      setConversionError('Please enter some data to convert');
      return;
    }

    if (!inputValidation.isValid) {
      setConversionError('Please fix the input data errors before converting');
      return;
    }

    setIsConverting(true);
    setConversionError('');

    try {
      const result = await convertData(inputData, fromFormat, toFormat, conversionOptions);

      if (result.success) {
        setOutputData(result.data || '');
      } else {
        setConversionError(result.error || 'Conversion failed');
      }
    } catch (error) {
      setConversionError(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConverting(false);
    }
  };

  // Load example data
  const loadExample = (format: string) => {
    setInputData(exampleData[format as keyof typeof exampleData] || '');
    setFromFormat(format);
  };

  // Clear all data
  const clearAll = () => {
    setInputData('');
    setOutputData('');
    setConversionError('');
  };

  // Copy output
  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputData);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Download output
  const downloadOutput = () => {
    const blob = new Blob([outputData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_data.${toFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-4 text-blue-600 dark:text-blue-400">
            JSON Converter & Data Transformer
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Convert between JSON, CSV, XML, YAML, and SQL formats. Validate, format, and transform your data with ease.
          </p>
        </div>

        {/* Example Data Buttons */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Try Example Data
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(exampleData).map((format) => (
              <button
                key={format}
                onClick={() => loadExample(format)}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {format.toUpperCase()} Example
              </button>
            ))}
          </div>
        </div>

        {/* Format Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FormatSelector
            selectedFormat={fromFormat}
            onFormatChange={setFromFormat}
            direction="from"
          />
          <FormatSelector
            selectedFormat={toFormat}
            onFormatChange={setToFormat}
            direction="to"
            disabledFormats={[fromFormat]}
          />
        </div>

        {/* Conversion Options */}
        <div className="mb-8">
          <ConversionOptions
            options={conversionOptions}
            onOptionsChange={setConversionOptions}
            fromFormat={fromFormat}
            toFormat={toFormat}
          />
        </div>

        {/* Convert Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleConvert}
            disabled={isConverting || !inputData.trim() || !inputValidation.isValid}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2 mx-auto"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                Convert {fromFormat.toUpperCase()} to {toFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {conversionError && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 dark:text-red-200 font-medium">Conversion Error</h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{conversionError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Input and Output Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Editor */}
          <div>
            <CodeEditor
              value={inputData}
              onChange={handleInputChange}
              language={fromFormat}
              title={`Input (${fromFormat.toUpperCase()})`}
              placeholder={`Enter your ${fromFormat.toUpperCase()} data here...`}
              error={inputValidation.error}
              isValid={inputValidation.isValid}
            />
          </div>

          {/* Output Editor */}
          <div>
            <CodeEditor
              value={outputData}
              onChange={setOutputData}
              language={toFormat}
              title={`Output (${toFormat.toUpperCase()})`}
              placeholder="Converted data will appear here..."
              readOnly={false}
              onCopy={copyOutput}
              onDownload={downloadOutput}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={clearAll}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Clear All
          </button>
          {outputData && (
            <>
              <button
                onClick={copyOutput}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Output
              </button>
              <button
                onClick={downloadOutput}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </>
          )}
        </div>

        {/* How to Use Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            How to Use This Tool
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                Step 1: Select Formats
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>• Choose your input format (JSON, CSV, XML, YAML)</li>
                <li>• Select the desired output format</li>
                <li>• Configure conversion options if needed</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                Step 2: Convert Data
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>• Paste your data in the input editor</li>
                <li>• Click "Convert" to transform the data</li>
                <li>• Copy or download the converted result</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
          <p>Powered by Next.js, Monaco Editor, and client-side data processing.</p>
        </div>
      </div>
    </div>
  );
}