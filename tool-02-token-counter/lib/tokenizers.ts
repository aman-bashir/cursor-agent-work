import { encode } from 'gpt-tokenizer';

export interface TokenCount {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  characters: number;
  words: number;
  lines: number;
}

export interface TokenizerResult {
  tokens: number;
  characters: number;
  words: number;
  lines: number;
}

// GPT tokenizer (works for GPT-3.5, GPT-4, etc.)
export function countGPTTokens(text: string): TokenizerResult {
  try {
    const tokens = encode(text).length;
    const characters = text.length;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lines = text.split('\n').length;

    return {
      tokens,
      characters,
      words,
      lines
    };
  } catch (error) {
    console.error('Error counting GPT tokens:', error);
    // Fallback to character-based estimation
    return {
      tokens: Math.ceil(text.length / 4), // Rough estimate: 4 chars per token
      characters: text.length,
      words: text.trim().split(/\s+/).filter(word => word.length > 0).length,
      lines: text.split('\n').length
    };
  }
}

// Claude tokenizer (approximation)
export function countClaudeTokens(text: string): TokenizerResult {
  // Claude uses a different tokenizer, but we'll approximate
  // Claude tokens are roughly 1.2x GPT tokens
  const gptResult = countGPTTokens(text);
  return {
    ...gptResult,
    tokens: Math.ceil(gptResult.tokens * 1.2)
  };
}

// Gemini tokenizer (approximation)
export function countGeminiTokens(text: string): TokenizerResult {
  // Gemini uses SentencePiece, roughly similar to GPT
  const gptResult = countGPTTokens(text);
  return {
    ...gptResult,
    tokens: Math.ceil(gptResult.tokens * 0.95) // Slightly more efficient
  };
}

export function countTokensForModel(text: string, modelName: string): TokenizerResult {
  const lowerModelName = modelName.toLowerCase();
  
  if (lowerModelName.includes('gpt')) {
    return countGPTTokens(text);
  } else if (lowerModelName.includes('claude')) {
    return countClaudeTokens(text);
  } else if (lowerModelName.includes('gemini')) {
    return countGeminiTokens(text);
  } else {
    // Default to GPT tokenizer
    return countGPTTokens(text);
  }
}

export function calculateTokenCount(
  inputText: string,
  outputText: string = '',
  modelName: string = 'GPT-4'
): TokenCount {
  const inputResult = countTokensForModel(inputText, modelName);
  const outputResult = countTokensForModel(outputText, modelName);
  
  return {
    inputTokens: inputResult.tokens,
    outputTokens: outputResult.tokens,
    totalTokens: inputResult.tokens + outputResult.tokens,
    characters: inputResult.characters + outputResult.characters,
    words: inputResult.words + outputResult.words,
    lines: inputResult.lines + outputResult.lines
  };
}

// Utility function to estimate tokens from characters
export function estimateTokensFromCharacters(characters: number, modelName: string = 'GPT-4'): number {
  const lowerModelName = modelName.toLowerCase();
  
  if (lowerModelName.includes('gpt')) {
    return Math.ceil(characters / 4); // ~4 chars per token
  } else if (lowerModelName.includes('claude')) {
    return Math.ceil(characters / 3.3); // ~3.3 chars per token
  } else if (lowerModelName.includes('gemini')) {
    return Math.ceil(characters / 4.2); // ~4.2 chars per token
  } else {
    return Math.ceil(characters / 4); // Default
  }
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}

// Format currency
export function formatCurrency(amount: number): string {
  if (amount < 0.001) {
    return `$${(amount * 1000).toFixed(3)}m`; // Show in millicents
  } else if (amount < 1) {
    return `$${(amount * 100).toFixed(2)}¢`; // Show in cents
  } else {
    return `$${amount.toFixed(4)}`;
  }
}