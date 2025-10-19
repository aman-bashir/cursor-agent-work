'use client';

import { useState, useRef } from 'react';
import {
    Palette,
    Upload,
    Download,
    RotateCcw,
    Square,
    Circle,
    Minus,
    Plus,
    Image as ImageIcon,
    X
} from 'lucide-react';
import { QRCustomization } from '../lib/types';
import { cn } from '../lib/utils';

interface QRCustomizerProps {
    customization: QRCustomization;
    onCustomizationChange: (customization: QRCustomization) => void;
}

export default function QRCustomizer({
    customization,
    onCustomizationChange
}: QRCustomizerProps) {
    const [showColorPicker, setShowColorPicker] = useState<'foreground' | 'background' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleColorChange = (color: string, type: 'foreground' | 'background') => {
        onCustomizationChange({
            ...customization,
            [type === 'foreground' ? 'foregroundColor' : 'backgroundColor']: color
        });
    };

    const handleSizeChange = (size: number) => {
        onCustomizationChange({
            ...customization,
            size: Math.max(100, Math.min(2000, size))
        });
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onCustomizationChange({
                    ...customization,
                    logo: e.target?.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        onCustomizationChange({
            ...customization,
            logo: undefined
        });
    };

    const resetCustomization = () => {
        onCustomizationChange({
            size: 300,
            foregroundColor: '#000000',
            backgroundColor: '#ffffff',
            errorCorrectionLevel: 'M',
            dotStyle: 'square',
            eyeStyle: 'square',
            margin: 4
        });
    };

    const presetColors = [
        { name: 'Black', value: '#000000' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Green', value: '#10b981' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Indigo', value: '#6366f1' }
    ];

    const backgroundColors = [
        { name: 'White', value: '#ffffff' },
        { name: 'Light Gray', value: '#f3f4f6' },
        { name: 'Light Blue', value: '#dbeafe' },
        { name: 'Light Green', value: '#dcfce7' },
        { name: 'Light Purple', value: '#ede9fe' },
        { name: 'Light Pink', value: '#fce7f3' },
        { name: 'Light Yellow', value: '#fef3c7' },
        { name: 'Light Orange', value: '#fed7aa' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Customize Design
                    </h3>
                </div>
                <button
                    onClick={resetCustomization}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </button>
            </div>

            {/* Size */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Size: {customization.size}px
                </label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSizeChange(customization.size - 50)}
                        className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="50"
                        value={customization.size}
                        onChange={(e) => handleSizeChange(Number(e.target.value))}
                        className="flex-1"
                    />
                    <button
                        onClick={() => handleSizeChange(customization.size + 50)}
                        className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
                {/* Foreground Color */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Foreground Color
                    </label>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 border-2 border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                            style={{ backgroundColor: customization.foregroundColor }}
                            onClick={() => setShowColorPicker(showColorPicker === 'foreground' ? null : 'foreground')}
                        />
                        <input
                            type="color"
                            value={customization.foregroundColor}
                            onChange={(e) => handleColorChange(e.target.value, 'foreground')}
                            className="w-10 h-10 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                        />
                    </div>

                    {showColorPicker === 'foreground' && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                            {presetColors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => handleColorChange(color.value, 'foreground')}
                                    className={cn(
                                        "w-8 h-8 rounded border-2 transition-all",
                                        customization.foregroundColor === color.value
                                            ? "border-slate-900 dark:border-white scale-110"
                                            : "border-slate-300 dark:border-slate-600 hover:scale-105"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Background Color */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Background Color
                    </label>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 border-2 border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                            style={{ backgroundColor: customization.backgroundColor }}
                            onClick={() => setShowColorPicker(showColorPicker === 'background' ? null : 'background')}
                        />
                        <input
                            type="color"
                            value={customization.backgroundColor}
                            onChange={(e) => handleColorChange(e.target.value, 'background')}
                            className="w-10 h-10 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                        />
                    </div>

                    {showColorPicker === 'background' && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                            {backgroundColors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => handleColorChange(color.value, 'background')}
                                    className={cn(
                                        "w-8 h-8 rounded border-2 transition-all",
                                        customization.backgroundColor === color.value
                                            ? "border-slate-900 dark:border-white scale-110"
                                            : "border-slate-300 dark:border-slate-600 hover:scale-105"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Style Options */}
            <div className="space-y-4">
                {/* Dot Style */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Dot Style
                    </label>
                    <div className="flex gap-2">
                        {[
                            { value: 'square', label: 'Square', icon: Square },
                            { value: 'rounded', label: 'Rounded', icon: Circle },
                            { value: 'dots', label: 'Dots', icon: Circle }
                        ].map((style) => {
                            const Icon = style.icon;
                            return (
                                <button
                                    key={style.value}
                                    onClick={() => onCustomizationChange({ ...customization, dotStyle: style.value as any })}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors",
                                        customization.dotStyle === style.value
                                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                            : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {style.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Eye Style */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Corner Style
                    </label>
                    <div className="flex gap-2">
                        {[
                            { value: 'square', label: 'Square', icon: Square },
                            { value: 'rounded', label: 'Rounded', icon: Circle },
                            { value: 'circle', label: 'Circle', icon: Circle }
                        ].map((style) => {
                            const Icon = style.icon;
                            return (
                                <button
                                    key={style.value}
                                    onClick={() => onCustomizationChange({ ...customization, eyeStyle: style.value as any })}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors",
                                        customization.eyeStyle === style.value
                                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                            : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {style.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Error Correction Level */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Error Correction Level
                    </label>
                    <select
                        value={customization.errorCorrectionLevel}
                        onChange={(e) => onCustomizationChange({
                            ...customization,
                            errorCorrectionLevel: e.target.value as any
                        })}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="L">Low (7%)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                    </select>
                </div>
            </div>

            {/* Logo Upload */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Logo (Optional)
                </label>

                {customization.logo ? (
                    <div className="relative inline-block">
                        <img
                            src={customization.logo}
                            alt="Logo preview"
                            className="w-20 h-20 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
                        />
                        <button
                            onClick={removeLogo}
                            className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
                    >
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                />

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Upload a logo to place in the center of your QR code
                </p>
            </div>

            {/* Margin */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Margin: {customization.margin}px
                </label>
                <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={customization.margin}
                    onChange={(e) => onCustomizationChange({
                        ...customization,
                        margin: Number(e.target.value)
                    })}
                    className="w-full"
                />
            </div>
        </div>
    );
}
