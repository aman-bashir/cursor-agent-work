import modelsData from '../data/models.json';
import { ModelInfo, ModelComparison } from './tokenizers';

// Get all available models
export function getAllModels(): Record<string, ModelInfo> {
    const allModels: Record<string, ModelInfo> = {};

    Object.values(modelsData).forEach((provider: any) => {
        Object.entries(provider).forEach(([key, model]: [string, any]) => {
            allModels[key] = model;
        });
    });

    return allModels;
}

// Get model info by key
export function getModelInfo(modelKey: string): ModelInfo | null {
    const allModels = getAllModels();
    return allModels[modelKey] || null;
}

// Compare models for given token counts
export function compareModels(
    inputTokens: number,
    outputTokens: number
): ModelComparison[] {
    const allModels = getAllModels();
    const comparisons: ModelComparison[] = [];

    Object.entries(allModels).forEach(([key, modelInfo]) => {
        const inputCost = (inputTokens / 1000) * modelInfo.input;
        const outputCost = (outputTokens / 1000) * modelInfo.output;
        const totalCost = inputCost + outputCost;

        comparisons.push({
            model: key,
            modelInfo,
            cost: totalCost,
            isCheapest: false
        });
    });

    // Sort by cost and mark cheapest
    comparisons.sort((a, b) => a.cost - b.cost);
    if (comparisons.length > 0) {
        comparisons[0].isCheapest = true;
    }

    return comparisons;
}

// Get models by provider
export function getModelsByProvider(provider: string): Record<string, ModelInfo> {
    const providerData = (modelsData as any)[provider];
    return providerData || {};
}

// Get all providers
export function getProviders(): string[] {
    return Object.keys(modelsData);
}

// Get model quality tier (for UI display)
export function getModelTier(modelKey: string): 'premium' | 'standard' | 'budget' {
    const modelInfo = getModelInfo(modelKey);
    if (!modelInfo) return 'standard';

    const avgPrice = (modelInfo.input + modelInfo.output) / 2;

    if (avgPrice > 0.01) return 'premium';
    if (avgPrice < 0.001) return 'budget';
    return 'standard';
}

// Get context window warning
export function getContextWarning(inputTokens: number, modelInfo: ModelInfo): string | null {
    const usagePercent = (inputTokens / modelInfo.context) * 100;

    if (usagePercent > 90) {
        return `⚠️ Very close to context limit (${usagePercent.toFixed(1)}% used)`;
    } else if (usagePercent > 75) {
        return `⚠️ Approaching context limit (${usagePercent.toFixed(1)}% used)`;
    }

    return null;
}
