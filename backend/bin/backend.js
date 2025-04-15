#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { BackendStack } = require('../lib/backend-stack');

const app = new cdk.App();

new BackendStack(app, 'BackendStack', {
  env: {
    account: '098969626018',
    region: 'us-east-1',
  },
  stackName: 'BackendStack',
  description: 'Backend stack for personal portfolio project',
});
