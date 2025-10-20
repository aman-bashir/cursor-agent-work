export interface ModelPricing {
    name: string;
    provider: string;
    inputPricePer1K: number;
    outputPricePer1K: number;
    contextWindow: number;
    quality: 'high' | 'medium' | 'low';
    speed: 'fast' | 'medium' | 'slow';
    description: string;
}

export const MODEL_PRICING: ModelPricing[] = [
    {
        name: 'GPT-4o',
        provider: 'OpenAI',
        inputPricePer1K: 0.005,
        outputPricePer1K: 0.015,
        contextWindow: 128000,
        quality: 'high',
        speed: 'fast',
        description: 'Most capable model with vision and reasoning'
    },
    {
        name: 'GPT-4o Mini',
        provider: 'OpenAI',
        inputPricePer1K: 0.00015,
        outputPricePer1K: 0.0006,
        contextWindow: 128000,
        quality: 'high',
        speed: 'fast',
        description: 'Fast and efficient GPT-4 level model'
    },
    {
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        inputPricePer1K: 0.01,
        outputPricePer1K: 0.03,
        contextWindow: 128000,
        quality: 'high',
        speed: 'medium',
        description: 'Previous generation GPT-4 with large context'
    },
    {
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        inputPricePer1K: 0.0005,
        outputPricePer1K: 0.0015,
        contextWindow: 16385,
        quality: 'medium',
        speed: 'fast',
        description: 'Fast and cost-effective for most tasks'
    },
    {
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        inputPricePer1K: 0.003,
        outputPricePer1K: 0.015,
        contextWindow: 200000,
        quality: 'high',
        speed: 'fast',
        description: 'Excellent reasoning and code generation'
    },
    {
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        inputPricePer1K: 0.00025,
        outputPricePer1K: 0.00125,
        contextWindow: 200000,
        quality: 'medium',
        speed: 'fast',
        description: 'Fast and efficient for simple tasks'
    },
    {
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        inputPricePer1K: 0.00125,
        outputPricePer1K: 0.005,
        contextWindow: 2000000,
        quality: 'high',
        speed: 'medium',
        description: 'Massive context window with strong performance'
    },
    {
        name: 'Gemini 1.5 Flash',
        provider: 'Google',
        inputPricePer1K: 0.000075,
        outputPricePer1K: 0.0003,
        contextWindow: 1000000,
        quality: 'medium',
        speed: 'fast',
        description: 'Ultra-fast and cost-effective'
    }
];

export function calculateCost(
    inputTokens: number,
    outputTokens: number,
    model: ModelPricing
): {
    inputCost: number;
    outputCost: number;
    totalCost: number;
    costPer1K: number;
    costPer10K: number;
    costPer100K: number;
    monthlyEstimate: number;
} {
    const inputCost = (inputTokens / 1000) * model.inputPricePer1K;
    const outputCost = (outputTokens / 1000) * model.outputPricePer1K;
    const totalCost = inputCost + outputCost;

    const costPer1K = totalCost * (1000 / (inputTokens + outputTokens));
    const costPer10K = costPer1K * 10;
    const costPer100K = costPer1K * 100;
    const monthlyEstimate = totalCost * 30; // Assuming daily usage

    return {
        inputCost,
        outputCost,
        totalCost,
        costPer1K,
        costPer10K,
        costPer100K,
        monthlyEstimate
    };
}

export function findBestModel(
    inputTokens: number,
    outputTokens: number,
    criteria: 'cheapest' | 'fastest' | 'highest-quality' = 'cheapest'
): ModelPricing {
    const costs = MODEL_PRICING.map(model => ({
        model,
        cost: calculateCost(inputTokens, outputTokens, model).totalCost
    }));

    switch (criteria) {
        case 'cheapest':
            return costs.reduce((best, current) =>
                current.cost < best.cost ? current : best
            ).model;

        case 'fastest':
            return MODEL_PRICING.find(m => m.speed === 'fast') || MODEL_PRICING[0];

        case 'highest-quality':
            return MODEL_PRICING.find(m => m.quality === 'high') || MODEL_PRICING[0];

        default:
            return costs.reduce((best, current) =>
                current.cost < best.cost ? current : best
            ).model;
    }
}