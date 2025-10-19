import { parseExpression } from 'cron-parser';
import cronstrue from 'cronstrue';

export interface CronParts {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
}

export interface ValidationResult {
    valid: boolean;
    error?: string;
    suggestion?: string;
}

export interface NextExecution {
    date: Date;
    formatted: string;
    relative: string;
}

// Parse cron expression into parts
export function parseCronExpression(expression: string): CronParts {
    const parts = expression.trim().split(/\s+/);

    if (parts.length !== 5) {
        throw new Error('Cron expression must have exactly 5 parts');
    }

    return {
        minute: parts[0],
        hour: parts[1],
        dayOfMonth: parts[2],
        month: parts[3],
        dayOfWeek: parts[4]
    };
}

// Get next execution times
export function getNextExecutions(
    expression: string,
    count: number = 10,
    timezone: string = 'UTC'
): NextExecution[] {
    try {
        const options = {
            currentDate: new Date(),
            tz: timezone
        };

        const interval = parseExpression(expression, options);
        const executions: NextExecution[] = [];

        for (let i = 0; i < count; i++) {
            const nextDate = interval.next().toDate();
            executions.push({
                date: nextDate,
                formatted: formatDate(nextDate),
                relative: getRelativeTime(nextDate)
            });
        }

        return executions;
    } catch (error) {
        throw new Error(`Failed to parse cron expression: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Convert cron expression to human-readable English
export function explainCron(expression: string): string {
    try {
        return cronstrue.toString(expression, {
            throwExceptionOnParseError: true,
            use24HourTimeFormat: true
        });
    } catch (error) {
        throw new Error(`Failed to explain cron expression: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Validate cron expression
export function validateCron(expression: string): ValidationResult {
    try {
        if (!expression.trim()) {
            return {
                valid: false,
                error: 'Cron expression is empty'
            };
        }

        const parts = expression.trim().split(/\s+/);

        if (parts.length !== 5) {
            return {
                valid: false,
                error: 'Cron expression must have exactly 5 parts (minute hour day month weekday)',
                suggestion: 'Example: 0 9 * * 1-5'
            };
        }

        // Try to parse the expression
        parseExpression(expression);

        // Try to explain it
        try {
            explainCron(expression);
        } catch (explainError) {
            return {
                valid: false,
                error: 'Invalid cron expression format',
                suggestion: 'Check each field for valid values'
            };
        }

        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : 'Invalid cron expression',
            suggestion: 'Use the visual builder to create a valid expression'
        };
    }
}

// Build cron expression from parts
export function buildCronExpression(parts: CronParts): string {
    return `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
}

// Get field options for dropdowns
export function getFieldOptions(field: keyof CronParts) {
    switch (field) {
        case 'minute':
            return [
                { value: '*', label: 'Every minute' },
                { value: '0', label: 'At minute 0' },
                { value: '*/5', label: 'Every 5 minutes' },
                { value: '*/10', label: 'Every 10 minutes' },
                { value: '*/15', label: 'Every 15 minutes' },
                { value: '*/30', label: 'Every 30 minutes' },
                { value: '0,15,30,45', label: 'At 0, 15, 30, 45' }
            ];

        case 'hour':
            return [
                { value: '*', label: 'Every hour' },
                { value: '0', label: 'At hour 0 (midnight)' },
                { value: '*/2', label: 'Every 2 hours' },
                { value: '*/6', label: 'Every 6 hours' },
                { value: '*/12', label: 'Every 12 hours' },
                { value: '9-17', label: '9 AM to 5 PM' },
                { value: '0,6,12,18', label: 'At 0, 6, 12, 18' }
            ];

        case 'dayOfMonth':
            return [
                { value: '*', label: 'Every day' },
                { value: '1', label: 'On the 1st' },
                { value: '*/2', label: 'Every 2 days' },
                { value: '1,15', label: 'On 1st and 15th' },
                { value: 'L', label: 'Last day of month' }
            ];

        case 'month':
            return [
                { value: '*', label: 'Every month' },
                { value: '1', label: 'January' },
                { value: '*/3', label: 'Every 3 months' },
                { value: '1,4,7,10', label: 'Quarterly' },
                { value: '1-6', label: 'January to June' }
            ];

        case 'dayOfWeek':
            return [
                { value: '*', label: 'Every day of week' },
                { value: '0', label: 'Sunday' },
                { value: '1-5', label: 'Monday to Friday' },
                { value: '0,6', label: 'Weekends' },
                { value: '1,3,5', label: 'Monday, Wednesday, Friday' }
            ];

        default:
            return [];
    }
}

// Format date for display
function formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}

// Get relative time (e.g., "in 2 hours")
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) {
        return 'Past';
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        return 'in less than a minute';
    }
}

// Check if expression is valid for specific platforms
export function validateForPlatform(expression: string, platform: 'linux' | 'aws' | 'k8s' | 'node'): ValidationResult {
    const baseValidation = validateCron(expression);

    if (!baseValidation.valid) {
        return baseValidation;
    }

    const parts = parseCronExpression(expression);

    switch (platform) {
        case 'aws':
            // AWS CloudWatch Events supports 6 fields (with year)
            if (parts.minute.includes(',') && parts.minute.split(',').length > 2) {
                return {
                    valid: false,
                    error: 'AWS CloudWatch Events supports maximum 2 values in comma-separated lists',
                    suggestion: 'Use ranges or fewer comma-separated values'
                };
            }
            break;

        case 'k8s':
            // Kubernetes CronJob supports standard 5 fields
            if (parts.dayOfMonth === 'L' || parts.dayOfWeek === 'L') {
                return {
                    valid: false,
                    error: 'Kubernetes CronJob does not support "L" (last day) syntax',
                    suggestion: 'Use specific day numbers instead'
                };
            }
            break;

        case 'node':
            // node-cron supports standard 5 fields
            break;

        case 'linux':
            // Standard cron supports all features
            break;
    }

    return { valid: true };
}
