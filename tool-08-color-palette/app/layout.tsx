import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Color Palette Generator | Create Beautiful Color Schemes',
  description: 'Generate stunning color palettes with themes, extract colors from images, or create random combinations. Free tool for designers and developers.',
  keywords: 'color palette generator, color scheme, color picker, design tools, color harmony, color extraction, color theory',
  openGraph: {
    title: 'Color Palette Generator | Create Beautiful Color Schemes',
    description: 'Generate stunning color palettes with themes, extract colors from images, or create random combinations.',
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