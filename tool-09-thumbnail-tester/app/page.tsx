'use client';

import { useState, useCallback } from 'react';
import { 
  Play, 
  Upload, 
  BarChart3, 
  Share2, 
  Download,
  Eye,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ThumbnailAnalysis } from '../lib/types';
import { analyzeThumbnail } from '../lib/imageAnalysis';
import { cn } from '../lib/utils';
import ThumbnailUploader from '../components/ThumbnailUploader';
import ComparisonGrid from '../components/ComparisonGrid';
import PollCreator from '../components/PollCreator';

type TabType = 'upload' | 'compare' | 'poll';

export default function ThumbnailTesterPage() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analyses, setAnalyses] = useState<ThumbnailAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleFilesUploaded = useCallback(async (files: File[]) => {
    setUploadedFiles(files);
    
    if (files.length > 0) {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      
      const newAnalyses: ThumbnailAnalysis[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        
        try {
          const analysis = await analyzeThumbnail(file, imageUrl);
          newAnalyses.push(analysis);
        } catch (error) {
          console.error('Failed to analyze thumbnail:', error);
        }
        
        setAnalysisProgress(((i + 1) / files.length) * 100);
      }
      
      setAnalyses(newAnalyses);
      setIsAnalyzing(false);
      
      // Auto-switch to compare tab if we have analyses
      if (newAnalyses.length > 0) {
        setActiveTab('compare');
      }
    }
  }, []);

  const handleCreatePoll = () => {
    setActiveTab('poll');
  };

  const tabs = [
    { id: 'upload', label: 'Upload Thumbnails', icon: Upload },
    { id: 'compare', label: 'Compare & Analyze', icon: BarChart3 },
    { id: 'poll', label: 'Create Poll', icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Play className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                YouTube Thumbnail Tester
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Test, compare, and optimize your YouTube thumbnails for maximum CTR
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="animate-spin w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full"></div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Analyzing Thumbnails...
              </h3>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
              <div
                className="h-3 bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {Math.round(analysisProgress)}% complete - Analyzing {uploadedFiles.length} thumbnail{uploadedFiles.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'upload' && (
            <div className="space-y-8">
              <ThumbnailUploader
                onThumbnailsUploaded={handleFilesUploaded}
                maxFiles={6}
              />

              {/* Features Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      CTR Analysis
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Get detailed CTR scores based on face detection, text readability, color vibrancy, and more.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Preview Modes
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    See how your thumbnails look on desktop, mobile, and in dark mode.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Share2 className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Audience Polls
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Create shareable polls to get real audience feedback on your thumbnails.
                  </p>
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  YouTube Thumbnail Best Practices
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                      ✅ Do This
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Use 1280x720 resolution (16:9 aspect ratio)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Include a large, expressive face
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Use high contrast colors
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Keep text large and readable
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Make it work on mobile (small screens)
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                      ❌ Avoid This
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Too much text or small fonts
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Low resolution or blurry images
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Cluttered or busy backgrounds
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Misleading or clickbait content
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        Inconsistent branding
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div>
              {analyses.length > 0 ? (
                <ComparisonGrid
                  analyses={analyses}
                  onCreatePoll={handleCreatePoll}
                />
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No Thumbnails to Compare
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Upload some thumbnails first to see the comparison and analysis.
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Upload Thumbnails
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'poll' && (
            <div>
              {analyses.length >= 2 ? (
                <PollCreator
                  analyses={analyses}
                  onPollCreated={(pollUrl) => {
                    console.log('Poll created:', pollUrl);
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <Share2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Need More Thumbnails
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    You need at least 2 thumbnails to create a poll. Upload more thumbnails to get started.
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Upload Thumbnails
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {analyses.length > 0 && (
          <div className="mt-16 grid md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(analyses.reduce((sum, a) => sum + a.ctrScore, 0) / analyses.length)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Average CTR Score
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {analyses.filter(a => a.hasFace).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                With Faces
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
              <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {analyses.filter(a => a.hasText).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                With Text
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
              <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {analyses.filter(a => a.ctrScore >= 80).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                High Score (80+)
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>Powered by advanced image analysis and CTR prediction algorithms</p>
        </div>
      </div>
    </div>
  );
}