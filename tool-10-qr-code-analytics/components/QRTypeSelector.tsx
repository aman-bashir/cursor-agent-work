'use client';

import { useState } from 'react';
import {
    Link,
    Type,
    Wifi,
    Mail,
    Phone,
    MessageSquare,
    User,
    ChevronDown,
    Globe,
    FileText,
    Router,
    AtSign,
    Smartphone,
    Send,
    Contact
} from 'lucide-react';
import { QRType, QRData } from '../lib/types';
import { cn } from '../lib/utils';

interface QRTypeSelectorProps {
    selectedType: QRType;
    onTypeChange: (type: QRType) => void;
    onDataChange: (data: Partial<QRData>) => void;
}

const qrTypes = [
    {
        id: 'url' as QRType,
        label: 'URL',
        description: 'Website link',
        icon: Link,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
        id: 'text' as QRType,
        label: 'Text',
        description: 'Plain text message',
        icon: Type,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100 dark:bg-gray-900/20'
    },
    {
        id: 'wifi' as QRType,
        label: 'WiFi',
        description: 'WiFi network credentials',
        icon: Wifi,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
        id: 'email' as QRType,
        label: 'Email',
        description: 'Email with subject/body',
        icon: Mail,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
        id: 'phone' as QRType,
        label: 'Phone',
        description: 'Phone number',
        icon: Phone,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
        id: 'sms' as QRType,
        label: 'SMS',
        description: 'Text message',
        icon: MessageSquare,
        color: 'text-pink-600',
        bgColor: 'bg-pink-100 dark:bg-pink-900/20'
    },
    {
        id: 'vcard' as QRType,
        label: 'vCard',
        description: 'Contact information',
        icon: User,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
    }
];

export default function QRTypeSelector({
    selectedType,
    onTypeChange,
    onDataChange
}: QRTypeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedTypeInfo = qrTypes.find(type => type.id === selectedType);

    const handleTypeSelect = (type: QRType) => {
        onTypeChange(type);
        onDataChange({ type });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                QR Code Type
            </label>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {selectedTypeInfo && (
                        <>
                            <div className={cn("p-2 rounded-lg", selectedTypeInfo.bgColor)}>
                                <selectedTypeInfo.icon className={cn("w-5 h-5", selectedTypeInfo.color)} />
                            </div>
                            <div className="text-left">
                                <div className="font-medium">{selectedTypeInfo.label}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {selectedTypeInfo.description}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <ChevronDown className={cn(
                    "w-5 h-5 text-slate-400 transition-transform",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                    {qrTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.id}
                                onClick={() => handleTypeSelect(type.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                                    selectedType === type.id && "bg-slate-100 dark:bg-slate-700"
                                )}
                            >
                                <div className={cn("p-2 rounded-lg", type.bgColor)}>
                                    <Icon className={cn("w-5 h-5", type.color)} />
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {type.label}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        {type.description}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Type-specific input fields */}
            <div className="mt-4">
                {selectedType === 'url' && (
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Website URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            placeholder="https://example.com"
                            onChange={(e) => onDataChange({ url: e.target.value })}
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {selectedType === 'text' && (
                    <div>
                        <label htmlFor="text" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Text Message
                        </label>
                        <textarea
                            id="text"
                            placeholder="Enter your text message..."
                            rows={3}
                            onChange={(e) => onDataChange({ text: e.target.value })}
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {selectedType === 'wifi' && (
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="wifi-ssid" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Network Name (SSID)
                            </label>
                            <input
                                type="text"
                                id="wifi-ssid"
                                placeholder="MyWiFiNetwork"
                                onChange={(e) => onDataChange({
                                    wifi: {
                                        ...selectedType === 'wifi' ? {} : {},
                                        ssid: e.target.value
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="wifi-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="wifi-password"
                                placeholder="Enter WiFi password"
                                onChange={(e) => onDataChange({
                                    wifi: {
                                        ssid: '',
                                        password: e.target.value,
                                        security: 'WPA'
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="wifi-security" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Security Type
                            </label>
                            <select
                                id="wifi-security"
                                onChange={(e) => onDataChange({
                                    wifi: {
                                        ssid: '',
                                        password: '',
                                        security: e.target.value as 'WPA' | 'WEP' | 'nopass'
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">No Password</option>
                            </select>
                        </div>
                    </div>
                )}

                {selectedType === 'email' && (
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email-address"
                                placeholder="example@email.com"
                                onChange={(e) => onDataChange({
                                    email: {
                                        email: e.target.value,
                                        subject: '',
                                        body: ''
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Subject (Optional)
                            </label>
                            <input
                                type="text"
                                id="email-subject"
                                placeholder="Email subject"
                                onChange={(e) => onDataChange({
                                    email: {
                                        email: '',
                                        subject: e.target.value,
                                        body: ''
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-body" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Message (Optional)
                            </label>
                            <textarea
                                id="email-body"
                                placeholder="Email message body"
                                rows={2}
                                onChange={(e) => onDataChange({
                                    email: {
                                        email: '',
                                        subject: '',
                                        body: e.target.value
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {selectedType === 'phone' && (
                    <div>
                        <label htmlFor="phone-number" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone-number"
                            placeholder="+1 (555) 123-4567"
                            onChange={(e) => onDataChange({
                                phone: {
                                    number: e.target.value
                                }
                            })}
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {selectedType === 'sms' && (
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="sms-number" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="sms-number"
                                placeholder="+1 (555) 123-4567"
                                onChange={(e) => onDataChange({
                                    sms: {
                                        number: e.target.value,
                                        message: ''
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="sms-message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Message (Optional)
                            </label>
                            <textarea
                                id="sms-message"
                                placeholder="Pre-written message"
                                rows={2}
                                onChange={(e) => onDataChange({
                                    sms: {
                                        number: '',
                                        message: e.target.value
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {selectedType === 'vcard' && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="vcard-firstname" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="vcard-firstname"
                                    placeholder="John"
                                    onChange={(e) => onDataChange({
                                        vcard: {
                                            firstName: e.target.value,
                                            lastName: '',
                                            organization: '',
                                            title: '',
                                            phone: '',
                                            email: '',
                                            website: '',
                                            address: ''
                                        }
                                    })}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="vcard-lastname" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="vcard-lastname"
                                    placeholder="Doe"
                                    onChange={(e) => onDataChange({
                                        vcard: {
                                            firstName: '',
                                            lastName: e.target.value,
                                            organization: '',
                                            title: '',
                                            phone: '',
                                            email: '',
                                            website: '',
                                            address: ''
                                        }
                                    })}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="vcard-organization" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Organization (Optional)
                            </label>
                            <input
                                type="text"
                                id="vcard-organization"
                                placeholder="Company Name"
                                onChange={(e) => onDataChange({
                                    vcard: {
                                        firstName: '',
                                        lastName: '',
                                        organization: e.target.value,
                                        title: '',
                                        phone: '',
                                        email: '',
                                        website: '',
                                        address: ''
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="vcard-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                id="vcard-email"
                                placeholder="john@example.com"
                                onChange={(e) => onDataChange({
                                    vcard: {
                                        firstName: '',
                                        lastName: '',
                                        organization: '',
                                        title: '',
                                        phone: '',
                                        email: e.target.value,
                                        website: '',
                                        address: ''
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="vcard-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                id="vcard-phone"
                                placeholder="+1 (555) 123-4567"
                                onChange={(e) => onDataChange({
                                    vcard: {
                                        firstName: '',
                                        lastName: '',
                                        organization: '',
                                        title: '',
                                        phone: e.target.value,
                                        email: '',
                                        website: '',
                                        address: ''
                                    }
                                })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
