import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'enquiryAssets',
  access: (allow) => ({
    // Users can read/write to their own enquiry assets folder
    // Path structure: enquiry-assets/{enquiryId}/{category}/{assetKey}/{filename}
    'enquiry-assets/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
