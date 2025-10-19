import { natural } from 'natural';

export interface AnalysisResult {
  score: number;
  breakdown: {
    hookStrength: number;
    length: number;
    readability: number;
    emojiUsage: number;
    hashtagUsage: number;
    ctaPresence: number;
    questionPresence: number;
    personalStory: number;
  };
  suggestions: string[];
  strengths: string[];
  improvements: string[];
}

export interface HookAnalysis {
  score: number;
  issues: string[];
  strengths: string[];
}

export function analyzeEngagement(post: string): AnalysisResult {
  const breakdown = {
    hookStrength: analyzeHook(post),
    length: analyzeLength(post),
    readability: analyzeReadability(post),
    emojiUsage: analyzeEmojis(post),
    hashtagUsage: analyzeHashtags(post),
    ctaPresence: hasCTA(post) ? 100 : 0,
    questionPresence: hasQuestion(post) ? 100 : 0,
    personalStory: hasPersonalStory(post) ? 100 : 0
  };

  const score = calculateOverallScore(breakdown);
  const suggestions = generateSuggestions(post, breakdown);
  const strengths = identifyStrengths(breakdown);
  const improvements = identifyImprovements(breakdown);

  return {
    score,
    breakdown,
    suggestions,
    strengths,
    improvements
  };
}

function analyzeHook(post: string): number {
  const firstLines = post.split('\n').slice(0, 3).join('\n');
  let score = 0;

  // Check for numbers (specificity)
  if (/\d+/.test(firstLines)) score += 20;
  
  // Check for questions (engagement)
  if (/\?/.test(firstLines)) score += 15;
  
  // Check for bold claims or controversy
  const boldWords = ['never', 'always', 'everyone', 'nobody', 'secret', 'mistake', 'failed', 'wrong'];
  if (boldWords.some(word => firstLines.toLowerCase().includes(word))) score += 20;
  
  // Check length (optimal: 50-150 characters)
  if (firstLines.length >= 50 && firstLines.length <= 150) score += 25;
  else if (firstLines.length >= 30 && firstLines.length <= 200) score += 15;
  
  // Check for emotional words
  const emotionalWords = ['amazing', 'incredible', 'shocking', 'surprising', 'unbelievable'];
  if (emotionalWords.some(word => firstLines.toLowerCase().includes(word))) score += 10;
  
  // Check for personal pronouns (connection)
  if (/I|my|me/.test(firstLines)) score += 10;

  return Math.min(score, 100);
}

function analyzeLength(post: string): number {
  const length = post.length;
  
  // LinkedIn sweet spot: 1300-1900 characters
  if (length >= 1300 && length <= 1900) return 100;
  if (length >= 1000 && length <= 2200) return 80;
  if (length >= 500 && length <= 3000) return 60;
  if (length >= 200 && length <= 4000) return 40;
  return 20;
}

function analyzeReadability(post: string): number {
  const sentences = post.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = post.split(/\s+/).filter(w => w.length > 0);
  const paragraphs = post.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  let score = 0;
  
  // Average sentence length (optimal: 15-20 words)
  const avgSentenceLength = words.length / sentences.length;
  if (avgSentenceLength >= 15 && avgSentenceLength <= 20) score += 30;
  else if (avgSentenceLength >= 10 && avgSentenceLength <= 25) score += 20;
  
  // Paragraph count (optimal: 3-8)
  if (paragraphs.length >= 3 && paragraphs.length <= 8) score += 30;
  else if (paragraphs.length >= 2 && paragraphs.length <= 10) score += 20;
  
  // Whitespace usage (easy to scan)
  const whitespaceRatio = (post.match(/\s/g) || []).length / post.length;
  if (whitespaceRatio >= 0.15 && whitespaceRatio <= 0.25) score += 20;
  else if (whitespaceRatio >= 0.10 && whitespaceRatio <= 0.30) score += 10;
  
  // Short paragraphs (mobile-friendly)
  const avgParagraphLength = words.length / paragraphs.length;
  if (avgParagraphLength <= 100) score += 20;
  else if (avgParagraphLength <= 150) score += 10;

  return Math.min(score, 100);
}

function analyzeEmojis(post: string): number {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojiCount = (post.match(emojiRegex) || []).length;
  
  // Optimal: 1-3 emojis
  if (emojiCount >= 1 && emojiCount <= 3) return 100;
  if (emojiCount === 0) return 50;
  if (emojiCount <= 5) return 70;
  return 30; // Too many emojis
}

