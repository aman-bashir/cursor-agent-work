export interface FormatOptions {
  addLineBreaks: boolean;
  addEmojis: boolean;
  addHashtags: boolean;
  optimizeSpacing: boolean;
  formatStyle: 'story' | 'list' | 'hook-body-cta';
}

export interface EmojiSuggestion {
  emoji: string;
  position: number;
  reason: string;
}

export interface HashtagSuggestion {
  hashtag: string;
  popularity: 'high' | 'medium' | 'low';
  relevance: number;
}

export function formatLinkedInPost(
  text: string,
  options: FormatOptions = {
    addLineBreaks: true,
    addEmojis: false,
    addHashtags: false,
    optimizeSpacing: true,
    formatStyle: 'story'
  }
): string {
  let formatted = text;

  if (options.optimizeSpacing) {
    formatted = optimizeSpacing(formatted);
  }

  if (options.addLineBreaks) {
    formatted = addLineBreaks(formatted, options.formatStyle);
  }

  if (options.addEmojis) {
    const emojiSuggestions = suggestEmojis(formatted);
    formatted = insertEmojis(formatted, emojiSuggestions);
  }

  if (options.addHashtags) {
    const hashtagSuggestions = suggestHashtags(formatted);
    formatted = addHashtags(formatted, hashtagSuggestions);
  }

  return formatted;
}

export function addLineBreaks(text: string, style: 'story' | 'list' | 'hook-body-cta' = 'story'): string {
  let formatted = text;

  // Remove existing double line breaks to avoid triple breaks
  formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');

  // Add line breaks after sentences for better readability
  if (style === 'story') {
    // Add breaks after periods, exclamation marks, and question marks
    formatted = formatted.replace(/([.!?])\s+/g, '$1\n\n');
  } else if (style === 'list') {
    // For list posts, ensure proper spacing between list items
    formatted = formatted.replace(/(\d+\.\s+[^\n]+)/g, '$1\n\n');
  } else if (style === 'hook-body-cta') {
    // For hook-body-cta, add strategic breaks
    const lines = formatted.split('\n');
    if (lines.length >= 3) {
      // Add break after first 2-3 lines (hook)
      lines[2] = lines[2] + '\n\n';
      // Add break before last 1-2 lines (CTA)
      if (lines.length > 4) {
        lines[lines.length - 2] = '\n\n' + lines[lines.length - 2];
      }
      formatted = lines.join('\n');
    }
  }

  // Clean up multiple line breaks
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  return formatted.trim();
}

