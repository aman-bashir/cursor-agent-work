'use client';

import React from 'react';
import { Settings, Database, FileText } from 'lucide-react';
import { ConversionOptions as ConversionOptionsType } from '../lib/converters';

interface ConversionOptionsProps {
    options: ConversionOptionsType;
    onOptionsChange: (options: ConversionOptionsType) => void;
    fromFormat: string;
    toFormat: string;
}

export function ConversionOptions({
    options,
    onOptionsChange,
    fromFormat,
    toFormat
}: ConversionOptionsProps) {
    const updateOption = (key: keyof ConversionOptionsType, value: any) => {
        onOptionsChange({
            ...options,
            [key]: value
        });
    };

    const showCsvOptions = toFormat === 'csv' || fromFormat === 'csv';
    const showSqlOptions = toFormat === 'sql';
    const showFormattingOptions = ['json', 'xml', 'yaml'].includes(toFormat);

    if (!showCsvOptions && !showSqlOptions && !showFormattingOptions) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Conversion Options
            </h3>

            <div className="space-y-4">
                {/* CSV Options */}
                {showCsvOptions && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            CSV Options
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Delimiter:
                                </label>
                                <select
                                    value={options.delimiter || ','}
                                    onChange={(e) => updateOption('delimiter', e.target.value)}
                                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value=",">Comma (,)</option>
                                    <option value=";">Semicolon (;)</option>
                                    <option value="\t">Tab</option>
                                    <option value="|">Pipe (|)</option>
                                </select>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="includeHeaders"
                                    checked={options.includeHeaders !== false}
                                    onChange={(e) => updateOption('includeHeaders', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-500"
                                />
                                <label htmlFor="includeHeaders" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                    Include Headers
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="flatten"
                                    checked={options.flatten || false}
                                    onChange={(e) => updateOption('flatten', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-500"
                                />
                                <label htmlFor="flatten" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                    Flatten Nested Objects
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* SQL Options */}
                {showSqlOptions && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            SQL Options
                        </h4>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Table Name:
                            </label>
                            <input
                                type="text"
                                value={options.tableName || 'data_table'}
                                onChange={(e) => updateOption('tableName', e.target.value)}
                                placeholder="Enter table name"
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Formatting Options */}
                {showFormattingOptions && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Formatting Options
                        </h4>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Indentation:
                            </label>
                            <select
                                value={options.indent || 2}
                                onChange={(e) => updateOption('indent', parseInt(e.target.value))}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={2}>2 spaces</option>
                                <option value={4}>4 spaces</option>
                                <option value={8}>8 spaces</option>
                                <option value={0}>Minified (no spaces)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Help Text */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> These options help customize the output format.
                    {showCsvOptions && ' CSV delimiter affects how columns are separated.'}
                    {showSqlOptions && ' Table name will be used in the generated SQL statements.'}
                    {showFormattingOptions && ' Indentation controls the spacing in formatted output.'}
                </p>
            </div>
        </div>
    );
}

