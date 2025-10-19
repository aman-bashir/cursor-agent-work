'use client';

import { useState } from 'react';
import { 
  User, 
  MoreHorizontal, 
  ThumbsUp, 
  MessageCircle, 
  Share, 
  Send,
  Heart,
  Eye
} from 'lucide-react';

interface LinkedInPreviewProps {
  content: string;
  authorName?: string;
  authorTitle?: string;
  authorCompany?: string;
  showEngagement?: boolean;
}

export default function LinkedInPreview({ 
  content, 
  authorName = "Your Name",
  authorTitle = "Your Title",
  authorCompany = "Your Company",
  showEngagement = true
}: LinkedInPreviewProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
  const [comments, setComments] = useState(Math.floor(Math.random() * 20) + 5);
  const [shares, setShares] = useState(Math.floor(Math.random() * 10) + 2);
  const [views, setViews] = useState(Math.floor(Math.random() * 500) + 100);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  // Truncate content for preview (first 3 lines)
  const previewContent = content.split('\n').slice(0, 3).join('\n');
  const isLongPost = content.split('\n').length > 3 || content.length > 200;
  const remainingLines = content.split('\n').length - 3;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          LinkedIn Preview
        </h2>
      </div>

      {/* LinkedIn Post Mockup */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {authorName}
              </h3>
              <span className="text-slate-500 dark:text-slate-400">•</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {authorTitle}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {authorCompany}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              2h • <span className="text-blue-600 dark:text-blue-400">🌐</span>
            </p>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <div className="text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed">
            {previewContent}
            {isLongPost && (
              <span className="text-blue-600 dark:text-blue-400 cursor-pointer">
                ...see more
              </span>
            )}
          </div>
        </div>

        {/* Engagement Stats */}
        {showEngagement && (
          <>
            <div className="flex items-center gap-4 py-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <ThumbsUp className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                </div>
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{comments} comments</span>
                <span>{shares} shares</span>
                <span>{views} views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  liked 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                Like
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5" />
                Comment
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Share className="w-5 h-5" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </>
        )}
      </div>

      {/* Preview Info */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Preview Notes
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• This shows how your post will appear on LinkedIn</li>
          <li>• First 3 lines are most important for engagement</li>
          <li>• Use line breaks to control what's visible in preview</li>
          <li>• Mobile users see even less text initially</li>
        </ul>
      </div>

      {/* Mobile Preview */}
      <div className="mt-6">
        <h4 className="font-medium text-slate-900 dark:text-white mb-3">Mobile Preview</h4>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 max-w-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3">
            {/* Mobile Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {authorName}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {authorTitle} • {authorCompany}
                </div>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed">
              {content.split('\n').slice(0, 2).join('\n')}
              {content.split('\n').length > 2 && (
                <span className="text-blue-600 dark:text-blue-400">...see more</span>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs">{likes}</span>
              </button>
              <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{comments}</span>
              </button>
              <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Share className="w-4 h-4" />
                <span className="text-xs">{shares}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
