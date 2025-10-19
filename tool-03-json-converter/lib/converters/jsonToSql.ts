export interface SqlOptions {
    tableName: string;
    mode: 'INSERT' | 'CREATE' | 'BOTH';
}

// Convert JSON to SQL
export function jsonToSql(
    json: any,
    options: SqlOptions
): string {
    const { tableName, mode } = options;

    try {
        let sql = '';

        // Ensure we have an array
        const data = Array.isArray(json) ? json : [json];

        if (data.length === 0) {
            throw new Error('No data to convert');
        }

        // Generate CREATE TABLE statement
        if (mode === 'CREATE' || mode === 'BOTH') {
            sql += generateCreateTable(data, tableName) + '\n\n';
        }

        // Generate INSERT statements
        if (mode === 'INSERT' || mode === 'BOTH') {
            sql += generateInsertStatements(data, tableName);
        }

        return sql;
    } catch (error) {
        throw new Error(`Failed to convert JSON to SQL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Generate CREATE TABLE statement
function generateCreateTable(data: any[], tableName: string): string {
    const columns = new Map<string, string>();

    // Analyze all objects to determine column types
    data.forEach(obj => {
        analyzeObject(obj, columns, '');
    });

    let sql = `CREATE TABLE ${escapeIdentifier(tableName)} (\n`;
    const columnDefs: string[] = [];

    for (const [columnName, columnType] of columns) {
        columnDefs.push(`  ${escapeIdentifier(columnName)} ${columnType}`);
    }

    sql += columnDefs.join(',\n');
    sql += '\n);';

    return sql;
}

// Analyze object to determine column types
function analyzeObject(obj: any, columns: Map<string, string>, prefix: string): void {
    for (const [key, value] of Object.entries(obj)) {
        const columnName = prefix ? `${prefix}_${key}` : key;

        if (value === null || value === undefined) {
            // Keep existing type or default to VARCHAR
            if (!columns.has(columnName)) {
                columns.set(columnName, 'VARCHAR(255)');
            }
        } else if (typeof value === 'boolean') {
            columns.set(columnName, 'BOOLEAN');
        } else if (typeof value === 'number') {
            if (Number.isInteger(value)) {
                columns.set(columnName, 'INTEGER');
            } else {
                columns.set(columnName, 'DECIMAL(10,2)');
            }
        } else if (typeof value === 'string') {
            const maxLength = Math.max(value.length, columns.get(columnName)?.match(/\d+/)?.map(Number)[0] || 0);
            columns.set(columnName, `VARCHAR(${Math.min(maxLength * 2, 1000)})`);
        } else if (Array.isArray(value)) {
            columns.set(columnName, 'TEXT'); // Store as JSON string
        } else if (typeof value === 'object') {
            // Flatten nested objects
            analyzeObject(value, columns, columnName);
        }
    }
}

// Generate INSERT statements
function generateInsertStatements(data: any[], tableName: string): string {
    if (data.length === 0) return '';

    const statements: string[] = [];

    // Get all possible columns from all objects
    const allColumns = new Set<string>();
    data.forEach(obj => {
        collectColumns(obj, allColumns, '');
    });

    const columns = Array.from(allColumns);

    // Generate INSERT statements
    data.forEach(obj => {
        const values = columns.map(column => {
            const value = getNestedValue(obj, column);
            return formatSqlValue(value);
        });

        const statement = `INSERT INTO ${escapeIdentifier(tableName)} (${columns.map(escapeIdentifier).join(', ')}) VALUES (${values.join(', ')});`;
        statements.push(statement);
    });

    return statements.join('\n');
}

// Collect all column names from an object
function collectColumns(obj: any, columns: Set<string>, prefix: string): void {
    for (const [key, value] of Object.entries(obj)) {
        const columnName = prefix ? `${prefix}_${key}` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            collectColumns(value, columns, columnName);
        } else {
            columns.add(columnName);
        }
    }
}

// Get nested value from object using dot notation
function getNestedValue(obj: any, path: string): any {
    return path.split('_').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

// Format value for SQL
function formatSqlValue(value: any): string {
    if (value === null || value === undefined) {
        return 'NULL';
    }

    if (typeof value === 'boolean') {
        return value ? 'TRUE' : 'FALSE';
    }

    if (typeof value === 'number') {
        return value.toString();
    }

    if (typeof value === 'string') {
        // Escape single quotes
        const escaped = value.replace(/'/g, "''");
        return `'${escaped}'`;
    }

    if (Array.isArray(value) || typeof value === 'object') {
        // Convert to JSON string
        const jsonString = JSON.stringify(value).replace(/'/g, "''");
        return `'${jsonString}'`;
    }

    return `'${String(value).replace(/'/g, "''")}'`;
}

// Escape SQL identifiers
function escapeIdentifier(identifier: string): string {
    // Replace invalid characters with underscores
    const sanitized = identifier.replace(/[^a-zA-Z0-9_]/g, '_');
    return `"${sanitized}"`;
}

// Validate SQL structure
export function validateSqlStructure(sql: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    try {
        if (!sql.trim()) {
            errors.push('SQL is empty');
            return { valid: false, errors };
        }

        // Basic SQL validation
        const upperSql = sql.toUpperCase();

        if (!upperSql.includes('CREATE TABLE') && !upperSql.includes('INSERT INTO')) {
            errors.push('SQL must contain CREATE TABLE or INSERT INTO statements');
        }

        // Check for balanced parentheses
        const openParens = (sql.match(/\(/g) || []).length;
        const closeParens = (sql.match(/\)/g) || []).length;

        if (openParens !== closeParens) {
            errors.push('Unbalanced parentheses');
        }

        // Check for semicolons
        if (!sql.includes(';')) {
            errors.push('SQL statements should end with semicolons');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    } catch (error) {
        errors.push(`SQL validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { valid: false, errors };
    }
}
