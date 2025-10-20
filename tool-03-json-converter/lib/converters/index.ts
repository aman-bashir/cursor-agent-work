export { convertJsonToCsv } from './jsonToCsv';
export { convertJsonToXml } from './jsonToXml';
export { convertJsonToYaml } from './jsonToYaml';
export { convertJsonToSql } from './jsonToSql';
export { convertCsvToJson } from './reverseConverters';
export { convertXmlToJson } from './reverseConverters';
export { convertYamlToJson } from './reverseConverters';

export interface ConversionOptions {
    delimiter?: string;
    includeHeaders?: boolean;
    flatten?: boolean;
    tableName?: string;
    indent?: number;
}

export interface ConversionResult {
    success: boolean;
    data?: string;
    error?: string;
}

export async function convertData(
    inputData: string,
    fromFormat: string,
    toFormat: string,
    options: ConversionOptions = {}
): Promise<ConversionResult> {
    try {
        let result: string;

        if (fromFormat === 'json' && toFormat === 'csv') {
            result = convertJsonToCsv(inputData, options);
        } else if (fromFormat === 'json' && toFormat === 'xml') {
            result = convertJsonToXml(inputData, options);
        } else if (fromFormat === 'json' && toFormat === 'yaml') {
            result = convertJsonToYaml(inputData, options);
        } else if (fromFormat === 'json' && toFormat === 'sql') {
            result = convertJsonToSql(inputData, options);
        } else if (fromFormat === 'csv' && toFormat === 'json') {
            result = convertCsvToJson(inputData, options);
        } else if (fromFormat === 'xml' && toFormat === 'json') {
            result = convertXmlToJson(inputData, options);
        } else if (fromFormat === 'yaml' && toFormat === 'json') {
            result = convertYamlToJson(inputData, options);
        } else {
            return {
                success: false,
                error: `Conversion from ${fromFormat} to ${toFormat} is not supported`
            };
        }

        return {
            success: true,
            data: result
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown conversion error'
        };
    }
}
