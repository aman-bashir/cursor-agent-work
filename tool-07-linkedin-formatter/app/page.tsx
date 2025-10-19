'use client';

import { useState } from 'react';
import { 
  Edit3, 
  BarChart3, 
  BookOpen, 
  Eye, 
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  Zap
} from 'lucide-react';
import PostFormatter from '../components/PostFormatter';
import LinkedInPreview from '../components/LinkedInPreview';
import TemplateLibrary from '../components/TemplateLibrary';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'formatter' | 'preview' | 'templates'>('formatter');
  const [formattedContent, setFormattedContent] = useState('');

  const handleContentUpdate = (content: string) => {
    setFormattedContent(content);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            LinkedIn Post{' '}
            <span className="text-blue-600 dark:text-blue-400">Formatter</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Format LinkedIn posts perfectly. 30+ proven templates, engagement analyzer, 
            hook generator. Free tool for professionals and B2B marketers.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('formatter')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'formatter'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Formatter
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'templates'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Templates
            </button>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'formatter' && (
          <PostFormatter />
        )}

        {activeTab === 'preview' && (
          <LinkedInPreview 
            content={formattedContent || "Your formatted LinkedIn post will appear here..."}
            authorName="Your Name"
            authorTitle="Your Professional Title"
            authorCompany="Your Company"
          />
        )}

        {activeTab === 'templates' && (
          <TemplateLibrary />
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Engagement Analyzer
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Get a score from 0-100 and detailed suggestions to improve your post's engagement potential.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              30+ Templates
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Proven post templates for every situation - from personal stories to thought leadership.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Live Preview
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              See exactly how your post will look on LinkedIn with our realistic preview.
            </p>
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Write Your Post</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Type your LinkedIn post content in the formatter tool
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Format & Analyze</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Use our formatter to optimize spacing, add emojis, and get engagement scores
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Copy & Post</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Copy your formatted post and paste it directly into LinkedIn
              </p>
            </div>
          </div>
        </div>

        {/* LinkedIn Algorithm Tips */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">LinkedIn Algorithm 2025 Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">What Works</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  Posts with 1300-1900 characters perform best
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  Personal stories and experiences get more engagement
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  Questions and calls-to-action boost comments
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  3-5 relevant hashtags increase discoverability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  First 3 lines are crucial for engagement
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">What to Avoid</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  Overly promotional content without value
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  Posts without proper line breaks or spacing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  Too many hashtags (more than 5-7)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  Generic content without personal touch
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  No clear call-to-action or question
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How accurate is the engagement analyzer?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our analyzer is based on LinkedIn's algorithm patterns and best practices. While we can't guarantee specific results, 
                posts with higher scores generally perform better based on our analysis of successful LinkedIn content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Are the templates really effective?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes! Our templates are based on analysis of high-performing LinkedIn posts. They follow proven structures that 
                have generated thousands of likes, comments, and shares for other professionals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How often should I post on LinkedIn?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                For best results, aim for 3-5 posts per week. Consistency is more important than frequency. 
                Focus on quality content that provides value to your network.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What's the best time to post on LinkedIn?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Generally, Tuesday through Thursday between 8-9 AM or 5-6 PM work well. However, the best time depends on your 
                specific audience. Use LinkedIn Analytics to see when your audience is most active.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Is this tool really free?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes! Our LinkedIn Post Formatter is completely free to use. We believe in providing value to the professional 
                community without barriers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}