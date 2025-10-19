export type QRType =
    | 'url'
    | 'text'
    | 'wifi'
    | 'email'
    | 'phone'
    | 'sms'
    | 'vcard';

export interface QRData {
    type: QRType;
    content: string;
    // Type-specific data
    url?: string;
    text?: string;
    wifi?: {
        ssid: string;
        password: string;
        security: 'WPA' | 'WEP' | 'nopass';
        hidden?: boolean;
    };
    email?: {
        email: string;
        subject?: string;
        body?: string;
    };
    phone?: {
        number: string;
    };
    sms?: {
        number: string;
        message?: string;
    };
    vcard?: {
        firstName: string;
        lastName: string;
        organization?: string;
        title?: string;
        phone?: string;
        email?: string;
        website?: string;
        address?: string;
    };
}

export interface QRCustomization {
    size: number;
    foregroundColor: string;
    backgroundColor: string;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    dotStyle: 'square' | 'rounded' | 'dots';
    eyeStyle: 'square' | 'rounded' | 'circle';
    logo?: string; // Base64 image data
    logoSize?: number;
    margin: number;
}

export interface GeneratedQRCode {
    id: string;
    data: QRData;
    customization: QRCustomization;
    qrCodeDataUrl: string;
    createdAt: string;
}

export interface QRCodeTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    customization: Partial<QRCustomization>;
    preview: string;
}
