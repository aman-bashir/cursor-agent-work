import Papa from 'papaparse';
import * as yaml from 'js-yaml';

// Convert CSV to JSON
export function csvToJson(csv: string): any {
    try {
        const result = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
            transform: (value) => {
                // Try to parse numbers and booleans
                if (value === 'true') return true;
                if (value === 'false') return false;
                if (value === 'null' || value === '') return null;
                if (!isNaN(Number(value)) && value !== '') return Number(value);
                return value;
            }
        });

        if (result.errors.length > 0) {
            throw new Error(`CSV parsing errors: ${result.errors.map(e => e.message).join(', ')}`);
        }

        return result.data;
    } catch (error) {
        throw new Error(`Failed to convert CSV to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Convert XML to JSON (simplified version)
export function xmlToJson(xml: string): any {
    try {
        // This is a simplified XML to JSON converter
        // For production use, consider using a proper XML parser like xml2js

        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');

        // Check for parsing errors
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
            throw new Error('Invalid XML format');
        }

        return xmlNodeToJson(doc.documentElement);
    } catch (error) {
        throw new Error(`Failed to convert XML to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Convert XML node to JSON object
function xmlNodeToJson(node: Element): any {
    const result: any = {};

    // Handle attributes
    if (node.attributes.length > 0) {
        result['@attributes'] = {};
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            result['@attributes'][attr.name] = attr.value;
        }
    }

    // Handle child nodes
    const children = Array.from(node.children);

    if (children.length === 0) {
        // Leaf node - return text content
        const textContent = node.textContent?.trim();
        if (textContent) {
            // Try to parse as number or boolean
            if (textContent === 'true') return true;
            if (textContent === 'false') return false;
            if (!isNaN(Number(textContent))) return Number(textContent);
            return textContent;
        }
        return null;
    }

    // Group children by tag name
    const childGroups: { [key: string]: Element[] } = {};
    children.forEach(child => {
        if (!childGroups[child.tagName]) {
            childGroups[child.tagName] = [];
        }
        childGroups[child.tagName].push(child);
    });

    // Convert each group
    Object.entries(childGroups).forEach(([tagName, elements]) => {
        if (elements.length === 1) {
            result[tagName] = xmlNodeToJson(elements[0]);
        } else {
            result[tagName] = elements.map(element => xmlNodeToJson(element));
        }
    });

    return result;
}

// Convert YAML to JSON
export function yamlToJson(yamlString: string): any {
    try {
        const json = yaml.load(yamlString, {
            schema: yaml.DEFAULT_SCHEMA,
            json: true
        });

        return json;
    } catch (error) {
        throw new Error(`Failed to convert YAML to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Validate input format
export function validateInputFormat(input: string, format: 'json' | 'csv' | 'xml' | 'yaml'): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    try {
        if (!input.trim()) {
            errors.push('Input is empty');
            return { valid: false, errors };
        }

        switch (format) {
            case 'json':
                JSON.parse(input);
                break;
            case 'csv':
                Papa.parse(input, { skipEmptyLines: true });
                break;
            case 'xml':
                const parser = new DOMParser();
                const doc = parser.parseFromString(input, 'text/xml');
                const parseError = doc.querySelector('parsererror');
                if (parseError) {
                    errors.push('Invalid XML format');
                }
                break;
            case 'yaml':
                yaml.load(input);
                break;
        }

        return {
            valid: errors.length === 0,
            errors
        };
    } catch (error) {
        errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { valid: false, errors };
    }
}
