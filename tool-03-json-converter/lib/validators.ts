export interface ValidationResult {
    isValid: boolean;
    error?: string;
    line?: number;
    column?: number;
    suggestions?: string[];
}

export interface JsonValidationResult extends ValidationResult {
    formatted?: string;
    minified?: string;
    size?: {
        characters: number;
        lines: number;
        bytes: number;
    };
}

// JSON Validator
export function validateJson(jsonString: string): JsonValidationResult {
    try {
        const parsed = JSON.parse(jsonString);

        // Calculate size information
        const size = {
            characters: jsonString.length,
            lines: jsonString.split('\n').length,
            bytes: new Blob([jsonString]).size
        };

        // Generate formatted version
        const formatted = JSON.stringify(parsed, null, 2);

        // Generate minified version
        const minified = JSON.stringify(parsed);

        return {
            isValid: true,
            formatted,
            minified,
            size
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Try to extract line and column information
        const lineMatch = errorMessage.match(/position (\d+)/);
        const position = lineMatch ? parseInt(lineMatch[1]) : 0;

        let line = 1;
        let column = 1;

        if (position > 0) {
            const beforeError = jsonString.substring(0, position);
            line = beforeError.split('\n').length;
            column = beforeError.split('\n').pop()?.length || 1;
        }

        // Generate suggestions based on common errors
        const suggestions = generateJsonSuggestions(errorMessage, jsonString);

        return {
            isValid: false,
            error: errorMessage,
            line,
            column,
            suggestions
        };
    }
}

// Generate helpful suggestions for JSON errors
function generateJsonSuggestions(errorMessage: string, jsonString: string): string[] {
    const suggestions: string[] = [];

    if (errorMessage.includes('Unexpected token')) {
        suggestions.push('Check for missing commas between array elements or object properties');
        suggestions.push('Ensure all strings are properly quoted with double quotes');
        suggestions.push('Remove any trailing commas');
    }

    if (errorMessage.includes('Unexpected end of JSON input')) {
        suggestions.push('Check for missing closing brackets or braces');
        suggestions.push('Ensure the JSON is complete and not truncated');
    }

    if (errorMessage.includes('Expected property name')) {
        suggestions.push('Check that all object keys are properly quoted');
        suggestions.push('Ensure there are no duplicate property names');
    }

    if (errorMessage.includes('Unexpected number')) {
        suggestions.push('Check for invalid number formats (e.g., leading zeros)');
        suggestions.push('Ensure numbers are not quoted as strings');
    }

    // Check for common issues
    if (jsonString.includes("'")) {
        suggestions.push('Replace single quotes with double quotes');
    }

    if (jsonString.includes('undefined')) {
        suggestions.push('Replace "undefined" with null or remove the property');
    }

    if (jsonString.includes('NaN')) {
        suggestions.push('Replace "NaN" with null or a valid number');
    }

    if (jsonString.includes('Infinity') || jsonString.includes('-Infinity')) {
        suggestions.push('Replace "Infinity" with null or a valid number');
    }

    return suggestions;
}

// CSV Validator
export function validateCsv(csvString: string): ValidationResult {
    try {
        const lines = csvString.trim().split('\n');

        if (lines.length === 0) {
            return {
                isValid: false,
                error: 'CSV is empty',
                suggestions: ['Add some data to the CSV']
            };
        }

        // Check if all lines have the same number of columns
        const firstLineColumns = lines[0].split(',').length;

        for (let i = 1; i < lines.length; i++) {
            const lineColumns = lines[i].split(',').length;
            if (lineColumns !== firstLineColumns) {
                return {
                    isValid: false,
                    error: `Line ${i + 1} has ${lineColumns} columns, expected ${firstLineColumns}`,
                    line: i + 1,
                    suggestions: [
                        'Ensure all rows have the same number of columns',
                        'Check for missing commas or extra commas',
                        'Consider using quotes around values that contain commas'
                    ]
                };
            }
        }

        return {
            isValid: true
        };
    } catch (error) {
        return {
            isValid: false,
            error: `CSV validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            suggestions: ['Check the CSV format and try again']
        };
    }
}

// XML Validator
export function validateXml(xmlString: string): ValidationResult {
    try {
        // Basic XML structure validation
        const trimmed = xmlString.trim();

        if (!trimmed.startsWith('<')) {
            return {
                isValid: false,
                error: 'XML must start with a tag',
                suggestions: ['Add a root element to your XML']
            };
        }

        // Check for basic XML structure
        const openTags = (trimmed.match(/</g) || []).length;
        const closeTags = (trimmed.match(/>/g) || []).length;

        if (openTags !== closeTags) {
            return {
                isValid: false,
                error: 'Mismatched opening and closing tags',
                suggestions: [
                    'Ensure every opening tag has a corresponding closing tag',
                    'Check for unclosed tags or extra closing tags'
                ]
            };
        }

        // Check for common XML issues
        if (trimmed.includes('&') && !trimmed.includes('&amp;') && !trimmed.includes('&lt;') && !trimmed.includes('&gt;')) {
            return {
                isValid: false,
                error: 'Unescaped ampersand found',
                suggestions: [
                    'Replace & with &amp;',
                    'Replace < with &lt;',
                    'Replace > with &gt;'
                ]
            };
        }

        return {
            isValid: true
        };
    } catch (error) {
        return {
            isValid: false,
            error: `XML validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            suggestions: ['Check the XML format and try again']
        };
    }
}

// YAML Validator
export function validateYaml(yamlString: string): ValidationResult {
    try {
        // Basic YAML structure validation
        const lines = yamlString.split('\n');

        if (lines.length === 0) {
            return {
                isValid: false,
                error: 'YAML is empty',
                suggestions: ['Add some data to the YAML']
            };
        }

        // Check for common YAML issues
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Check for tabs (YAML should use spaces)
            if (line.includes('\t')) {
                return {
                    isValid: false,
                    error: `Line ${i + 1} contains tabs`,
                    line: i + 1,
                    suggestions: [
                        'Replace tabs with spaces for proper YAML indentation',
                        'Use 2 or 4 spaces for indentation'
                    ]
                };
            }
        }

        return {
            isValid: true
        };
    } catch (error) {
        return {
            isValid: false,
            error: `YAML validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            suggestions: ['Check the YAML format and try again']
        };
    }
}

// Format detector
export function detectFormat(data: string): string {
    const trimmed = data.trim();

    // JSON detection
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
            JSON.parse(trimmed);
            return 'json';
        } catch {
            // Not valid JSON, continue checking
        }
    }

    // XML detection
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
        return 'xml';
    }

    // YAML detection (basic)
    if (trimmed.includes(':') && (trimmed.includes('-') || trimmed.includes('|'))) {
        return 'yaml';
    }

    // CSV detection
    if (trimmed.includes(',') && trimmed.split('\n').length > 1) {
        return 'csv';
    }

    // Default to text
    return 'text';
}