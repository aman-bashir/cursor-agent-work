'use client';

import { useState } from 'react';
import { 
  Grid, 
  List, 
  Download, 
  Share2, 
  BarChart3,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Moon,
  Sun
} from 'lucide-react';
import { ThumbnailAnalysis } from '../lib/types';
import { cn } from '../lib/utils';
import ThumbnailCard from './ThumbnailCard';

interface ComparisonGridProps {
  analyses: ThumbnailAnalysis[];
  onDownloadComparison?: () => void;
  onCreatePoll?: () => void;
}

type ViewMode = 'grid' | 'list';
type PreviewMode = 'desktop' | 'mobile' | 'dark';

export default function ComparisonGrid({ 
  analyses, 
  onDownloadComparison, 
  onCreatePoll 
}: ComparisonGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Sort analyses by CTR score
  const sortedAnalyses = [...analyses].sort((a, b) => b.ctrScore - a.ctrScore);

  const handleDownloadComparison = () => {
    // Create a comparison report
    const report = {
      title: 'Thumbnail Comparison Report',
      generatedAt: new Date().toISOString(),
      thumbnails: sortedAnalyses.map((analysis, index) => ({
        rank: index + 1,
        fileName: analysis.fileName,
        ctrScore: analysis.ctrScore,
        resolution: analysis.resolution,
        fileSize: analysis.fileSize,
        strengths: analysis.strengths,
        issues: analysis.technicalIssues,
        suggestions: analysis.suggestions
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thumbnail-comparison-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPreviewModeIcon = (mode: PreviewMode) => {
    switch (mode) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'dark': return Moon;
      default: return Monitor;
    }
  };

  const getPreviewModeLabel = (mode: PreviewMode) => {
    switch (mode) {
      case 'desktop': return 'Desktop';
      case 'mobile': return 'Mobile';
      case 'dark': return 'Dark Mode';
      default: return 'Desktop';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Thumbnail Comparison
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {analyses.length} thumbnail{analyses.length !== 1 ? 's' : ''} analyzed
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Preview Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {(['desktop', 'mobile', 'dark'] as PreviewMode[]).map((mode) => {
              const Icon = getPreviewModeIcon(mode);
              return (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    previewMode === mode
                      ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {getPreviewModeLabel(mode)}
                </button>
              );
            })}
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                viewMode === 'grid'
                  ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Grid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                viewMode === 'list'
                  ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(sortedAnalyses.reduce((sum, a) => sum + a.ctrScore, 0) / sortedAnalyses.length)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Average CTR Score
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {sortedAnalyses.filter(a => a.hasFace).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                With Faces
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {sortedAnalyses.filter(a => a.hasText).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                With Text
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {sortedAnalyses.filter(a => a.ctrScore >= 80).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                High Score (80+)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails Display */}
      <div className={cn(
        "space-y-4",
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
      )}>
        {sortedAnalyses.map((analysis, index) => (
          <ThumbnailCard
            key={analysis.id}
            analysis={analysis}
            rank={index + 1}
            showDetails={showDetails}
            onToggleDetails={() => setShowDetails(!showDetails)}
            onDownload={() => {
              const a = document.createElement('a');
              a.href = analysis.imageUrl;
              a.download = analysis.fileName;
              a.click();
            }}
            onShare={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Check out this thumbnail',
                  text: `CTR Score: ${analysis.ctrScore}/100`,
                  url: analysis.imageUrl
                });
              } else {
                navigator.clipboard.writeText(analysis.imageUrl);
              }
            }}
            isSelected={selectedThumbnail === analysis.id}
            onSelect={() => setSelectedThumbnail(
              selectedThumbnail === analysis.id ? null : analysis.id
            )}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {onCreatePoll && (
            <button
              onClick={onCreatePoll}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Create Poll
            </button>
          )}
          
          <button
            onClick={handleDownloadComparison}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Preview Mode Info */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          {(() => {
            const Icon = getPreviewModeIcon(previewMode);
            return <Icon className="w-5 h-5 text-purple-600" />;
          })()}
          <h3 className="font-medium text-slate-900 dark:text-white">
            {getPreviewModeLabel(previewMode)} Preview Mode
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {previewMode === 'desktop' && 'Viewing thumbnails as they would appear on desktop YouTube.'}
          {previewMode === 'mobile' && 'Viewing thumbnails as they would appear on mobile YouTube app.'}
          {previewMode === 'dark' && 'Viewing thumbnails in YouTube dark mode for better contrast analysis.'}
        </p>
      </div>
    </div>
  );
}
