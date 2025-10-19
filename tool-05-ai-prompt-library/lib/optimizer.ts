export interface OptimizationSuggestion {
    type: 'context' | 'format' | 'examples' | 'tone' | 'constraints' | 'clarity' | 'specificity';
    title: string;
    description: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
}

export interface OptimizationResult {
    score: number;
    suggestions: OptimizationSuggestion[];
    improvedVersion: string;
    analysis: {
        wordCount: number;
        hasContext: boolean;
        hasExamples: boolean;
        hasFormat: boolean;
        hasConstraints: boolean;
        clarityScore: number;
        specificityScore: number;
    };
}

export function optimizePrompt(prompt: string): OptimizationResult {
    const analysis = analyzePrompt(prompt);
    const suggestions = generateSuggestions(prompt, analysis);
    const improvedVersion = generateImprovedVersion(prompt, suggestions);
    const score = calculateOptimizationScore(analysis, suggestions);

    return {
        score,
        suggestions,
        improvedVersion,
        analysis
    };
}

function analyzePrompt(prompt: string) {
    const wordCount = prompt.split(/\s+/).length;

    // Check for context indicators
    const contextKeywords = ['for', 'about', 'regarding', 'concerning', 'in the context of', 'when', 'where', 'who'];
    const hasContext = contextKeywords.some(keyword =>
        prompt.toLowerCase().includes(keyword)
    );

    // Check for examples
    const exampleKeywords = ['example', 'for instance', 'such as', 'like', 'e.g.', 'i.e.'];
    const hasExamples = exampleKeywords.some(keyword =>
        prompt.toLowerCase().includes(keyword)
    );

    // Check for format specification
    const formatKeywords = ['format', 'structure', 'style', 'template', 'outline', 'list', 'paragraph', 'bullet points'];
    const hasFormat = formatKeywords.some(keyword =>
        prompt.toLowerCase().includes(keyword)
    );

    // Check for constraints
    const constraintKeywords = ['limit', 'maximum', 'minimum', 'between', 'no more than', 'at least', 'exactly', 'only'];
    const hasConstraints = constraintKeywords.some(keyword =>
        prompt.toLowerCase().includes(keyword)
    );

    // Calculate clarity score (0-100)
    const clarityScore = calculateClarityScore(prompt);

    // Calculate specificity score (0-100)
    const specificityScore = calculateSpecificityScore(prompt);

    return {
        wordCount,
        hasContext,
        hasExamples,
        hasFormat,
        hasConstraints,
        clarityScore,
        specificityScore
    };
}

function calculateClarityScore(prompt: string): number {
    let score = 50; // Base score

    // Check for clear instructions
    const instructionWords = ['create', 'write', 'generate', 'make', 'build', 'design', 'develop'];
    const hasInstructions = instructionWords.some(word =>
        prompt.toLowerCase().includes(word)
    );
    if (hasInstructions) score += 15;

    // Check for specific verbs
    const specificVerbs = ['analyze', 'compare', 'explain', 'describe', 'list', 'outline', 'summarize'];
    const hasSpecificVerbs = specificVerbs.some(verb =>
        prompt.toLowerCase().includes(verb)
    );
    if (hasSpecificVerbs) score += 10;

    // Check for question format
    if (prompt.includes('?')) score += 5;

    // Check for bullet points or structure
    if (prompt.includes('-') || prompt.includes('•') || prompt.includes('*')) score += 10;

    // Penalize for vague words
    const vagueWords = ['good', 'nice', 'better', 'best', 'some', 'many', 'few', 'several'];
    const vagueCount = vagueWords.filter(word =>
        prompt.toLowerCase().includes(word)
    ).length;
    score -= vagueCount * 5;

    return Math.max(0, Math.min(100, score));
}

function calculateSpecificityScore(prompt: string): number {
    let score = 30; // Base score

    // Check for specific numbers
    const numberMatches = prompt.match(/\d+/g);
    if (numberMatches) score += Math.min(20, numberMatches.length * 5);

    // Check for specific details
    const detailIndicators = ['specifically', 'exactly', 'precisely', 'in detail', 'thoroughly'];
    const hasDetails = detailIndicators.some(indicator =>
        prompt.toLowerCase().includes(indicator)
    );
    if (hasDetails) score += 15;

    // Check for target audience
    const audienceKeywords = ['for', 'targeting', 'aimed at', 'designed for', 'intended for'];
    const hasAudience = audienceKeywords.some(keyword =>
        prompt.toLowerCase().includes(keyword)
    );
    if (hasAudience) score += 15;

    // Check for time constraints
    const timeKeywords = ['minutes', 'hours', 'days', 'weeks', 'deadline', 'by', 'within'];
    const hasTimeConstraints = timeKeywords.some(keyword =>
        prompt.toLowerCase().includes(keyword)
    );
    if (hasTimeConstraints) score += 10;

    // Check for specific format requirements
    const formatKeywords = ['paragraph', 'sentence', 'word', 'character', 'page', 'section'];
    const hasFormatRequirements = formatKeywords.some(keyword =>
        prompt.toLowerCase().includes(keyword)
    );
    if (hasFormatRequirements) score += 10;

    return Math.max(0, Math.min(100, score));
}

