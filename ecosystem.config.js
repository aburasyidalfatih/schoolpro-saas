module.exports = {
  apps: [
    {
      name: 'schoolpro-dev',
      script: '.next/standalone/server.js',
      instances: 1,
      exec_mode: 'fork',
      node_args: '--max-old-space-size=300',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
