'use client';

import React, { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Copy, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
    title: string;
    placeholder?: string;
    readOnly?: boolean;
    error?: string;
    isValid?: boolean;
    onCopy?: () => void;
    onDownload?: () => void;
}

export function CodeEditor({
    value,
    onChange,
    language,
    title,
    placeholder = '',
    readOnly = false,
    error,
    isValid,
    onCopy,
    onDownload
}: CodeEditorProps) {
    const [isCopied, setIsCopied] = useState(false);
    const editorRef = useRef<any>(null);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            onCopy?.();
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.${language}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onDownload?.();
    };

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;

        // Add keyboard shortcuts
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
            handleCopy();
        });
    };

    const getLanguageForMonaco = (lang: string): string => {
        switch (lang.toLowerCase()) {
            case 'json': return 'json';
            case 'csv': return 'csv';
            case 'xml': return 'xml';
            case 'yaml': return 'yaml';
            case 'sql': return 'sql';
            default: return 'plaintext';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {title}
                    </h3>
                    {isValid !== undefined && (
                        <div className="flex items-center gap-1">
                            {isValid ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {isValid ? 'Valid' : 'Invalid'}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isCopied
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                            }`}
                    >
                        <Copy className="w-4 h-4" />
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-700">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Editor */}
            <div className="h-96">
                <Editor
                    height="100%"
                    language={getLanguageForMonaco(language)}
                    value={value}
                    onChange={(newValue) => onChange(newValue || '')}
                    onMount={handleEditorDidMount}
                    options={{
                        readOnly,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                        tabSize: 2,
                        insertSpaces: true,
                        renderWhitespace: 'selection',
                        bracketPairColorization: { enabled: true },
                        suggest: { showKeywords: true },
                        quickSuggestions: true,
                        parameterHints: { enabled: true },
                        hover: { enabled: true },
                        contextmenu: true,
                        mouseWheelZoom: true,
                        padding: { top: 16, bottom: 16 },
                        ...(language === 'json' && {
                            formatOnPaste: true,
                            formatOnType: true,
                            autoClosingBrackets: 'always',
                            autoClosingQuotes: 'always'
                        })
                    }}
                    theme="vs-dark"
                />
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                        <span>Language: {language.toUpperCase()}</span>
                        <span>Lines: {value.split('\n').length}</span>
                        <span>Characters: {value.length.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-xs">
                            Ctrl+C
                        </kbd>
                        <span>to copy</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

