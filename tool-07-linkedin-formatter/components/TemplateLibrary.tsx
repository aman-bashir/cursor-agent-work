'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Search, 
  Filter,
  Star,
  Eye,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import templatesData from '../data/templates.json';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
  example: string;
  bestFor: string;
  engagement: string;
}

export default function TemplateLibrary() {
  const [templates] = useState<Template[]>(templatesData as Template[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  const engagementLevels = ['All', 'Very High', 'High', 'Medium'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyTemplate = async (template: string) => {
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'Very High': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'High': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Storytelling': return '📖';
      case 'Educational': return '🎓';
      case 'Opinion': return '💭';
      case 'Results': return '📊';
      case 'Engagement': return '💬';
      case 'Personal': return '👤';
      case 'Value': return '💎';
      case 'Current Events': return '📰';
      case 'Vulnerability': return '💙';
      case 'Thought Leadership': return '🧠';
      default: return '📝';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Template Library
        </h2>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full p-3 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            {/* Template Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {template.category}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(template.engagement)}`}>
                {template.engagement}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
              {template.description}
            </p>

            {/* Best For */}
            <div className="mb-3">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Best for:</span>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {template.bestFor}
              </p>
            </div>

            {/* Preview */}
            <div className="bg-slate-50 dark:bg-slate-700 rounded p-3 mb-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Preview:</p>
              <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-3">
                {template.template.split('\n')[0]}...
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyTemplate(template.template);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Template'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTemplate(template);
                }}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No templates found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCategoryIcon(selectedTemplate.category)}</span>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedTemplate.category} • {selectedTemplate.engagement} Engagement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            {/* Template Content */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Template */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Template</h3>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                  <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
                    {selectedTemplate.template}
                  </pre>
                </div>
                <button
                  onClick={() => handleCopyTemplate(selectedTemplate.template)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Template'}
                </button>
              </div>

              {/* Example */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Example</h3>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                  <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
                    {selectedTemplate.example}
                  </pre>
                </div>
                <button
                  onClick={() => handleCopyTemplate(selectedTemplate.example)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Example'}
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                Template Details
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-purple-800 dark:text-purple-200">Best for:</span>
                  <p className="text-purple-700 dark:text-purple-300">{selectedTemplate.bestFor}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800 dark:text-purple-200">Engagement Level:</span>
                  <p className="text-purple-700 dark:text-purple-300">{selectedTemplate.engagement}</p>
                </div>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Usage Tips
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Replace bracketed placeholders with your specific content</li>
                <li>• Customize hashtags to match your industry and audience</li>
                <li>• Add personal stories or examples to make it authentic</li>
                <li>• Test different variations to see what resonates with your audience</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {templates.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Templates</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {categories.length - 1}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Categories</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {templates.filter(t => t.engagement === 'Very High').length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">High Engagement</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            100%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Free</div>
        </div>
      </div>
    </div>
  );
}
