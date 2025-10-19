import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Token Counter & API Cost Calculator | ChatGPT, Claude, Gemini',
  description: 'Calculate tokens and API costs for GPT-4, Claude, Gemini. Compare prices across models. Free tool for developers. Updated for 2025 pricing.',
  keywords: 'token counter, ChatGPT token counter, GPT-4 cost calculator, Claude token calculator, API cost calculator, LLM pricing comparison',
  openGraph: {
    title: 'Token Counter & API Cost Calculator | ChatGPT, Claude, Gemini',
    description: 'Calculate tokens and API costs for GPT-4, Claude, Gemini. Compare prices across models.',
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

