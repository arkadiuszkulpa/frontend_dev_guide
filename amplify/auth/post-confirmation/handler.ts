import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

// Group name is set via environment variable in resource.ts
const GROUP_NAME = process.env.GROUP_NAME || 'Users';

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const command = new AdminAddUserToGroupCommand({
    GroupName: GROUP_NAME,
    Username: event.userName,
    UserPoolId: event.userPoolId,
  });
  await client.send(command);
  return event;
};
