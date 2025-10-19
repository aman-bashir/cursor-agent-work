'use client';

import { useState } from 'react';
import {
    Palette,
    Sparkles,
    Check,
    Eye,
    Download
} from 'lucide-react';
import { QRCustomization } from '../lib/types';
import { cn } from '../lib/utils';
import templatesData from '../data/templates.json';

interface TemplateSelectorProps {
    onTemplateSelect: (customization: Partial<QRCustomization>) => void;
}

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    customization: Partial<QRCustomization>;
    preview: string;
}

export default function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // Flatten all templates
    const allTemplates: Template[] = Object.values(templatesData).flat();
    const categories = ['all', ...Object.keys(templatesData)];

    const filteredTemplates = selectedCategory === 'all'
        ? allTemplates
        : allTemplates.filter(template => template.category === selectedCategory);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'business': return '💼';
            case 'creative': return '🎨';
            case 'minimal': return '⚪';
            case 'colorful': return '🌈';
            default: return '🎨';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'business': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
            case 'creative': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
            case 'minimal': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
            case 'colorful': return 'text-pink-600 bg-pink-100 dark:bg-pink-900/20';
            default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Design Templates
                </h3>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            selectedCategory === category
                                ? "bg-purple-600 text-white"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        )}
                    >
                        <span className="text-lg">{getCategoryIcon(category)}</span>
                        {category === 'all' ? 'All Templates' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className={cn(
                            "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                            selectedTemplate === template.id
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-purple-300"
                        )}
                        onClick={() => {
                            setSelectedTemplate(template.id);
                            onTemplateSelect(template.customization);
                        }}
                    >
                        {/* Template Preview */}
                        <div className="aspect-square bg-white dark:bg-slate-800 rounded-lg mb-3 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                            <div
                                className="w-16 h-16 rounded"
                                style={{
                                    backgroundColor: template.customization.backgroundColor || '#ffffff',
                                    border: `2px solid ${template.customization.foregroundColor || '#000000'}`
                                }}
                            />
                        </div>

                        {/* Template Info */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-slate-900 dark:text-white">
                                    {template.name}
                                </h4>
                                {selectedTemplate === template.id && (
                                    <Check className="w-5 h-5 text-purple-600" />
                                )}
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {template.description}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-xs font-medium",
                                    getCategoryColor(template.category)
                                )}>
                                    {template.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Templates */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <Palette className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No Templates Found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Try selecting a different category or create your own custom design.
                    </p>
                </div>
            )}

            {/* Template Actions */}
            {selectedTemplate && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-900 dark:text-purple-200">
                            Template Selected
                        </span>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                        The template has been applied to your QR code. You can further customize it using the options above.
                    </p>
                </div>
            )}

            {/* Template Info */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                    About Templates
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Templates provide pre-designed color schemes and styles</li>
                    <li>• You can customize any template after selecting it</li>
                    <li>• Templates are optimized for different use cases</li>
                    <li>• Business templates are professional and clean</li>
                    <li>• Creative templates are colorful and eye-catching</li>
                </ul>
            </div>
        </div>
    );
}
