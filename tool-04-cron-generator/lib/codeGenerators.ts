export interface CodeGeneratorOptions {
    command?: string;
    description?: string;
    tableName?: string;
    functionName?: string;
}

// Generate Linux crontab entry
export function generateLinuxCrontab(
    expression: string,
    command: string = '/path/to/your/script.sh'
): string {
    return `# ${expression} - ${getDescription(expression)}
${expression} ${command}`;
}

// Generate AWS CloudWatch Events rule
export function generateAWSCloudWatch(expression: string, options: CodeGeneratorOptions = {}): string {
    const description = options.description || getDescription(expression);

    return `{
  "Rules": [
    {
      "Name": "my-scheduled-rule",
      "Description": "${description}",
      "ScheduleExpression": "cron(${expression})",
      "State": "ENABLED",
      "Targets": [
        {
          "Id": "1",
          "Arn": "arn:aws:lambda:region:account:function:my-function",
          "Input": "{\\"key\\": \\"value\\"}"
        }
      ]
    }
  ]
}`;
}

// Generate Kubernetes CronJob
export function generateK8sCronJob(expression: string, options: CodeGeneratorOptions = {}): string {
    const jobName = options.functionName || 'my-scheduled-job';
    const description = options.description || getDescription(expression);

    return `apiVersion: batch/v1
kind: CronJob
metadata:
  name: ${jobName}
  namespace: default
spec:
  schedule: "${expression}"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: ${jobName}
            image: your-image:latest
            command:
            - /bin/sh
            - -c
            - echo "${description}"
          restartPolicy: OnFailure
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1`;
}

// Generate Node.js node-cron code
export function generateNodeCron(expression: string, options: CodeGeneratorOptions = {}): string {
    const functionName = options.functionName || 'scheduledTask';
    const description = options.description || getDescription(expression);

    return `const cron = require('node-cron');

// ${description}
cron.schedule('${expression}', () => {
  console.log('Running ${functionName}...');
  // Your task logic here
  ${functionName}();
}, {
  scheduled: true,
  timezone: "UTC"
});

function ${functionName}() {
  // Add your scheduled task logic here
  console.log('Task executed at:', new Date().toISOString());
}`;
}

// Generate Python APScheduler code
export function generatePythonSchedule(expression: string, options: CodeGeneratorOptions = {}): string {
    const functionName = options.functionName || 'scheduled_task';
    const description = options.description || getDescription(expression);

    return `from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BlockingScheduler()

# ${description}
@scheduler.scheduled_job(CronTrigger.from_crontab('${expression}'))
def ${functionName}():
    logger.info('Running ${functionName}...')
    # Your task logic here
    print(f'Task executed at: {datetime.now()}')

if __name__ == '__main__':
    try:
        scheduler.start()
    except KeyboardInterrupt:
        scheduler.shutdown()`;
}

// Generate GitHub Actions workflow
export function generateGitHubActions(expression: string, options: CodeGeneratorOptions = {}): string {
    const workflowName = options.functionName || 'scheduled-workflow';
    const description = options.description || getDescription(expression);

    return `name: ${workflowName}

on:
  schedule:
    # ${description}
    - cron: '${expression}'

jobs:
  scheduled-job:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Run scheduled task
      run: |
        echo "Running scheduled task..."
        # Add your commands here
        echo "Task completed at $(date)"`;
}

// Generate systemd timer
export function generateSystemdTimer(expression: string, options: CodeGeneratorOptions = {}): string {
    const serviceName = options.functionName || 'my-scheduled-service';
    const description = options.description || getDescription(expression);

    // Convert cron expression to systemd format
    const systemdExpression = convertCronToSystemd(expression);

    return `# /etc/systemd/system/${serviceName}.timer
[Unit]
Description=${description}
Requires=${serviceName}.service

[Timer]
OnCalendar=${systemdExpression}
Persistent=true

[Install]
WantedBy=timers.target

# /etc/systemd/system/${serviceName}.service
[Unit]
Description=${description}

[Service]
Type=oneshot
ExecStart=/path/to/your/script.sh
User=your-user

[Install]
WantedBy=multi-user.target`;
}

// Generate Docker Compose with cron
export function generateDockerCompose(expression: string, options: CodeGeneratorOptions = {}): string {
    const serviceName = options.functionName || 'scheduled-service';
    const description = options.description || getDescription(expression);

    return `version: '3.8'

services:
  ${serviceName}:
    image: your-image:latest
    container_name: ${serviceName}
    command: >
      sh -c "
        echo '${expression} /app/run-task.sh' > /etc/crontabs/root &&
        crond -f -l 2
      "
    volumes:
      - ./scripts:/app
    restart: unless-stopped
    environment:
      - TZ=UTC`;
}

// Get all available generators
export function getAvailableGenerators(): Array<{
    id: string;
    name: string;
    description: string;
    generate: (expression: string, options?: CodeGeneratorOptions) => string;
}> {
    return [
        {
            id: 'linux',
            name: 'Linux Crontab',
            description: 'Standard Unix/Linux crontab entry',
            generate: generateLinuxCrontab
        },
        {
            id: 'aws',
            name: 'AWS CloudWatch Events',
            description: 'AWS CloudWatch Events rule JSON',
            generate: generateAWSCloudWatch
        },
        {
            id: 'k8s',
            name: 'Kubernetes CronJob',
            description: 'Kubernetes CronJob YAML',
            generate: generateK8sCronJob
        },
        {
            id: 'node',
            name: 'Node.js (node-cron)',
            description: 'Node.js code using node-cron library',
            generate: generateNodeCron
        },
        {
            id: 'python',
            name: 'Python (APScheduler)',
            description: 'Python code using APScheduler library',
            generate: generatePythonSchedule
        },
        {
            id: 'github',
            name: 'GitHub Actions',
            description: 'GitHub Actions workflow YAML',
            generate: generateGitHubActions
        },
        {
            id: 'systemd',
            name: 'systemd Timer',
            description: 'systemd timer and service files',
            generate: generateSystemdTimer
        },
        {
            id: 'docker',
            name: 'Docker Compose',
            description: 'Docker Compose with cron service',
            generate: generateDockerCompose
        }
    ];
}

// Helper function to get description from expression
function getDescription(expression: string): string {
    try {
        // This would use the explainCron function from cronParser
        // For now, return a simple description
        return 'Scheduled task';
    } catch {
        return 'Scheduled task';
    }
}

// Convert cron expression to systemd OnCalendar format
function convertCronToSystemd(cronExpression: string): string {
    const parts = cronExpression.split(' ');
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    // This is a simplified conversion
    // In practice, you'd need more sophisticated logic

    if (minute === '*' && hour === '*') {
        return 'minutely';
    } else if (minute !== '*' && hour === '*') {
        return `*:${minute}`;
    } else if (minute === '0' && hour !== '*') {
        return `${hour}:00`;
    } else if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return `daily`;
    } else if (dayOfWeek !== '*') {
        return 'weekly';
    } else if (dayOfMonth !== '*') {
        return 'monthly';
    }

    // Fallback to a more complex format
    return `*-*-* ${hour}:${minute}:00`;
}