export function optimizeSpacing(text: string): string {
  // Remove extra spaces
  let optimized = text.replace(/\s+/g, ' ');
  
  // Ensure proper spacing around punctuation
  optimized = optimized.replace(/\s*([.!?,:;])\s*/g, '$1 ');
  
  // Fix spacing around parentheses and quotes
  optimized = optimized.replace(/\s*([()"''])\s*/g, '$1');
  
  // Ensure space after periods (except abbreviations)
  optimized = optimized.replace(/\.([A-Z])/g, '. $1');
  
  return optimized.trim();
}

export function suggestEmojis(text: string): EmojiSuggestion[] {
  const suggestions: EmojiSuggestion[] = [];
  const lowerText = text.toLowerCase();

  // Business/Professional emojis
  if (lowerText.includes('success') || lowerText.includes('achievement')) {
    suggestions.push({ emoji: '🎉', position: 0, reason: 'Celebrates success' });
  }
  if (lowerText.includes('tip') || lowerText.includes('advice')) {
    suggestions.push({ emoji: '💡', position: 0, reason: 'Highlights tip' });
  }
  if (lowerText.includes('learn') || lowerText.includes('lesson')) {
    suggestions.push({ emoji: '📚', position: 0, reason: 'Indicates learning' });
  }
  if (lowerText.includes('team') || lowerText.includes('collaboration')) {
    suggestions.push({ emoji: '👥', position: 0, reason: 'Represents teamwork' });
  }
  if (lowerText.includes('growth') || lowerText.includes('improve')) {
    suggestions.push({ emoji: '📈', position: 0, reason: 'Shows growth' });
  }
  if (lowerText.includes('challenge') || lowerText.includes('difficult')) {
    suggestions.push({ emoji: '💪', position: 0, reason: 'Represents strength' });
  }
  if (lowerText.includes('innovation') || lowerText.includes('creative')) {
    suggestions.push({ emoji: '🚀', position: 0, reason: 'Shows innovation' });
  }
  if (lowerText.includes('time') || lowerText.includes('schedule')) {
    suggestions.push({ emoji: '⏰', position: 0, reason: 'Represents time' });
  }
  if (lowerText.includes('money') || lowerText.includes('revenue') || lowerText.includes('profit')) {
    suggestions.push({ emoji: '💰', position: 0, reason: 'Represents money' });
  }
  if (lowerText.includes('goal') || lowerText.includes('target')) {
    suggestions.push({ emoji: '🎯', position: 0, reason: 'Shows targeting' });
  }

  // Engagement emojis
  if (lowerText.includes('question') || lowerText.includes('?')) {
    suggestions.push({ emoji: '❓', position: text.length, reason: 'Encourages questions' });
  }
  if (lowerText.includes('share') || lowerText.includes('comment')) {
    suggestions.push({ emoji: '💬', position: text.length, reason: 'Encourages engagement' });
  }

  // Limit to 3 suggestions
  return suggestions.slice(0, 3);
}

export function insertEmojis(text: string, suggestions: EmojiSuggestion[]): string {
  let result = text;
  
  // Sort by position (descending) to avoid index shifting
  const sortedSuggestions = suggestions.sort((a, b) => b.position - a.position);
  
  for (const suggestion of sortedSuggestions) {
    if (suggestion.position === 0) {
      // Add at beginning
      result = suggestion.emoji + ' ' + result;
    } else if (suggestion.position >= result.length) {
      // Add at end
      result = result + ' ' + suggestion.emoji;
    } else {
      // Insert at position
      result = result.slice(0, suggestion.position) + ' ' + suggestion.emoji + ' ' + result.slice(suggestion.position);
    }
  }
  
  return result;
}

export function suggestHashtags(text: string): HashtagSuggestion[] {
  const suggestions: HashtagSuggestion[] = [];
  const lowerText = text.toLowerCase();

  // Extract keywords and suggest relevant hashtags
  const keywordHashtags: { [key: string]: HashtagSuggestion } = {
    'leadership': { hashtag: '#Leadership', popularity: 'high', relevance: 0.9 },
    'business': { hashtag: '#Business', popularity: 'high', relevance: 0.9 },
    'entrepreneur': { hashtag: '#Entrepreneurship', popularity: 'high', relevance: 0.9 },
    'startup': { hashtag: '#Startup', popularity: 'high', relevance: 0.9 },
    'marketing': { hashtag: '#Marketing', popularity: 'high', relevance: 0.9 },
    'sales': { hashtag: '#Sales', popularity: 'high', relevance: 0.9 },
    'productivity': { hashtag: '#Productivity', popularity: 'medium', relevance: 0.8 },
    'career': { hashtag: '#Career', popularity: 'high', relevance: 0.9 },
    'networking': { hashtag: '#Networking', popularity: 'medium', relevance: 0.8 },
    'innovation': { hashtag: '#Innovation', popularity: 'medium', relevance: 0.8 },
    'technology': { hashtag: '#Technology', popularity: 'high', relevance: 0.9 },
    'remote': { hashtag: '#RemoteWork', popularity: 'high', relevance: 0.9 },
    'team': { hashtag: '#TeamBuilding', popularity: 'medium', relevance: 0.8 },
    'growth': { hashtag: '#Growth', popularity: 'medium', relevance: 0.8 },
    'success': { hashtag: '#Success', popularity: 'high', relevance: 0.9 },
    'motivation': { hashtag: '#Motivation', popularity: 'medium', relevance: 0.8 },
    'learning': { hashtag: '#Learning', popularity: 'medium', relevance: 0.8 },
    'tips': { hashtag: '#Tips', popularity: 'medium', relevance: 0.8 },
    'advice': { hashtag: '#Advice', popularity: 'medium', relevance: 0.8 },
    'experience': { hashtag: '#Experience', popularity: 'medium', relevance: 0.8 }
  };

  // Find relevant hashtags based on keywords
  for (const [keyword, hashtag] of Object.entries(keywordHashtags)) {
    if (lowerText.includes(keyword)) {
      suggestions.push(hashtag);
    }
  }

  // Add some general high-performing hashtags if we don't have enough
  const generalHashtags = [
    { hashtag: '#LinkedIn', popularity: 'high' as const, relevance: 0.7 },
    { hashtag: '#Professional', popularity: 'medium' as const, relevance: 0.6 },
    { hashtag: '#Work', popularity: 'high' as const, relevance: 0.6 }
  ];

  // If we have less than 3 hashtags, add some general ones
  if (suggestions.length < 3) {
    for (const hashtag of generalHashtags) {
      if (suggestions.length >= 5) break;
      if (!suggestions.some(s => s.hashtag === hashtag.hashtag)) {
        suggestions.push(hashtag);
      }
    }
  }

  // Sort by relevance and return top 5
  return suggestions
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);
}

export function addHashtags(text: string, suggestions: HashtagSuggestion[]): string {
  if (suggestions.length === 0) return text;

  const hashtags = suggestions.map(s => s.hashtag).join(' ');
  return text + '\n\n' + hashtags;
}

export function getCharacterCount(text: string): number {
  return text.length;
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = getWordCount(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

export function getLineCount(text: string): number {
  return text.split('\n').length;
}

export function getParagraphCount(text: string): number {
  return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
}

export function validateLinkedInPost(text: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check character limit
  if (text.length > 3000) {
    errors.push('Post exceeds LinkedIn\'s 3000 character limit');
  }

  // Check minimum length
  if (text.length < 50) {
    warnings.push('Post is very short - consider adding more detail');
  }

  // Check for hashtags
  const hashtagCount = (text.match(/#\w+/g) || []).length;
  if (hashtagCount === 0) {
    warnings.push('No hashtags found - consider adding 3-5 relevant hashtags');
  } else if (hashtagCount > 10) {
    warnings.push('Too many hashtags - LinkedIn recommends 3-5 hashtags');
  }

  // Check for line breaks
  if (!text.includes('\n')) {
    warnings.push('Consider adding line breaks for better readability');
  }

  // Check for questions
  if (!text.includes('?')) {
    warnings.push('No questions found - questions can boost engagement');
  }

  // Check for call-to-action
  const ctaWords = ['comment', 'share', 'like', 'follow', 'click', 'visit', 'check out'];
  const hasCTA = ctaWords.some(word => text.toLowerCase().includes(word));
  if (!hasCTA) {
    warnings.push('No clear call-to-action found');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function formatForMobile(text: string): string {
  // Ensure proper line breaks for mobile viewing
  let formatted = text;
  
  // Add line breaks after sentences for mobile readability
  formatted = formatted.replace(/([.!?])\s+/g, '$1\n\n');
  
  // Ensure paragraphs aren't too long for mobile
  const paragraphs = formatted.split('\n\n');
  const mobileParagraphs = paragraphs.map(paragraph => {
    if (paragraph.length > 200) {
      // Split long paragraphs at natural break points
      const sentences = paragraph.split(/([.!?])\s+/);
      let result = '';
      let currentLength = 0;
      
      for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i] + (sentences[i + 1] || '');
        if (currentLength + sentence.length > 200 && result.length > 0) {
          result += '\n\n';
          currentLength = 0;
        }
        result += sentence;
        currentLength += sentence.length;
      }
      
      return result;
    }
    return paragraph;
  });
  
  return mobileParagraphs.join('\n\n');
}
