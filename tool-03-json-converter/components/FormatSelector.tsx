'use client';

import React from 'react';
import { FileText, Table, Code, Database, FileCode } from 'lucide-react';

export interface FormatOption {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    extensions: string[];
    mimeType: string;
}

export const FORMAT_OPTIONS: FormatOption[] = [
    {
        id: 'json',
        name: 'JSON',
        description: 'JavaScript Object Notation',
        icon: FileText,
        extensions: ['.json'],
        mimeType: 'application/json'
    },
    {
        id: 'csv',
        name: 'CSV',
        description: 'Comma-Separated Values',
        icon: Table,
        extensions: ['.csv'],
        mimeType: 'text/csv'
    },
    {
        id: 'xml',
        name: 'XML',
        description: 'eXtensible Markup Language',
        icon: Code,
        extensions: ['.xml'],
        mimeType: 'application/xml'
    },
    {
        id: 'yaml',
        name: 'YAML',
        description: 'YAML Ain\'t Markup Language',
        icon: FileCode,
        extensions: ['.yaml', '.yml'],
        mimeType: 'text/yaml'
    },
    {
        id: 'sql',
        name: 'SQL',
        description: 'Structured Query Language',
        icon: Database,
        extensions: ['.sql'],
        mimeType: 'application/sql'
    }
];

interface FormatSelectorProps {
    selectedFormat: string;
    onFormatChange: (format: string) => void;
    direction: 'from' | 'to';
    disabledFormats?: string[];
}

export function FormatSelector({
    selectedFormat,
    onFormatChange,
    direction,
    disabledFormats = []
}: FormatSelectorProps) {
    const availableFormats = FORMAT_OPTIONS.filter(
        format => !disabledFormats.includes(format.id)
    );

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                {direction === 'from' ? 'From Format' : 'To Format'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableFormats.map((format) => {
                    const IconComponent = format.icon;
                    const isSelected = selectedFormat === format.id;

                    return (
                        <button
                            key={format.id}
                            onClick={() => onFormatChange(format.id)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${isSelected
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <IconComponent
                                    className={`w-6 h-6 mt-1 ${isSelected
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-slate-600 dark:text-slate-400'
                                        }`}
                                />
                                <div className="flex-1">
                                    <h4 className={`font-semibold ${isSelected
                                            ? 'text-blue-900 dark:text-blue-100'
                                            : 'text-slate-900 dark:text-slate-100'
                                        }`}>
                                        {format.name}
                                    </h4>
                                    <p className={`text-sm mt-1 ${isSelected
                                            ? 'text-blue-700 dark:text-blue-300'
                                            : 'text-slate-600 dark:text-slate-400'
                                        }`}>
                                        {format.description}
                                    </p>
                                    <div className={`text-xs mt-2 ${isSelected
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-slate-500 dark:text-slate-500'
                                        }`}>
                                        {format.extensions.join(', ')}
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Format Info */}
            {selectedFormat && (
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        {(() => {
                            const format = FORMAT_OPTIONS.find(f => f.id === selectedFormat);
                            const IconComponent = format?.icon || FileText;
                            return <IconComponent className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
                        })()}
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {FORMAT_OPTIONS.find(f => f.id === selectedFormat)?.name} Format
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {FORMAT_OPTIONS.find(f => f.id === selectedFormat)?.description}
                    </p>
                </div>
            )}
        </div>
    );
}

