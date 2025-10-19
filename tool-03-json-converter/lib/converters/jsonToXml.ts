export interface XmlOptions {
    rootElement?: string;
    declaration?: boolean;
    indent?: number;
}

// Convert JSON to XML
export function jsonToXml(
    json: any,
    options: XmlOptions = {}
): string {
    const {
        rootElement = 'root',
        declaration = true,
        indent = 2
    } = options;

    try {
        let xml = '';

        // Add XML declaration
        if (declaration) {
            xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
        }

        // Convert JSON to XML
        xml += objectToXml(json, rootElement, 0, indent);

        return xml;
    } catch (error) {
        throw new Error(`Failed to convert JSON to XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Convert object to XML
function objectToXml(obj: any, tagName: string, level: number, indent: number): string {
    const spaces = ' '.repeat(level * indent);

    if (obj === null || obj === undefined) {
        return `${spaces}<${tagName}></${tagName}>\n`;
    }

    if (typeof obj === 'boolean') {
        return `${spaces}<${tagName}>${obj}</${tagName}>\n`;
    }

    if (typeof obj === 'number') {
        return `${spaces}<${tagName}>${obj}</${tagName}>\n`;
    }

    if (typeof obj === 'string') {
        // Escape XML special characters
        const escaped = obj
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        return `${spaces}<${tagName}>${escaped}</${tagName}>\n`;
    }

    if (Array.isArray(obj)) {
        let xml = '';
        obj.forEach((item, index) => {
            const itemTagName = `${tagName.slice(0, -1)}_item`; // Remove 's' and add '_item'
            xml += objectToXml(item, itemTagName, level, indent);
        });
        return xml;
    }

    if (typeof obj === 'object') {
        let xml = `${spaces}<${tagName}>\n`;

        for (const [key, value] of Object.entries(obj)) {
            // Sanitize tag names (XML tags can't start with numbers or contain spaces)
            const sanitizedKey = sanitizeTagName(key);
            xml += objectToXml(value, sanitizedKey, level + 1, indent);
        }

        xml += `${spaces}</${tagName}>\n`;
        return xml;
    }

    return `${spaces}<${tagName}>${String(obj)}</${tagName}>\n`;
}

// Sanitize tag names for XML
function sanitizeTagName(name: string): string {
    // Replace invalid characters with underscores
    return name
        .replace(/^[0-9]/, '_$&') // Prefix with underscore if starts with number
        .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace invalid chars with underscore
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}

// Validate XML structure
export function validateXmlStructure(xml: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    try {
        // Basic XML validation
        if (!xml.trim()) {
            errors.push('XML is empty');
            return { valid: false, errors };
        }

        // Check for XML declaration
        if (!xml.includes('<?xml')) {
            errors.push('Missing XML declaration');
        }

        // Check for balanced tags (basic check)
        const openTags = (xml.match(/<[^/][^>]*>/g) || []).length;
        const closeTags = (xml.match(/<\/[^>]*>/g) || []).length;

        if (openTags !== closeTags) {
            errors.push('Unbalanced XML tags');
        }

        // Check for common XML issues
        if (xml.includes('&') && !xml.includes('&amp;') && !xml.includes('&lt;') && !xml.includes('&gt;')) {
            errors.push('Unescaped ampersands found');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    } catch (error) {
        errors.push(`XML validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { valid: false, errors };
    }
}
