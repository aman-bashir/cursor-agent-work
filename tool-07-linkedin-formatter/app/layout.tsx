import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinkedIn Post Formatter & Templates | Boost Your Engagement',
  description: 'Format LinkedIn posts perfectly. 30+ proven templates, engagement analyzer, hook generator. Free tool for professionals and B2B marketers.',
  keywords: 'linkedin post formatter, linkedin templates, linkedin engagement, linkedin content creator, linkedin algorithm, linkedin tips',
  openGraph: {
    title: 'LinkedIn Post Formatter & Templates | Boost Your Engagement',
    description: 'Format LinkedIn posts perfectly. 30+ proven templates, engagement analyzer, hook generator.',
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

