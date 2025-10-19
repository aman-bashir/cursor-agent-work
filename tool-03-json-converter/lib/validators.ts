export interface ValidationResult {
    valid: boolean;
    error?: string;
    line?: number;
    column?: number;
}

// Validate JSON syntax
export function validateJson(text: string): ValidationResult {
    try {
        if (!text.trim()) {
            return {
                valid: false,
                error: 'JSON is empty'
            };
        }

        JSON.parse(text);
        return { valid: true };
    } catch (error) {
        if (error instanceof SyntaxError) {
            // Try to extract line and column information
            const match = error.message.match(/position (\d+)/);
            const position = match ? parseInt(match[1]) : 0;

            // Calculate line and column
            const lines = text.substring(0, position).split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;

            return {
                valid: false,
                error: error.message,
                line,
                column
            };
        }

        return {
            valid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Beautify JSON
export function beautifyJson(json: string): string {
    try {
        const parsed = JSON.parse(json);
        return JSON.stringify(parsed, null, 2);
    } catch (error) {
        throw new Error(`Failed to beautify JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Minify JSON
export function minifyJson(json: string): string {
    try {
        const parsed = JSON.parse(json);
        return JSON.stringify(parsed);
    } catch (error) {
        throw new Error(`Failed to minify JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Get JSON statistics
export function getJsonStats(json: any): {
    size: number;
    depth: number;
    keys: number;
    arrays: number;
    objects: number;
    primitives: number;
} {
    const stats = {
        size: 0,
        depth: 0,
        keys: 0,
        arrays: 0,
        objects: 0,
        primitives: 0
    };

    function analyze(obj: any, currentDepth = 0): void {
        stats.depth = Math.max(stats.depth, currentDepth);

        if (obj === null || obj === undefined) {
            stats.primitives++;
            return;
        }

        if (Array.isArray(obj)) {
            stats.arrays++;
            obj.forEach(item => analyze(item, currentDepth + 1));
        } else if (typeof obj === 'object') {
            stats.objects++;
            Object.entries(obj).forEach(([key, value]) => {
                stats.keys++;
                analyze(value, currentDepth + 1);
            });
        } else {
            stats.primitives++;
        }
    }

    analyze(json);
    stats.size = JSON.stringify(json).length;

    return stats;
}

// Format file size
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get JSON preview (first few lines)
export function getJsonPreview(json: string, maxLines = 10): string {
    const lines = json.split('\n');
    return lines.slice(0, maxLines).join('\n');
}
