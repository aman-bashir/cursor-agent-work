import QRCodeStyling from 'qr-code-styling';
import { QRData, QRCustomization, GeneratedQRCode } from './types';

export function generateQRCodeData(data: QRData): string {
    switch (data.type) {
        case 'url':
            return data.url || '';

        case 'text':
            return data.text || '';

        case 'wifi':
            if (!data.wifi) return '';
            const { ssid, password, security, hidden } = data.wifi;
            return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;

        case 'email':
            if (!data.email) return '';
            const { email, subject, body } = data.email;
            let emailString = `mailto:${email}`;
            const params = [];
            if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
            if (body) params.push(`body=${encodeURIComponent(body)}`);
            if (params.length > 0) emailString += `?${params.join('&')}`;
            return emailString;

        case 'phone':
            if (!data.phone) return '';
            return `tel:${data.phone.number}`;

        case 'sms':
            if (!data.sms) return '';
            const { number, message } = data.sms;
            let smsString = `sms:${number}`;
            if (message) smsString += `:${encodeURIComponent(message)}`;
            return smsString;

        case 'vcard':
            if (!data.vcard) return '';
            const vcard = data.vcard;
            const vcardLines = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:${vcard.firstName} ${vcard.lastName}`,
                `N:${vcard.lastName};${vcard.firstName};;;`
            ];

            if (vcard.organization) vcardLines.push(`ORG:${vcard.organization}`);
            if (vcard.title) vcardLines.push(`TITLE:${vcard.title}`);
            if (vcard.phone) vcardLines.push(`TEL:${vcard.phone}`);
            if (vcard.email) vcardLines.push(`EMAIL:${vcard.email}`);
            if (vcard.website) vcardLines.push(`URL:${vcard.website}`);
            if (vcard.address) vcardLines.push(`ADR:;;${vcard.address};;;;`);

            vcardLines.push('END:VCARD');
            return vcardLines.join('\n');

        default:
            return '';
    }
}

export async function generateQRCodeImage(
    data: QRData,
    customization: QRCustomization
): Promise<string> {
    const qrData = generateQRCodeData(data);

    const qrCode = new QRCodeStyling({
        width: customization.size,
        height: customization.size,
        type: 'svg',
        data: qrData,
        image: customization.logo,
        dotsOptions: {
            color: customization.foregroundColor,
            type: customization.dotStyle
        },
        backgroundOptions: {
            color: customization.backgroundColor
        },
        cornersSquareOptions: {
            color: customization.foregroundColor,
            type: customization.eyeStyle
        },
        cornersDotOptions: {
            color: customization.foregroundColor,
            type: customization.dotStyle
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: customization.logoSize || 20
        }
    });

    return new Promise((resolve, reject) => {
        qrCode.getRawData('png').then((data) => {
            const blob = new Blob([data], { type: 'image/png' });
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }).catch(reject);
    });
}

export function createGeneratedQRCode(
    data: QRData,
    customization: QRCustomization,
    qrCodeDataUrl: string
): GeneratedQRCode {
    return {
        id: Date.now().toString(),
        data,
        customization,
        qrCodeDataUrl,
        createdAt: new Date().toISOString()
    };
}

export function downloadQRCode(
    dataUrl: string,
    filename: string = 'qrcode.png'
): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function copyQRCodeToClipboard(dataUrl: string): Promise<void> {
    return fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]));
}

export function getDefaultCustomization(): QRCustomization {
    return {
        size: 300,
        foregroundColor: '#000000',
        backgroundColor: '#ffffff',
        errorCorrectionLevel: 'M',
        dotStyle: 'square',
        eyeStyle: 'square',
        margin: 4
    };
}

export function validateQRData(data: QRData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (data.type) {
        case 'url':
            if (!data.url) {
                errors.push('URL is required');
            } else if (!isValidUrl(data.url)) {
                errors.push('Please enter a valid URL');
            }
            break;

        case 'text':
            if (!data.text || data.text.trim().length === 0) {
                errors.push('Text is required');
            }
            break;

        case 'wifi':
            if (!data.wifi?.ssid) {
                errors.push('WiFi network name (SSID) is required');
            }
            break;

        case 'email':
            if (!data.email?.email) {
                errors.push('Email address is required');
            } else if (!isValidEmail(data.email.email)) {
                errors.push('Please enter a valid email address');
            }
            break;

        case 'phone':
            if (!data.phone?.number) {
                errors.push('Phone number is required');
            }
            break;

        case 'sms':
            if (!data.sms?.number) {
                errors.push('Phone number is required');
            }
            break;

        case 'vcard':
            if (!data.vcard?.firstName || !data.vcard?.lastName) {
                errors.push('First name and last name are required');
            }
            break;
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

function isValidUrl(string: string): boolean {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
