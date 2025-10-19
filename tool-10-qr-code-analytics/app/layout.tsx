import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free QR Code Generator with Analytics & Tracking | Dynamic QR Codes',
  description: 'Create custom QR codes with logos, tracking, and analytics. Free & Pro plans. Generate static or dynamic QR codes for marketing, events, menus.',
  keywords: 'qr code generator, free qr code generator, qr code maker, create qr code, dynamic qr code, qr code with logo, qr code tracking, custom qr code, qr code analytics',
  openGraph: {
    title: 'Free QR Code Generator with Analytics & Tracking | Dynamic QR Codes',
    description: 'Create custom QR codes with logos, tracking, and analytics. Free & Pro plans.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}