function generateSuggestions(prompt: string, analysis: any): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Context suggestions
    if (!analysis.hasContext) {
        suggestions.push({
            type: 'context',
            title: 'Add Context',
            description: 'Provide more background information about the task',
            suggestion: 'Add context about your audience, industry, or specific use case. For example: "for a software development team" or "targeting small business owners"',
            priority: 'high'
        });
    }

    // Format suggestions
    if (!analysis.hasFormat) {
        suggestions.push({
            type: 'format',
            title: 'Specify Format',
            description: 'Define the desired output format',
            suggestion: 'Specify the format you want (e.g., "in bullet points", "as a table", "in paragraph form", "as a list")',
            priority: 'high'
        });
    }

    // Examples suggestions
    if (!analysis.hasExamples) {
        suggestions.push({
            type: 'examples',
            title: 'Include Examples',
            description: 'Provide examples to guide the AI',
            suggestion: 'Add examples of what you want. For example: "like this: [example]" or "similar to [reference]"',
            priority: 'medium'
        });
    }

    // Constraints suggestions
    if (!analysis.hasConstraints) {
        suggestions.push({
            type: 'constraints',
            title: 'Add Constraints',
            description: 'Set clear boundaries and limitations',
            suggestion: 'Specify constraints like word count, time limits, or specific requirements. For example: "in under 200 words" or "without using technical jargon"',
            priority: 'medium'
        });
    }

    // Clarity suggestions
    if (analysis.clarityScore < 70) {
        suggestions.push({
            type: 'clarity',
            title: 'Improve Clarity',
            description: 'Make your instructions clearer and more direct',
            suggestion: 'Use more specific action words and avoid vague terms. Instead of "make it good," say "make it professional and engaging"',
            priority: 'high'
        });
    }

    // Specificity suggestions
    if (analysis.specificityScore < 60) {
        suggestions.push({
            type: 'specificity',
            title: 'Be More Specific',
            description: 'Add more specific details and requirements',
            suggestion: 'Include specific numbers, target audience, industry context, or other concrete details to get better results',
            priority: 'medium'
        });
    }

    // Tone suggestions
    if (!prompt.toLowerCase().includes('tone') && !prompt.toLowerCase().includes('style')) {
        suggestions.push({
            type: 'tone',
            title: 'Specify Tone',
            description: 'Define the desired tone and style',
            suggestion: 'Specify the tone you want (e.g., "professional", "casual", "technical", "friendly", "formal")',
            priority: 'low'
        });
    }

    return suggestions.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

function generateImprovedVersion(originalPrompt: string, suggestions: OptimizationSuggestion[]): string {
    let improved = originalPrompt;

    // Apply high-priority suggestions
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high');

    for (const suggestion of highPrioritySuggestions) {
        switch (suggestion.type) {
            case 'context':
                if (!improved.toLowerCase().includes('for') && !improved.toLowerCase().includes('about')) {
                    improved += '\n\nContext: Specify your target audience or use case.';
                }
                break;
            case 'format':
                if (!improved.toLowerCase().includes('format') && !improved.toLowerCase().includes('structure')) {
                    improved += '\n\nFormat: Specify the desired output format (e.g., bullet points, paragraph, table).';
                }
                break;
            case 'clarity':
                // Replace vague words with more specific ones
                improved = improved.replace(/\bgood\b/gi, 'high-quality');
                improved = improved.replace(/\bbetter\b/gi, 'more effective');
                improved = improved.replace(/\bsome\b/gi, 'specific');
                break;
        }
    }

    // Add examples section if missing
    if (!improved.toLowerCase().includes('example') && !improved.toLowerCase().includes('for instance')) {
        improved += '\n\nExample: Provide a sample input and expected output.';
    }

    // Add constraints section if missing
    if (!improved.toLowerCase().includes('limit') && !improved.toLowerCase().includes('constraint')) {
        improved += '\n\nConstraints: Specify any limitations (word count, time, style, etc.).';
    }

    return improved;
}

function calculateOptimizationScore(analysis: any, suggestions: OptimizationSuggestion[]): number {
    let score = 0;

    // Base score from analysis
    score += analysis.clarityScore * 0.3;
    score += analysis.specificityScore * 0.3;

    // Bonus for having key elements
    if (analysis.hasContext) score += 10;
    if (analysis.hasExamples) score += 10;
    if (analysis.hasFormat) score += 10;
    if (analysis.hasConstraints) score += 10;

    // Penalty for suggestions (more suggestions = lower score)
    const suggestionPenalty = suggestions.length * 5;
    score -= suggestionPenalty;

    // Word count bonus (optimal range: 20-100 words)
    if (analysis.wordCount >= 20 && analysis.wordCount <= 100) {
        score += 10;
    } else if (analysis.wordCount < 10) {
        score -= 20; // Too short
    } else if (analysis.wordCount > 200) {
        score -= 10; // Too long
    }

    return Math.max(0, Math.min(100, Math.round(score)));
}

export function getOptimizationTips(): string[] {
    return [
        "Be specific about your target audience and use case",
        "Include examples of what you want the AI to produce",
        "Specify the desired format and structure",
        "Set clear constraints and limitations",
        "Use specific action words instead of vague terms",
        "Provide context about your industry or domain",
        "Include relevant background information",
        "Test your prompt with different variations",
        "Iterate and refine based on results",
        "Consider the AI model's strengths and limitations"
    ];
}
