export interface CronPreset {
    name: string;
    expression: string;
    description: string;
    category: 'common' | 'business' | 'maintenance' | 'monitoring';
}

export const PRESETS: CronPreset[] = [
    // Common patterns
    {
        name: 'Every minute',
        expression: '* * * * *',
        description: 'Run every minute',
        category: 'common'
    },
    {
        name: 'Every 5 minutes',
        expression: '*/5 * * * *',
        description: 'Run every 5 minutes',
        category: 'common'
    },
    {
        name: 'Every 10 minutes',
        expression: '*/10 * * * *',
        description: 'Run every 10 minutes',
        category: 'common'
    },
    {
        name: 'Every 15 minutes',
        expression: '*/15 * * * *',
        description: 'Run every 15 minutes',
        category: 'common'
    },
    {
        name: 'Every 30 minutes',
        expression: '*/30 * * * *',
        description: 'Run every 30 minutes',
        category: 'common'
    },
    {
        name: 'Every hour',
        expression: '0 * * * *',
        description: 'Run at the top of every hour',
        category: 'common'
    },
    {
        name: 'Every 2 hours',
        expression: '0 */2 * * *',
        description: 'Run every 2 hours',
        category: 'common'
    },
    {
        name: 'Every 6 hours',
        expression: '0 */6 * * *',
        description: 'Run every 6 hours',
        category: 'common'
    },
    {
        name: 'Every 12 hours',
        expression: '0 */12 * * *',
        description: 'Run every 12 hours',
        category: 'common'
    },
    {
        name: 'Daily at midnight',
        expression: '0 0 * * *',
        description: 'Run daily at midnight (00:00)',
        category: 'common'
    },
    {
        name: 'Daily at 2 AM',
        expression: '0 2 * * *',
        description: 'Run daily at 2:00 AM',
        category: 'common'
    },
    {
        name: 'Daily at 6 AM',
        expression: '0 6 * * *',
        description: 'Run daily at 6:00 AM',
        category: 'common'
    },
    {
        name: 'Daily at noon',
        expression: '0 12 * * *',
        description: 'Run daily at noon (12:00)',
        category: 'common'
    },
    {
        name: 'Daily at 6 PM',
        expression: '0 18 * * *',
        description: 'Run daily at 6:00 PM',
        category: 'common'
    },
    {
        name: 'Weekly on Monday',
        expression: '0 0 * * 1',
        description: 'Run weekly on Monday at midnight',
        category: 'common'
    },
    {
        name: 'Weekly on Sunday',
        expression: '0 0 * * 0',
        description: 'Run weekly on Sunday at midnight',
        category: 'common'
    },
    {
        name: 'Monthly on 1st',
        expression: '0 0 1 * *',
        description: 'Run monthly on the 1st at midnight',
        category: 'common'
    },
    {
        name: 'Yearly on January 1st',
        expression: '0 0 1 1 *',
        description: 'Run yearly on January 1st at midnight',
        category: 'common'
    },

    // Business hours
    {
        name: 'Every 5 minutes during business hours',
        expression: '*/5 9-17 * * 1-5',
        description: 'Run every 5 minutes, 9 AM to 5 PM, weekdays only',
        category: 'business'
    },
    {
        name: 'Every 10 minutes during business hours',
        expression: '*/10 9-17 * * 1-5',
        description: 'Run every 10 minutes, 9 AM to 5 PM, weekdays only',
        category: 'business'
    },
    {
        name: 'Every hour during business hours',
        expression: '0 9-17 * * 1-5',
        description: 'Run every hour, 9 AM to 5 PM, weekdays only',
        category: 'business'
    },
    {
        name: 'Daily at 9 AM (weekdays)',
        expression: '0 9 * * 1-5',
        description: 'Run daily at 9:00 AM, weekdays only',
        category: 'business'
    },
    {
        name: 'Daily at 5 PM (weekdays)',
        expression: '0 17 * * 1-5',
        description: 'Run daily at 5:00 PM, weekdays only',
        category: 'business'
    },
    {
        name: 'Weekends only',
        expression: '0 0 * * 0,6',
        description: 'Run daily at midnight, weekends only',
        category: 'business'
    },

    // Maintenance
    {
        name: 'Backup at 3 AM daily',
        expression: '0 3 * * *',
        description: 'Run daily at 3:00 AM (backup time)',
        category: 'maintenance'
    },
    {
        name: 'Weekly maintenance on Sunday 2 AM',
        expression: '0 2 * * 0',
        description: 'Run weekly on Sunday at 2:00 AM',
        category: 'maintenance'
    },
    {
        name: 'Monthly maintenance on 1st at 1 AM',
        expression: '0 1 1 * *',
        description: 'Run monthly on the 1st at 1:00 AM',
        category: 'maintenance'
    },
    {
        name: 'Quarterly maintenance',
        expression: '0 1 1 */3 *',
        description: 'Run quarterly on the 1st at 1:00 AM',
        category: 'maintenance'
    },

    // Monitoring
    {
        name: 'Health check every minute',
        expression: '* * * * *',
        description: 'Run every minute (health monitoring)',
        category: 'monitoring'
    },
    {
        name: 'Health check every 5 minutes',
        expression: '*/5 * * * *',
        description: 'Run every 5 minutes (health monitoring)',
        category: 'monitoring'
    },
    {
        name: 'Log rotation daily at midnight',
        expression: '0 0 * * *',
        description: 'Run daily at midnight (log rotation)',
        category: 'monitoring'
    },
    {
        name: 'Performance check every 15 minutes',
        expression: '*/15 * * * *',
        description: 'Run every 15 minutes (performance monitoring)',
        category: 'monitoring'
    }
];

export const PRESETS_BY_CATEGORY = {
    common: PRESETS.filter(p => p.category === 'common'),
    business: PRESETS.filter(p => p.category === 'business'),
    maintenance: PRESETS.filter(p => p.category === 'maintenance'),
    monitoring: PRESETS.filter(p => p.category === 'monitoring')
};

export const COMMON_PATTERNS = [
    {
        name: 'Every 10 minutes during business hours',
        expression: '*/10 9-17 * * 1-5',
        description: 'Weekdays, 9 AM to 5 PM, every 10 minutes'
    },
    {
        name: 'Backup at 3 AM daily',
        expression: '0 3 * * *',
        description: 'Every day at 3:00 AM'
    },
    {
        name: 'Weekly report on Monday 9 AM',
        expression: '0 9 * * 1',
        description: 'Every Monday at 9:00 AM'
    },
    {
        name: 'Monthly cleanup on 1st',
        expression: '0 0 1 * *',
        description: 'First day of every month at midnight'
    },
    {
        name: 'Health check every 5 minutes',
        expression: '*/5 * * * *',
        description: 'Continuous monitoring every 5 minutes'
    }
];