function analyzeHashtags(post: string): number {
  const hashtagCount = (post.match(/#\w+/g) || []).length;
  
  // Optimal: 3-5 hashtags
  if (hashtagCount >= 3 && hashtagCount <= 5) return 100;
  if (hashtagCount >= 1 && hashtagCount <= 7) return 70;
  if (hashtagCount === 0) return 30;
  return 50; // Too many hashtags
}

function hasCTA(post: string): boolean {
  const ctaWords = [
    'comment', 'share', 'like', 'follow', 'subscribe', 'download', 'click', 'visit',
    'check out', 'learn more', 'find out', 'discover', 'try', 'start', 'join',
    'sign up', 'register', 'get', 'grab', 'claim', 'book', 'schedule', 'contact'
  ];
  
  const lowerPost = post.toLowerCase();
  return ctaWords.some(word => lowerPost.includes(word));
}

function hasQuestion(post: string): boolean {
  return /\?/.test(post);
}

function hasPersonalStory(post: string): boolean {
  const personalWords = [
    'I', 'my', 'me', 'personally', 'experience', 'story', 'happened', 'learned',
    'realized', 'discovered', 'found out', 'turned out', 'ended up'
  ];
  
  const lowerPost = post.toLowerCase();
  const personalWordCount = personalWords.filter(word => lowerPost.includes(word)).length;
  
  return personalWordCount >= 3;
}

function calculateOverallScore(breakdown: AnalysisResult['breakdown']): number {
  const weights = {
    hookStrength: 0.25,
    length: 0.20,
    readability: 0.15,
    emojiUsage: 0.10,
    hashtagUsage: 0.05,
    ctaPresence: 0.10,
    questionPresence: 0.10,
    personalStory: 0.05
  };

  let weightedScore = 0;
  for (const [key, value] of Object.entries(breakdown)) {
    weightedScore += value * weights[key as keyof typeof weights];
  }

  return Math.round(weightedScore);
}

function generateSuggestions(post: string, breakdown: AnalysisResult['breakdown']): string[] {
  const suggestions: string[] = [];

  if (breakdown.hookStrength < 70) {
    suggestions.push('Strengthen your opening - add numbers, questions, or bold statements');
  }

  if (breakdown.length < 60) {
    if (post.length < 1000) {
      suggestions.push('Consider adding more detail or examples to reach the optimal length');
    } else {
      suggestions.push('Your post might be too long - consider breaking it into multiple posts');
    }
  }

  if (breakdown.readability < 70) {
    suggestions.push('Improve readability - use shorter sentences and more paragraph breaks');
  }

  if (breakdown.emojiUsage < 50) {
    suggestions.push('Add 1-3 relevant emojis to increase engagement');
  }

  if (breakdown.hashtagUsage < 70) {
    if (breakdown.hashtagUsage === 0) {
      suggestions.push('Add 3-5 relevant hashtags to increase discoverability');
    } else {
      suggestions.push('Optimize hashtag count - aim for 3-5 hashtags');
    }
  }

  if (breakdown.ctaPresence === 0) {
    suggestions.push('Add a call-to-action to encourage engagement');
  }

  if (breakdown.questionPresence === 0) {
    suggestions.push('Ask a question to boost comments and engagement');
  }

  if (breakdown.personalStory === 0) {
    suggestions.push('Add personal elements to make your post more relatable');
  }

  return suggestions;
}

function identifyStrengths(breakdown: AnalysisResult['breakdown']): string[] {
  const strengths: string[] = [];

  if (breakdown.hookStrength >= 80) {
    strengths.push('Strong opening that grabs attention');
  }

  if (breakdown.length >= 80) {
    strengths.push('Optimal post length for engagement');
  }

  if (breakdown.readability >= 80) {
    strengths.push('Easy to read and scan');
  }

  if (breakdown.emojiUsage >= 80) {
    strengths.push('Good emoji usage');
  }

  if (breakdown.hashtagUsage >= 80) {
    strengths.push('Well-optimized hashtags');
  }

  if (breakdown.ctaPresence === 100) {
    strengths.push('Clear call-to-action');
  }

  if (breakdown.questionPresence === 100) {
    strengths.push('Engaging question included');
  }

  if (breakdown.personalStory === 100) {
    strengths.push('Personal elements make it relatable');
  }

  return strengths;
}

function identifyImprovements(breakdown: AnalysisResult['breakdown']): string[] {
  const improvements: string[] = [];

  if (breakdown.hookStrength < 60) {
    improvements.push('Hook needs work');
  }

  if (breakdown.length < 60) {
    improvements.push('Length optimization needed');
  }

  if (breakdown.readability < 60) {
    improvements.push('Readability could be better');
  }

  if (breakdown.emojiUsage < 50) {
    improvements.push('Consider adding emojis');
  }

  if (breakdown.hashtagUsage < 50) {
    improvements.push('Hashtag strategy needs improvement');
  }

  if (breakdown.ctaPresence === 0) {
    improvements.push('Missing call-to-action');
  }

  if (breakdown.questionPresence === 0) {
    improvements.push('No questions to drive engagement');
  }

  if (breakdown.personalStory === 0) {
    improvements.push('Could use more personal elements');
  }

  return improvements;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
  if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
  return 'bg-red-100 dark:bg-red-900/20';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Great';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
}
