import Fuse from 'fuse.js';
import promptsData from '../data/prompts.json';

export interface Prompt {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string[];
    tags: string[];
    aiModel: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    example: {
        input: string;
        output: string;
    };
    tips: string[];
    views: number;
    favorites: number;
    createdAt: string;
}

// Configure Fuse.js for fuzzy search
const fuseOptions = {
    keys: [
        { name: 'title', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'content', weight: 0.2 },
        { name: 'category', weight: 0.15 },
        { name: 'tags', weight: 0.1 },
        { name: 'tips', weight: 0.05 }
    ],
    threshold: 0.3, // Lower = more strict matching
    includeScore: true,
    includeMatches: true
};

const fuse = new Fuse(promptsData as Prompt[], fuseOptions);

export interface SearchFilters {
    category?: string;
    model?: string;
    difficulty?: string;
    sortBy?: 'popularity' | 'newest' | 'alphabetical' | 'favorites';
}

export interface SearchResult {
    item: Prompt;
    score?: number;
    matches?: Fuse.FuseResultMatch[];
}

export function searchPrompts(query: string, filters: SearchFilters = {}): SearchResult[] {
    let results: SearchResult[] = [];

    // If no query, return all prompts
    if (!query.trim()) {
        results = promptsData.map(prompt => ({ item: prompt as Prompt }));
    } else {
        // Use Fuse.js for fuzzy search
        const fuseResults = fuse.search(query);
        results = fuseResults.map(result => ({
            item: result.item,
            score: result.score,
            matches: result.matches
        }));
    }

    // Apply filters
    if (filters.category) {
        results = results.filter(result =>
            result.item.category.includes(filters.category!)
        );
    }

    if (filters.model) {
        results = results.filter(result =>
            result.item.aiModel.includes(filters.model!)
        );
    }

    if (filters.difficulty) {
        results = results.filter(result =>
            result.item.difficulty === filters.difficulty
        );
    }

    // Apply sorting
    switch (filters.sortBy) {
        case 'popularity':
            results.sort((a, b) => b.item.views - a.item.views);
            break;
        case 'newest':
            results.sort((a, b) => new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime());
            break;
        case 'alphabetical':
            results.sort((a, b) => a.item.title.localeCompare(b.item.title));
            break;
        case 'favorites':
            results.sort((a, b) => b.item.favorites - a.item.favorites);
            break;
        default:
            // Default: relevance score (for search results) or popularity (for no query)
            if (query.trim()) {
                results.sort((a, b) => (a.score || 0) - (b.score || 0));
            } else {
                results.sort((a, b) => b.item.views - a.item.views);
            }
    }

    return results;
}

export function getPromptById(id: string): Prompt | undefined {
    return promptsData.find(prompt => prompt.id === id) as Prompt | undefined;
}

export function getPromptsByCategory(category: string): Prompt[] {
    return promptsData.filter(prompt =>
        prompt.category.includes(category)
    ) as Prompt[];
}

export function getPopularPrompts(limit: number = 10): Prompt[] {
    return promptsData
        .sort((a, b) => b.views - a.views)
        .slice(0, limit) as Prompt[];
}

export function getRecentPrompts(limit: number = 10): Prompt[] {
    return promptsData
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit) as Prompt[];
}

export function getCategories(): string[] {
    const allCategories = promptsData.flatMap(prompt => prompt.category);
    return Array.from(new Set(allCategories)).sort();
}

export function getModels(): string[] {
    const allModels = promptsData.flatMap(prompt => prompt.aiModel);
    return Array.from(new Set(allModels)).sort();
}

export function getDifficulties(): string[] {
    return ['beginner', 'intermediate', 'advanced'];
}

export function getRelatedPrompts(currentPrompt: Prompt, limit: number = 5): Prompt[] {
    // Find prompts with similar categories or tags
    const related = promptsData.filter(prompt => {
        if (prompt.id === currentPrompt.id) return false;

        // Check for category overlap
        const categoryOverlap = prompt.category.some(cat =>
            currentPrompt.category.includes(cat)
        );

        // Check for tag overlap
        const tagOverlap = prompt.tags.some(tag =>
            currentPrompt.tags.includes(tag)
        );

        return categoryOverlap || tagOverlap;
    });

    // Sort by popularity and return top results
    return related
        .sort((a, b) => b.views - a.views)
        .slice(0, limit) as Prompt[];
}

export function getPromptStats(): {
    totalPrompts: number;
    totalCategories: number;
    totalModels: number;
    averageViews: number;
    averageFavorites: number;
} {
    const totalPrompts = promptsData.length;
    const totalCategories = getCategories().length;
    const totalModels = getModels().length;
    const averageViews = Math.round(
        promptsData.reduce((sum, prompt) => sum + prompt.views, 0) / totalPrompts
    );
    const averageFavorites = Math.round(
        promptsData.reduce((sum, prompt) => sum + prompt.favorites, 0) / totalPrompts
    );

    return {
        totalPrompts,
        totalCategories,
        totalModels,
        averageViews,
        averageFavorites
    };
}
