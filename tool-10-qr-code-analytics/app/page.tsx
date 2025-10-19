'use client';

import { useState, useCallback } from 'react';
import {
  QrCode,
  Palette,
  Eye,
  Sparkles,
  Download,
  Copy,
  Share2,
  Smartphone,
  Monitor,
  Printer,
  FileImage,
  FileText,
  File,
  Check,
  AlertCircle,
  Info,
  Zap,
  Shield,
  BarChart3,
  Users,
  Globe,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  User,
  Link,
  Type
} from 'lucide-react';
import { QRData, QRCustomization, GeneratedQRCode } from './lib/types';
import {
  generateQRCodeImage,
  createGeneratedQRCode,
  getDefaultCustomization,
  validateQRData
} from './lib/qrGenerator';
import { cn } from './lib/utils';
import QRTypeSelector from './components/QRTypeSelector';
import QRCustomizer from './components/QRCustomizer';
import QRPreview from './components/QRPreview';
import TemplateSelector from './components/TemplateSelector';

type TabType = 'generate' | 'customize' | 'templates';

export default function QRCodeGeneratorPage() {
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [qrData, setQrData] = useState<QRData>({ type: 'url', content: '' });
  const [customization, setCustomization] = useState<QRCustomization>(getDefaultCustomization());
  const [generatedQR, setGeneratedQR] = useState<GeneratedQRCode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleGenerateQR = useCallback(async () => {
    setErrors([]);

    // Validate QR data
    const validation = validateQRData(qrData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsGenerating(true);

    try {
      const qrCodeDataUrl = await generateQRCodeImage(qrData, customization);
      const generatedQRCode = createGeneratedQRCode(qrData, customization, qrCodeDataUrl);
      setGeneratedQR(generatedQRCode);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      setErrors(['Failed to generate QR code. Please try again.']);
    } finally {
      setIsGenerating(false);
    }
  }, [qrData, customization]);

  const handleDataChange = useCallback((newData: Partial<QRData>) => {
    setQrData(prev => ({ ...prev, ...newData }));
    setErrors([]);
  }, []);

  const handleCustomizationChange = useCallback((newCustomization: QRCustomization) => {
    setCustomization(newCustomization);
  }, []);

  const handleTemplateSelect = useCallback((templateCustomization: Partial<QRCustomization>) => {
    setCustomization(prev => ({ ...prev, ...templateCustomization }));
  }, []);

  const tabs = [
    { id: 'generate', label: 'Generate QR Code', icon: QrCode },
    { id: 'customize', label: 'Customize Design', icon: Palette },
    { id: 'templates', label: 'Templates', icon: Sparkles },
  ];

  const qrTypes = [
    { type: 'url', label: 'Website URL', icon: Link, description: 'Link to any website' },
    { type: 'text', label: 'Plain Text', icon: Type, description: 'Any text message' },
    { type: 'wifi', label: 'WiFi Network', icon: Wifi, description: 'WiFi login credentials' },
    { type: 'email', label: 'Email', icon: Mail, description: 'Send email with subject/body' },
    { type: 'phone', label: 'Phone Number', icon: Phone, description: 'Make a phone call' },
    { type: 'sms', label: 'SMS Message', icon: MessageSquare, description: 'Send text message' },
    { type: 'vcard', label: 'Contact Card', icon: User, description: 'Share contact information' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <QrCode className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                QR Code Generator
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Create custom QR codes for URLs, WiFi, contacts, and more. Free, fast, and easy to use.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      Please fix the following errors:
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'generate' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <QRTypeSelector
                  selectedType={qrData.type}
                  onTypeChange={(type) => handleDataChange({ type })}
                  onDataChange={handleDataChange}
                />

                <div className="mt-6">
                  <button
                    onClick={handleGenerateQR}
                    disabled={isGenerating}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                      isGenerating
                        ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-5 h-5" />
                        Generate QR Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'customize' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <QRCustomizer
                  customization={customization}
                  onCustomizationChange={handleCustomizationChange}
                />
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <TemplateSelector
                  onTemplateSelect={handleTemplateSelect}
                />
              </div>
            )}

            {/* QR Code Types Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Supported QR Code Types
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {qrTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.type}
                      className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {type.label}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {type.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div>
            <QRPreview
              qrCode={generatedQR}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Fast & Easy
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Generate QR codes in seconds. No registration required. Just enter your data and download.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Fully Customizable
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Customize colors, add logos, choose styles, and select from professional templates.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Privacy First
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              All processing happens in your browser. Your data never leaves your device.
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Popular Use Cases
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Website Links
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share your website, landing pages, or social media profiles
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                WiFi Access
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Let guests connect to your WiFi network instantly
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Contact Sharing
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share your contact information at events or meetings
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Marketing
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Promote products, events, or special offers
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>Free QR Code Generator - No registration required</p>
        </div>
      </div>
    </div>
  );
}