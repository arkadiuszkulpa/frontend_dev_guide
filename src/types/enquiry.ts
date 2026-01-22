export interface EnquiryFormData {
  // Contact Information (Step 0)
  fullName: string;
  email: string;
  phone: string;
  businessName: string;

  // Business Understanding (Step 1)
  businessDescription: string;

  // Goals (Step 2)
  primaryGoal: string;
  secondaryGoals: string[];

  // Current Situation (Step 3)
  hasExistingWebsite: boolean | null;
  existingWebsiteUrl: string;
  currentChallenges: string[];

  // Audience (Step 4)
  targetAudience: string;
  audienceLocation: string;

  // Content & Features (Step 5)
  contentTypes: string[];
  desiredFeatures: string[];

  // Preferences (Step 6)
  stylePreference: string;
  exampleSites: string[];

  // Timeline & Budget (Step 7)
  urgency: string;
  budgetRange: string;

  // Additional Notes
  additionalNotes: string;
}

export const initialFormData: EnquiryFormData = {
  fullName: '',
  email: '',
  phone: '',
  businessName: '',
  businessDescription: '',
  primaryGoal: '',
  secondaryGoals: [],
  hasExistingWebsite: null,
  existingWebsiteUrl: '',
  currentChallenges: [],
  targetAudience: '',
  audienceLocation: '',
  contentTypes: [],
  desiredFeatures: [],
  stylePreference: '',
  exampleSites: [],
  urgency: '',
  budgetRange: '',
  additionalNotes: '',
};

export const GOAL_OPTIONS = [
  'Sell products or services online',
  'Get more enquiries or leads',
  'Allow customers to book appointments',
  'Show off my work or portfolio',
  'Share information about my business',
  'Build trust and credibility',
  'Keep customers updated with news',
];

export const CHALLENGE_OPTIONS = [
  "It looks outdated",
  "It's hard to update",
  "Customers can't find what they need",
  "It doesn't show up on Google",
  "It's slow or broken",
  "It doesn't work well on phones",
  "I don't have one yet",
];

export const CONTENT_OPTIONS = [
  'Photos of my work or products',
  'Videos',
  'A list of services I offer',
  'Products with prices',
  'Customer reviews or testimonials',
  'Blog posts or articles',
  'Team member profiles',
  'A gallery or portfolio',
];

export const FEATURE_OPTIONS = [
  'Contact form',
  'Online booking or scheduling',
  'Online shop / payments',
  'Photo gallery',
  'Customer reviews',
  'Social media links',
  'Newsletter signup',
  'Live chat',
  'Maps / location',
];

export const STYLE_OPTIONS = [
  { value: 'professional', label: 'Professional & Corporate', description: 'Clean, trustworthy, business-like' },
  { value: 'modern', label: 'Modern & Minimal', description: 'Simple, lots of white space, sleek' },
  { value: 'friendly', label: 'Friendly & Approachable', description: 'Warm, welcoming, personal' },
  { value: 'bold', label: 'Bold & Creative', description: 'Eye-catching, artistic, unique' },
  { value: 'elegant', label: 'Elegant & Luxurious', description: 'Sophisticated, premium feel' },
];

export const URGENCY_OPTIONS = [
  { value: 'no-rush', label: 'No rush', description: 'Whenever it\'s ready' },
  { value: 'few-months', label: 'A few months', description: 'Within 2-3 months' },
  { value: 'few-weeks', label: 'A few weeks', description: 'Within a month' },
  { value: 'asap', label: 'As soon as possible', description: 'I need it urgently' },
];

export const LOCATION_OPTIONS = [
  'Local area only',
  'My city or region',
  'Nationwide',
  'International',
];
