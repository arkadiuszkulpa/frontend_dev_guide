import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';

// Define the send email function for the data schema
export const sendEmailHandler = defineFunction({
  name: 'send-confirmation-email',
  entry: '../functions/send-confirmation-email/handler.ts',
  environment: {
    SENDER_EMAIL: 'admin@arkadiuszkulpa.co.uk',
  },
  timeoutSeconds: 30,
});

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

      // Admin tracking fields
      status: a.enum(['new', 'in_review', 'contacted', 'quoted', 'accepted', 'declined', 'completed']),
      lastContactedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['create', 'read']),
      allow.authenticated('userPools'),
    ]),

  EnquiryNote: a
    .model({
      enquiryId: a.id().required(),
      content: a.string().required(),
      createdBy: a.string().required(),
      noteType: a.enum(['context', 'call_summary', 'quote_sent', 'follow_up', 'general']),
    })
    .authorization((allow) => [allow.authenticated('userPools')]),

  // Custom mutation to send confirmation email
  sendConfirmationEmail: a
    .mutation()
    .arguments({
      enquiryId: a.string().required(),
      // Contact Information
      fullName: a.string().required(),
      email: a.string().required(),
      phone: a.string().required(),
      businessName: a.string(),
      // Business Understanding
      businessDescription: a.string().required(),
      // Goals
      primaryGoal: a.string().required(),
      secondaryGoals: a.json(),
      // Current Situation
      hasExistingWebsite: a.boolean().required(),
      existingWebsiteUrl: a.string(),
      currentChallenges: a.json(),
      // Audience
      targetAudience: a.string().required(),
      audienceLocation: a.string().required(),
      // Content & Features
      contentTypes: a.json().required(),
      desiredFeatures: a.json().required(),
      // Preferences
      stylePreference: a.string().required(),
      exampleSites: a.json(),
      // Timeline & Budget
      urgency: a.string().required(),
      budgetRange: a.string(),
      // Additional Notes
      additionalNotes: a.string(),
    })
    .returns(a.boolean())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(sendEmailHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
