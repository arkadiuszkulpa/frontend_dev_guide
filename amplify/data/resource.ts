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
      // Step 1: Involvement Level
      involvementLevel: a.string().required(),
      accountManagement: a.string(),

      // Step 2: Website Complexity
      websiteComplexity: a.string().required(),

      // Step 2b: Features
      corePages: a.string().array().required(),
      corePagesOther: a.string(),
      dynamicFeatures: a.string().array(),
      dynamicFeaturesOther: a.string(),
      advancedFeatures: a.string().array(),
      advancedFeaturesOther: a.string(),

      // Step 3: AI Features
      aiFeatures: a.string().array().required(),

      // Step 4: Your Business
      businessName: a.string(),
      businessDescription: a.string().required(),
      competitorWebsites: a.string().array(),
      inspirationWebsite: a.url(),
      inspirationReason: a.string(),

      // Step 5: Design Assets (stored as JSON blob)
      designAssets: a.json().required(),

      // Step 6: Contact Info
      fullName: a.string().required(),
      email: a.email().required(),
      phone: a.phone().required(),
      preferredContact: a.string().required(),

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
      preferredContact: a.string().required(),
      // Business Information
      businessName: a.string(),
      businessDescription: a.string().required(),
      // Involvement
      involvementLevel: a.string().required(),
      accountManagement: a.string(),
      // Website Complexity + Features
      websiteComplexity: a.string().required(),
      corePages: a.json().required(),
      corePagesOther: a.string(),
      dynamicFeatures: a.json(),
      dynamicFeaturesOther: a.string(),
      advancedFeatures: a.json(),
      advancedFeaturesOther: a.string(),
      // AI Features
      aiFeatures: a.json().required(),
      // Competitor/Inspiration
      competitorWebsites: a.json(),
      inspirationWebsite: a.string(),
      inspirationReason: a.string(),
      // Design Assets
      designAssets: a.json().required(),
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
