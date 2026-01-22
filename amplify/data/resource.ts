import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Enquiry: a
    .model({
      // Contact Information
      fullName: a.string().required(),
      email: a.email().required(),
      phone: a.phone().required(),
      businessName: a.string(),

      // Business Understanding
      businessDescription: a.string().required(),

      // Goals
      primaryGoal: a.string().required(),
      secondaryGoals: a.string().array(),

      // Current Situation
      hasExistingWebsite: a.boolean().required(),
      existingWebsiteUrl: a.url(),
      currentChallenges: a.string().array(),

      // Audience
      targetAudience: a.string().required(),
      audienceLocation: a.string().required(),

      // Content & Features
      contentTypes: a.string().array().required(),
      desiredFeatures: a.string().array().required(),

      // Preferences
      stylePreference: a.string().required(),
      exampleSites: a.string().array(),

      // Timeline & Budget
      urgency: a.string().required(),
      budgetRange: a.string(),

      // Additional Notes
      additionalNotes: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});
