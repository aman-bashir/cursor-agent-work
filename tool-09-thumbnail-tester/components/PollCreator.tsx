'use client';

import { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Clock, 
  Users, 
  Link,
  Calendar,
  Settings,
  Eye,
  BarChart3
} from 'lucide-react';
import { ThumbnailAnalysis } from '../lib/types';
import { createPoll } from '../lib/pollManager';
import { cn } from '../lib/utils';

interface PollCreatorProps {
  analyses: ThumbnailAnalysis[];
  onPollCreated?: (pollUrl: string) => void;
}

export default function PollCreator({ analyses, onPollCreated }: PollCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [pollUrl, setPollUrl] = useState<string | null>(null);
  const [pollTitle, setPollTitle] = useState('');
  const [expirationDays, setExpirationDays] = useState(7);
  const [copied, setCopied] = useState(false);

  const handleCreatePoll = async () => {
    if (analyses.length < 2) {
      alert('You need at least 2 thumbnails to create a poll');
      return;
    }

    setIsCreating(true);
    
    try {
      const thumbnailUrls = analyses.map(analysis => analysis.imageUrl);
      const { pollId, url } = await createPoll(thumbnailUrls, pollTitle || undefined);
      
      setPollUrl(url);
      onPollCreated?.(url);
    } catch (error) {
      console.error('Failed to create poll:', error);
      alert('Failed to create poll. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!pollUrl) return;
    
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sharePoll = async () => {
    if (!pollUrl) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: pollTitle || 'Thumbnail Comparison Poll',
          text: 'Help me choose the best thumbnail for my video!',
          url: pollUrl
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  if (pollUrl) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Poll Created Successfully!
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Share this link with your audience to get their votes on which thumbnail works best.
          </p>

          {/* Poll URL */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Link className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Poll URL
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pollUrl}
                readOnly
                className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-sm font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Poll Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {analyses.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Thumbnails
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {expirationDays}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Days Active
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
              <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                Live
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Status
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={sharePoll}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share Poll
            </button>
            
            <button
              onClick={() => window.open(pollUrl, '_blank')}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Eye className="w-5 h-5" />
              View Poll
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
              How to use your poll:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 text-left">
              <li>• Share the link on social media, in your community, or with friends</li>
              <li>• Voters can see all thumbnails and vote for their favorite</li>
              <li>• Results are updated in real-time</li>
              <li>• Poll expires after {expirationDays} days</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Share2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Create Thumbnail Poll
        </h2>
      </div>

      <div className="space-y-6">
        {/* Poll Title */}
        <div>
          <label htmlFor="pollTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Poll Title (Optional)
          </label>
          <input
            type="text"
            id="pollTitle"
            value={pollTitle}
            onChange={(e) => setPollTitle(e.target.value)}
            placeholder="e.g., Which thumbnail works best for my new video?"
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Expiration */}
        <div>
          <label htmlFor="expiration" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Poll Duration
          </label>
          <select
            id="expiration"
            value={expirationDays}
            onChange={(e) => setExpirationDays(Number(e.target.value))}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value={1}>1 Day</option>
            <option value={3}>3 Days</option>
            <option value={7}>1 Week</option>
            <option value={14}>2 Weeks</option>
            <option value={30}>1 Month</option>
          </select>
        </div>

        {/* Thumbnail Preview */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Thumbnails in Poll ({analyses.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {analyses.map((analysis, index) => (
              <div key={analysis.id} className="relative">
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                  <img
                    src={analysis.imageUrl}
                    alt={analysis.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-1 left-1 bg-purple-600 text-white text-xs font-bold px-1 py-0.5 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Poll Features */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <h3 className="font-medium text-slate-900 dark:text-white mb-3">
            Poll Features
          </h3>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Anonymous voting - no registration required
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Real-time results and statistics
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Mobile-friendly voting interface
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Shareable link for easy distribution
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Automatic expiration after {expirationDays} days
            </li>
          </ul>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreatePoll}
          disabled={isCreating || analyses.length < 2}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
            isCreating || analyses.length < 2
              ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          )}
        >
          {isCreating ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Creating Poll...
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5" />
              Create Poll
            </>
          )}
        </button>

        {analyses.length < 2 && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            You need at least 2 thumbnails to create a poll
          </p>
        )}
      </div>
    </div>
  );
}
