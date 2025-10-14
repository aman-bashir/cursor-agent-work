// PM2 Ecosystem Configuration for All 10 Tools
// This file manages all your tool processes on the VPS

module.exports = {
  apps: [
    {
      name: 'tool-01',
      cwd: '/var/www/tool-01-password-generator',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/tool-01-error.log',
      out_file: '/var/log/pm2/tool-01-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'tool-02',
      cwd: '/var/www/tool-02-token-counter',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: '/var/log/pm2/tool-02-error.log',
      out_file: '/var/log/pm2/tool-02-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'tool-03',
      cwd: '/var/www/tool-03-json-converter',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      error_file: '/var/log/pm2/tool-03-error.log',
      out_file: '/var/log/pm2/tool-03-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'tool-04',
      cwd: '/var/www/tool-04-cron-generator',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3004
      },
      error_file: '/var/log/pm2/tool-04-error.log',
      out_file: '/var/log/pm2/tool-04-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'tool-05',
      cwd: '/var/www/tool-05-ai-prompt-library',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3005
      },
      error_file: '/var/log/pm2/tool-05-error.log',
      out_file: '/var/log/pm2/tool-05-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'tool-06',
      cwd: '/var/www/tool-06-timezone-scheduler',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3006
      },
      error_file: '/var/log/pm2/tool-06-error.log',
      out_file: '/var/log/pm2/tool-06-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'tool-07',
      cwd: '/var/www/tool-07-linkedin-formatter',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3007
      },
      error_file: '/var/log/pm2/tool-07-error.log',
      out_file: '/var/log/pm2/tool-07-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'tool-08',
      cwd: '/var/www/tool-08-color-palette',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 3008
      },
      error_file: '/var/log/pm2/tool-08-error.log',
      out_file: '/var/log/pm2/tool-08-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'tool-09',
      cwd: '/var/www/tool-09-thumbnail-tester',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '3G',
      env: {
        NODE_ENV: 'production',
        PORT: 3009
      },
      error_file: '/var/log/pm2/tool-09-error.log',
      out_file: '/var/log/pm2/tool-09-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'tool-10',
      cwd: '/var/www/tool-10-qr-code-analytics',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 3010
      },
      error_file: '/var/log/pm2/tool-10-error.log',
      out_file: '/var/log/pm2/tool-10-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};

