import Papa from 'papaparse';

export interface CsvOptions {
    flatten?: boolean;
    delimiter?: string;
    headers?: boolean;
}

// Flatten nested objects
export function flatten(obj: any, prefix = ''): Record<string, any> {
    const flattened: Record<string, any> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}_${key}` : key;

            if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(flattened, flatten(obj[key], newKey));
            } else if (Array.isArray(obj[key])) {
                // Handle arrays by joining with semicolon or converting to string
                flattened[newKey] = obj[key].map((item: any) =>
                    typeof item === 'object' ? JSON.stringify(item) : item
                ).join('; ');
            } else {
                flattened[newKey] = obj[key];
            }
        }
    }

    return flattened;
}

// Convert JSON to CSV
export function jsonToCsv(
    json: any,
    options: CsvOptions = {}
): string {
    const {
        flatten: shouldFlatten = true,
        delimiter = ',',
        headers = true
    } = options;

    try {
        let data = json;

        // Ensure we have an array
        if (!Array.isArray(json)) {
            data = [json];
        }

        // Flatten objects if requested
        if (shouldFlatten) {
            data = data.map(item => flatten(item));
        }

        // Convert to CSV using Papa Parse
        const csv = Papa.unparse(data, {
            delimiter,
            header: headers,
            skipEmptyLines: true
        });

        return csv;
    } catch (error) {
        throw new Error(`Failed to convert JSON to CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Get CSV preview (first few rows)
export function getCsvPreview(csv: string, maxRows = 5): string {
    const lines = csv.split('\n');
    return lines.slice(0, maxRows + 1).join('\n'); // +1 for header
}

// Validate CSV structure
export function validateCsvStructure(csv: string): {
    valid: boolean;
    rows: number;
    columns: number;
    errors: string[];
} {
    const errors: string[] = [];
    const lines = csv.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
        errors.push('CSV is empty');
        return { valid: false, rows: 0, columns: 0, errors };
    }

    const headerColumns = lines[0].split(',').length;
    let inconsistentRows = 0;

    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',').length;
        if (columns !== headerColumns) {
            inconsistentRows++;
        }
    }

    if (inconsistentRows > 0) {
        errors.push(`${inconsistentRows} rows have inconsistent column counts`);
    }

    return {
        valid: errors.length === 0,
        rows: lines.length - 1, // Exclude header
        columns: headerColumns,
        errors
    };
}
