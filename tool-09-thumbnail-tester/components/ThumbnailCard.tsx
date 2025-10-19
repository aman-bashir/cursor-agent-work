'use client';

import { useState } from 'react';
import { 
  Star, 
  Eye, 
  EyeOff, 
  Download, 
  Share2, 
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react';
import { ThumbnailAnalysis } from '../lib/types';
import { cn } from '../lib/utils';

interface ThumbnailCardProps {
  analysis: ThumbnailAnalysis;
  rank?: number;
  showDetails?: boolean;
  onToggleDetails?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  showVoting?: boolean;
  onVote?: () => void;
  voteCount?: number;
  votePercentage?: number;
}

export default function ThumbnailCard({
  analysis,
  rank,
  showDetails = false,
  onToggleDetails,
  onDownload,
  onShare,
  isSelected = false,
  onSelect,
  showVoting = false,
  onVote,
  voteCount = 0,
  votePercentage = 0
}: ThumbnailCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getStars = (score: number) => {
    const stars = Math.round(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < stars 
            ? "text-yellow-400 fill-current" 
            : "text-slate-300 dark:text-slate-600"
        )}
      />
    ));
  };

  return (
    <div
      className={cn(
        "relative border rounded-lg overflow-hidden transition-all duration-200",
        isSelected 
          ? "border-purple-500 shadow-lg ring-2 ring-purple-200 dark:ring-purple-800" 
          : "border-slate-200 dark:border-slate-700 hover:shadow-md"
      )}
    >
      {/* Rank Badge */}
      {rank && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-purple-600 text-white text-sm font-bold px-2 py-1 rounded-full">
            #{rank}
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
          </div>
        )}
        <img
          src={analysis.imageUrl}
          alt={analysis.fileName}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {analysis.fileName}
            </h3>
            {analysis.technicalIssues.length > 0 && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
          </div>
          
          {onSelect && (
            <button
              onClick={onSelect}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                isSelected
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              )}
            >
              {isSelected ? 'Selected' : 'Select'}
            </button>
          )}
        </div>

        {/* CTR Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              CTR Score
            </span>
            <span className={cn(
              "text-lg font-bold",
              getScoreColor(analysis.ctrScore)
            )}>
              {analysis.ctrScore}/100
            </span>
          </div>
          
          {/* Score Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                getScoreBgColor(analysis.ctrScore)
              )}
              style={{ width: `${analysis.ctrScore}%` }}
            />
          </div>
          
          {/* Stars */}
          <div className="flex items-center gap-1">
            {getStars(analysis.ctrScore)}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded">
            <div className="text-xs text-slate-600 dark:text-slate-400">Resolution</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {analysis.resolution.width}×{analysis.resolution.height}
            </div>
          </div>
          <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded">
            <div className="text-xs text-slate-600 dark:text-slate-400">Size</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {(analysis.fileSize / 1024 / 1024).toFixed(1)}MB
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-2 mb-4">
          {analysis.hasFace && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-700 dark:text-slate-300">
                Face detected ({analysis.faceSize}, {analysis.faceExpression})
              </span>
            </div>
          )}
          
          {analysis.hasText && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-700 dark:text-slate-300">
                Text present ({analysis.textReadability} readability)
              </span>
            </div>
          )}
          
          {analysis.colorVibrancy > 70 && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-700 dark:text-slate-300">
                Vibrant colors
              </span>
            </div>
          )}
        </div>

        {/* Voting Section */}
        {showVoting && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Votes
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {votePercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
              <div
                className="h-2 bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${votePercentage}%` }}
              />
            </div>
            
            <button
              onClick={onVote}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Users className="w-4 h-4" />
              Vote for this thumbnail
            </button>
          </div>
        )}

        {/* Toggle Details */}
        {onToggleDetails && (
          <button
            onClick={onToggleDetails}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {showDetails ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Details
              </>
            )}
          </button>
        )}

        {/* Detailed Analysis */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
            {/* Technical Specs */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                Technical Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Aspect Ratio:</span>
                  <span className="ml-1 text-slate-900 dark:text-white">
                    {analysis.aspectRatio}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Brightness:</span>
                  <span className="ml-1 text-slate-900 dark:text-white">
                    {analysis.brightness}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Contrast:</span>
                  <span className="ml-1 text-slate-900 dark:text-white">
                    {analysis.contrast}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Vibrancy:</span>
                  <span className="ml-1 text-slate-900 dark:text-white">
                    {analysis.colorVibrancy}%
                  </span>
                </div>
              </div>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  Strengths
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Issues */}
            {analysis.technicalIssues.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  Issues
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {analysis.technicalIssues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  Suggestions
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {analysis.suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
