import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Prompt Library & Optimizer | 100+ Free ChatGPT, Claude, Gemini Prompts',
  description: 'Discover 100+ curated AI prompts for ChatGPT, Claude, and Gemini. Optimize your prompts for better results. Copy-paste ready templates for writing, marketing, coding, and more.',
  keywords: 'ai prompts, chatgpt prompts, claude prompts, gemini prompts, prompt engineering, ai prompt library, prompt optimizer, free prompts',
  openGraph: {
    title: 'AI Prompt Library & Optimizer | 100+ Free ChatGPT, Claude, Gemini Prompts',
    description: 'Discover 100+ curated AI prompts for ChatGPT, Claude, and Gemini. Optimize your prompts for better results.',
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

