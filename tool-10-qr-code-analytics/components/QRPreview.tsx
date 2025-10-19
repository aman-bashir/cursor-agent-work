'use client';

import { useState } from 'react';
import {
    Download,
    Copy,
    Check,
    Share2,
    Eye,
    Smartphone,
    Monitor,
    Printer,
    FileImage,
    FileText,
    File
} from 'lucide-react';
import { GeneratedQRCode } from '../lib/types';
import { downloadQRCode, copyQRCodeToClipboard } from '../lib/qrGenerator';
import { cn } from '../lib/utils';

interface QRPreviewProps {
    qrCode: GeneratedQRCode | null;
    isGenerating: boolean;
}

export default function QRPreview({ qrCode, isGenerating }: QRPreviewProps) {
    const [copied, setCopied] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'print'>('desktop');

    const handleDownload = (format: 'png' | 'svg' | 'pdf') => {
        if (!qrCode) return;

        const filename = `qrcode-${qrCode.id}.${format}`;
        downloadQRCode(qrCode.qrCodeDataUrl, filename);
    };

    const handleCopy = async () => {
        if (!qrCode) return;

        try {
            await copyQRCodeToClipboard(qrCode.qrCodeDataUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy QR code:', error);
        }
    };

    const handleShare = async () => {
        if (!qrCode) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'QR Code',
                    text: 'Check out this QR code I generated',
                    url: qrCode.qrCodeDataUrl
                });
            } catch (error) {
                console.error('Failed to share:', error);
            }
        } else {
            // Fallback to copying URL
            handleCopy();
        }
    };

    const getPreviewSize = () => {
        switch (previewMode) {
            case 'mobile': return 200;
            case 'print': return 300;
            default: return 300;
        }
    };

    const getPreviewContext = () => {
        switch (previewMode) {
            case 'mobile':
                return {
                    title: 'Mobile Preview',
                    description: 'How your QR code looks on mobile devices',
                    icon: Smartphone,
                    bgColor: 'bg-slate-100 dark:bg-slate-800'
                };
            case 'print':
                return {
                    title: 'Print Preview',
                    description: 'Optimized for printing and physical use',
                    icon: Printer,
                    bgColor: 'bg-white'
                };
            default:
                return {
                    title: 'Desktop Preview',
                    description: 'How your QR code looks on desktop',
                    icon: Monitor,
                    bgColor: 'bg-slate-50 dark:bg-slate-900'
                };
        }
    };

    const previewContext = getPreviewContext();
    const Icon = previewContext.icon;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Preview & Download
                </h3>
            </div>

            {/* Preview Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {[
                    { id: 'desktop', label: 'Desktop', icon: Monitor },
                    { id: 'mobile', label: 'Mobile', icon: Smartphone },
                    { id: 'print', label: 'Print', icon: Printer }
                ].map((mode) => {
                    const ModeIcon = mode.icon;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => setPreviewMode(mode.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                previewMode === mode.id
                                    ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <ModeIcon className="w-4 h-4" />
                            {mode.label}
                        </button>
                    );
                })}
            </div>

            {/* Preview Area */}
            <div className={cn(
                "rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] transition-colors",
                previewContext.bgColor
            )}>
                {isGenerating ? (
                    <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400">
                            Generating QR code...
                        </p>
                    </div>
                ) : qrCode ? (
                    <div className="text-center">
                        <div className="mb-4">
                            <img
                                src={qrCode.qrCodeDataUrl}
                                alt="Generated QR Code"
                                className="mx-auto shadow-lg rounded-lg"
                                style={{
                                    width: getPreviewSize(),
                                    height: getPreviewSize(),
                                    maxWidth: '100%'
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                                {previewContext.title}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {previewContext.description}
                            </p>
                        </div>

                        {/* QR Code Info */}
                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                            <p>Type: {qrCode.data.type.toUpperCase()}</p>
                            <p>Size: {qrCode.customization.size}px</p>
                            <p>Generated: {new Date(qrCode.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <Icon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                            No QR Code Generated
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400">
                            Fill in the form and click "Generate QR Code" to see a preview
                        </p>
                    </div>
                )}
            </div>

            {/* Actions */}
            {qrCode && (
                <div className="space-y-4">
                    {/* Primary Actions */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleDownload('png')}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download PNG
                        </button>

                        <button
                            onClick={() => handleDownload('svg')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <FileImage className="w-4 h-4" />
                            Download SVG
                        </button>

                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Image'}
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>

                    {/* Additional Download Options */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            Additional Formats
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleDownload('pdf')}
                                className="flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                PDF
                            </button>

                            <button
                                onClick={() => {
                                    const dataUrl = qrCode.qrCodeDataUrl;
                                    const link = document.createElement('a');
                                    link.href = dataUrl;
                                    link.download = `qrcode-${qrCode.id}.jpg`;
                                    link.click();
                                }}
                                className="flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                            >
                                <FileImage className="w-4 h-4" />
                                JPG
                            </button>
                        </div>
                    </div>

                    {/* QR Code Details */}
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            QR Code Details
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <div>
                                <span className="font-medium">Type:</span> {qrCode.data.type}
                            </div>
                            <div>
                                <span className="font-medium">Size:</span> {qrCode.customization.size}px
                            </div>
                            <div>
                                <span className="font-medium">Error Correction:</span> {qrCode.customization.errorCorrectionLevel}
                            </div>
                            <div>
                                <span className="font-medium">Dot Style:</span> {qrCode.customization.dotStyle}
                            </div>
                            <div>
                                <span className="font-medium">Eye Style:</span> {qrCode.customization.eyeStyle}
                            </div>
                            <div>
                                <span className="font-medium">Has Logo:</span> {qrCode.customization.logo ? 'Yes' : 'No'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                    💡 Pro Tips
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Use PNG for web and digital use</li>
                    <li>• Use SVG for scalable graphics</li>
                    <li>• Use PDF for professional printing</li>
                    <li>• Test your QR code before printing</li>
                    <li>• Higher error correction allows for logo placement</li>
                </ul>
            </div>
        </div>
    );
}
