import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  // Admin-only access initially - users must be created manually in Cognito
  // Self-registration can be enabled later for client access
});
