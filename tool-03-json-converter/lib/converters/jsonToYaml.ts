import * as yaml from 'js-yaml';

export interface YamlOptions {
    indent?: number;
    lineWidth?: number;
    noRefs?: boolean;
}

// Convert JSON to YAML
export function jsonToYaml(
    json: any,
    options: YamlOptions = {}
): string {
    const {
        indent = 2,
        lineWidth = 80,
        noRefs = true
    } = options;

    try {
        const yamlString = yaml.dump(json, {
            indent,
            lineWidth,
            noRefs,
            sortKeys: false,
            quotingType: '"',
            forceQuotes: false
        });

        return yamlString;
    } catch (error) {
        throw new Error(`Failed to convert JSON to YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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

// Validate YAML structure
export function validateYamlStructure(yamlString: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    try {
        if (!yamlString.trim()) {
            errors.push('YAML is empty');
            return { valid: false, errors };
        }

        // Try to parse the YAML
        yaml.load(yamlString);

        return {
            valid: true,
            errors
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`YAML parsing error: ${errorMessage}`);

        return {
            valid: false,
            errors
        };
    }
}

// Get YAML preview (first few lines)
export function getYamlPreview(yamlString: string, maxLines = 10): string {
    const lines = yamlString.split('\n');
    return lines.slice(0, maxLines).join('\n');
}
