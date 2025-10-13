import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Color Palette', description: 'Color Palette built with Next.js' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}

