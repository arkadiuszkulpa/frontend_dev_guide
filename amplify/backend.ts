import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data, sendEmailHandler } from './data/resource';

const backend = defineBackend({
  auth,
  data,
  sendEmailHandler,
});

// Grant SES permissions to the Lambda function for enquiry emails
const emailFunctionRole = backend.sendEmailHandler.resources.lambda.role!;
emailFunctionRole.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['ses:SendEmail', 'ses:SendRawEmail'],
    resources: ['*'],
  })
);

// Configure Cognito to use SES for verification emails
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.emailConfiguration = {
  emailSendingAccount: 'DEVELOPER',
  sourceArn: `arn:aws:ses:eu-west-2:${backend.auth.resources.userPool.stack.account}:identity/arkadiuszkulpa.co.uk`,
  from: 'verification@arkadiuszkulpa.co.uk',
};

// Customize verification email content
cfnUserPool.verificationMessageTemplate = {
  defaultEmailOption: 'CONFIRM_WITH_CODE',
  emailSubject: 'Your verification code - Arkadiusz Kulpa Web Development',
  emailMessage: `
Hello,

Thank you for creating an account with Arkadiusz Kulpa - Web Development.

Your verification code is: {####}

This code will expire in 24 hours.

If you didn't request this, please ignore this email.

Best regards,
Arkadiusz Kulpa
Web Development Services
https://arkadiuszkulpa.co.uk
`.trim(),
};
