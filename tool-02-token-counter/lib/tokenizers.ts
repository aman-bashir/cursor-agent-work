import { encode } from 'gpt-tokenizer';
import { encoding_for_model } from 'tiktoken';

export interface TokenCount {
    input: number;
    output: number;
    total: number;
}

export interface ModelInfo {
    name: string;
    provider: string;
    input: number;
    output: number;
    context: number;
    description: string;
}

export interface ModelComparison {
    model: string;
    modelInfo: ModelInfo;
    cost: number;
    isCheapest: boolean;
}

// Count tokens for different models
export function countTokens(text: string, model: string): number {
    try {
        // For OpenAI models, use tiktoken
        if (model.startsWith('gpt-')) {
            const encoding = encoding_for_model(model as any);
            return encoding.encode(text).length;
        }

        // For Claude models, use gpt-tokenizer (closest approximation)
        if (model.startsWith('claude-')) {
            return encode(text).length;
        }

        // For Gemini models, use gpt-tokenizer as approximation
        if (model.startsWith('gemini-')) {
            return encode(text).length;
        }

        // Default fallback
        return encode(text).length;
    } catch (error) {
        console.error('Error counting tokens:', error);
        // Fallback to simple approximation: ~4 characters per token
        return Math.ceil(text.length / 4);
    }
}

// Calculate cost based on token count and model
export function calculateCost(
    inputTokens: number,
    outputTokens: number,
    modelInfo: ModelInfo
): number {
    const inputCost = (inputTokens / 1000) * modelInfo.input;
    const outputCost = (outputTokens / 1000) * modelInfo.output;
    return inputCost + outputCost;
}

// Estimate monthly cost
export function estimateMonthlyCost(
    tokensPerRequest: number,
    requestsPerDay: number,
    modelInfo: ModelInfo
): number {
    const dailyCost = calculateCost(tokensPerRequest, 0, modelInfo) * requestsPerDay;
    return dailyCost * 30; // 30 days
}

// Get character and word counts
export function getTextStats(text: string) {
    const characters = text.length;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lines = text.split('\n').length;

    return {
        characters,
        words,
        lines
    };
}

// Format cost for display
export function formatCost(cost: number): string {
    if (cost < 0.001) {
        return `$${(cost * 1000).toFixed(3)} (per 1K)`;
    } else if (cost < 1) {
        return `$${cost.toFixed(4)}`;
    } else {
        return `$${cost.toFixed(2)}`;
    }
}

// Format large numbers
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    } else {
        return num.toString();
    }
}
