/* eslint linebreak-style: ["error", "unix"]*/
module.exports = {
  apps: [{
    script: 'C:/Users/Administrator/Documents/dz_listing/dz_listing/bin/www',
    watch: '.',
    exec_mode: 'fork',
  }, {
    script: './service-worker/',
    watch: ['./service-worker'],
  }],

  deploy: {
    production: {
      'user': 'SSH_USERNAME',
      'host': 'SSH_HOSTMACHINE',
      'ref': 'origin/master',
      'repo': 'GIT_REPOSITORY',
      'path': 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
