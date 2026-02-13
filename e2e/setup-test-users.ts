/**
 * Setup Test Users for E2E Tests
 *
 * This script creates test users in the Cognito user pool for E2E testing.
 * Run this once per sandbox/environment before running tests.
 *
 * Usage:
 *   npx tsx e2e/setup-test-users.ts
 *
 * Prerequisites:
 *   - AWS CLI configured with appropriate credentials
 *   - amplify_outputs.json exists (sandbox must be running)
 */

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand,
  AdminGetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { readFileSync } from 'fs';
import { testConfig } from './test-config';

// Load Amplify outputs to get user pool ID
function getAmplifyConfig() {
  try {
    const outputs = JSON.parse(readFileSync('amplify_outputs.json', 'utf-8'));
    return {
      userPoolId: outputs.auth.user_pool_id,
      region: outputs.auth.aws_region,
    };
  } catch (_error) {
    console.error('Error: Could not read amplify_outputs.json');
    console.error('Make sure your Amplify sandbox is running: npx ampx sandbox');
    process.exit(1);
  }
}

async function userExists(client: CognitoIdentityProviderClient, userPoolId: string, email: string): Promise<boolean> {
  try {
    await client.send(new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: email,
    }));
    return true;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'UserNotFoundException') {
      return false;
    }
    throw error;
  }
}

async function createTestUser(
  client: CognitoIdentityProviderClient,
  userPoolId: string,
  email: string,
  password: string,
  groups: string[] = []
) {
  console.log(`\nSetting up user: ${email}`);

  // Check if user already exists
  if (await userExists(client, userPoolId, email)) {
    console.log(`  ✓ User already exists`);
  } else {
    // Create user
    try {
      await client.send(new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
        ],
        MessageAction: 'SUPPRESS', // Don't send welcome email
      }));
      console.log(`  ✓ User created`);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'UsernameExistsException') {
        console.log(`  ✓ User already exists`);
      } else {
        throw error;
      }
    }
  }

  // Set permanent password
  try {
    await client.send(new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: email,
      Password: password,
      Permanent: true,
    }));
    console.log(`  ✓ Password set`);
  } catch (error: unknown) {
    console.error(`  ✗ Failed to set password: ${error instanceof Error ? error.message : error}`);
    throw error;
  }

  // Add to groups
  for (const group of groups) {
    try {
      await client.send(new AdminAddUserToGroupCommand({
        UserPoolId: userPoolId,
        Username: email,
        GroupName: group,
      }));
      console.log(`  ✓ Added to group: ${group}`);
    } catch (error: unknown) {
      console.error(`  ✗ Failed to add to group ${group}: ${error instanceof Error ? error.message : error}`);
    }
  }
}

async function main() {
  console.log('=== E2E Test User Setup ===\n');

  const { userPoolId, region } = getAmplifyConfig();
  console.log(`User Pool: ${userPoolId}`);
  console.log(`Region: ${region}`);

  const client = new CognitoIdentityProviderClient({ region });

  // Create regular test user
  await createTestUser(
    client,
    userPoolId,
    testConfig.testUser.email,
    testConfig.testUser.password,
    ['Users'] // Regular users group
  );

  // Create admin test user
  await createTestUser(
    client,
    userPoolId,
    testConfig.adminUser.email,
    testConfig.adminUser.password,
    ['Admins', 'Users'] // Admin group
  );

  console.log('\n=== Setup Complete ===');
  console.log('\nTest users are ready. You can now run E2E tests:');
  console.log('  npm run e2e -- --grep "@core"');
}

main().catch((error) => {
  console.error('\nSetup failed:', error.message);
  process.exit(1);
});
