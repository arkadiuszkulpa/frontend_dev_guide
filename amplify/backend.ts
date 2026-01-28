import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data, sendEmailHandler } from './data/resource';

const backend = defineBackend({
  auth,
  data,
  sendEmailHandler,
});

// Grant SES permissions to the Lambda function
const emailFunctionRole = backend.sendEmailHandler.resources.lambda.role!;
emailFunctionRole.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['ses:SendEmail', 'ses:SendRawEmail'],
    resources: ['*'],
  })
);
