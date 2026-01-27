// ============================================================================
// Type Aliases
// ============================================================================

export type InvolvementLevel = 'do-it-for-me' | 'teach-me-basics' | 'guide-me' | '';
export type AccountManagement = 'you-manage' | 'my-name-you-setup' | 'walk-me-through' | '';
export type WebsiteComplexity = 'simple-static' | 'some-moving-parts' | 'full-featured' | '';
export type PreferredContact = 'email' | 'phone' | 'whatsapp' | '';
export type AssetStatus = 'yes' | 'no' | 'na' | 'not-sure' | 'draft' | 'use-standard' | 'create-from-logo' | 'suggest-for-me' | '';
export type ContentTier = 'core' | 'dynamic' | 'advanced';

// ============================================================================
// Design Assets Interface
// ============================================================================

export interface DesignAssets {
  // Branding
  logo: AssetStatus;
  logoVariations: AssetStatus;
  brandColours: AssetStatus;
  brandFonts: AssetStatus;
  brandGuidelines: AssetStatus;

  // Photography & Imagery
  heroImage: AssetStatus;
  teamPhotos: AssetStatus;
  productPhotos: AssetStatus;
  servicePhotos: AssetStatus;
  locationPhotos: AssetStatus;
  behindScenes: AssetStatus;
  customerPhotos: AssetStatus;
  stockImagery: AssetStatus;

  // Graphics & Visual Elements
  icons: AssetStatus;
  illustrations: AssetStatus;
  infographics: AssetStatus;
  charts: AssetStatus;
  backgrounds: AssetStatus;
  socialGraphics: AssetStatus;
  favicon: AssetStatus;

  // Video & Media
  promoVideo: AssetStatus;
  productDemos: AssetStatus;
  testimonialVideos: AssetStatus;
  backgroundVideo: AssetStatus;
  audioFiles: AssetStatus;

  // Written Content
  homepageText: AssetStatus;
  aboutText: AssetStatus;
  serviceDescriptions: AssetStatus;
  teamBios: AssetStatus;
  testimonials: AssetStatus;
  caseStudies: AssetStatus;
  faqContent: AssetStatus;
  blogPosts: AssetStatus;
  legalText: AssetStatus;
  tagline: AssetStatus;
  callToAction: AssetStatus;

  // Documents & Files
  brochures: AssetStatus;
  priceLists: AssetStatus;
  catalogues: AssetStatus;
  certificates: AssetStatus;
  pressMentions: AssetStatus;

  // Social Proof & Trust Elements
  clientLogos: AssetStatus;
  partnerLogos: AssetStatus;
  certificationBadges: AssetStatus;
  awardLogos: AssetStatus;
  asSeenIn: AssetStatus;
  starRatings: AssetStatus;

  // Existing Digital Assets
  existingContent: AssetStatus;
  domainOwned: AssetStatus;
  emailAccounts: AssetStatus;
  customerDatabase: AssetStatus;
  productDatabase: AssetStatus;
  socialAccounts: AssetStatus;
  googleBusiness: AssetStatus;
}

// ============================================================================
// Main Form Data Interface
// ============================================================================

export interface EnquiryFormData {
  // Step 1: Involvement Level
  involvementLevel: InvolvementLevel;
  accountManagement: AccountManagement;

  // Step 2: Website Complexity
  websiteComplexity: WebsiteComplexity;

  // Step 2b: Features
  corePages: string[];
  corePagesOther: string;
  dynamicFeatures: string[];
  dynamicFeaturesOther: string;
  advancedFeatures: string[];
  advancedFeaturesOther: string;

  // Step 3: AI Features
  aiFeatures: string[];

  // Step 4: Your Business
  businessName: string;
  businessDescription: string;
  competitorWebsites: string[];
  inspirationWebsite: string;
  inspirationReason: string;

  // Step 5: Design Assets
  designAssets: DesignAssets;

  // Step 6: Contact Info
  fullName: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
}

// ============================================================================
// Initial State Factories
// ============================================================================

export function createInitialDesignAssets(): DesignAssets {
  return {
    // Branding
    logo: '',
    logoVariations: '',
    brandColours: '',
    brandFonts: '',
    brandGuidelines: '',

    // Photography & Imagery
    heroImage: '',
    teamPhotos: '',
    productPhotos: '',
    servicePhotos: '',
    locationPhotos: '',
    behindScenes: '',
    customerPhotos: '',
    stockImagery: '',

    // Graphics & Visual Elements
    icons: '',
    illustrations: '',
    infographics: '',
    charts: '',
    backgrounds: '',
    socialGraphics: '',
    favicon: '',

    // Video & Media
    promoVideo: '',
    productDemos: '',
    testimonialVideos: '',
    backgroundVideo: '',
    audioFiles: '',

    // Written Content
    homepageText: '',
    aboutText: '',
    serviceDescriptions: '',
    teamBios: '',
    testimonials: '',
    caseStudies: '',
    faqContent: '',
    blogPosts: '',
    legalText: '',
    tagline: '',
    callToAction: '',

    // Documents & Files
    brochures: '',
    priceLists: '',
    catalogues: '',
    certificates: '',
    pressMentions: '',

    // Social Proof & Trust Elements
    clientLogos: '',
    partnerLogos: '',
    certificationBadges: '',
    awardLogos: '',
    asSeenIn: '',
    starRatings: '',

    // Existing Digital Assets
    existingContent: '',
    domainOwned: '',
    emailAccounts: '',
    customerDatabase: '',
    productDatabase: '',
    socialAccounts: '',
    googleBusiness: '',
  };
}

export function createInitialFormData(): EnquiryFormData {
  return {
    // Step 1: Involvement Level
    involvementLevel: '',
    accountManagement: '',

    // Step 2: Website Complexity
    websiteComplexity: '',

    // Step 2b: Features
    corePages: [],
    corePagesOther: '',
    dynamicFeatures: [],
    dynamicFeaturesOther: '',
    advancedFeatures: [],
    advancedFeaturesOther: '',

    // Step 3: AI Features
    aiFeatures: [],

    // Step 4: Your Business
    businessName: '',
    businessDescription: '',
    competitorWebsites: [],
    inspirationWebsite: '',
    inspirationReason: '',

    // Step 5: Design Assets
    designAssets: createInitialDesignAssets(),

    // Step 6: Contact Info
    fullName: '',
    email: '',
    phone: '',
    preferredContact: '',
  };
}

// For backward compatibility with existing hook
export const initialFormData = createInitialFormData();

// ============================================================================
// Option Constants - Step 1: Involvement Level
// ============================================================================

export const INVOLVEMENT_OPTIONS = [
  {
    value: 'do-it-for-me',
    label: 'Do it for me',
    description: 'You handle everything. I tell you what I want, you make it happen. I contact you for any changes.',
  },
  {
    value: 'teach-me-basics',
    label: 'Teach me the basics',
    description: 'Set things up, but show me how to do simple updates myself (like adding posts or changing text).',
  },
  {
    value: 'guide-me',
    label: 'Guide me through it',
    description: 'I want to do it myself, but I need help when I get stuck. Maybe a call or two.',
  },
];

export const ACCOUNT_MANAGEMENT_OPTIONS = [
  {
    value: 'you-manage',
    label: "You manage everything in your accounts, I don't need access",
  },
  {
    value: 'my-name-you-setup',
    label: 'Set them up in my name, but you do the setup',
  },
  {
    value: 'walk-me-through',
    label: 'Walk me through it so I own and understand it',
  },
];

// ============================================================================
// Option Constants - Step 2: Website Complexity
// ============================================================================

export const COMPLEXITY_OPTIONS = [
  {
    value: 'simple-static',
    label: 'Simple & static',
    description: 'A clean online presence. People find you, see what you do, and contact you. Content rarely changes.',
  },
  {
    value: 'some-moving-parts',
    label: 'Some moving parts',
    description: "Everything above, plus you'll regularly add content or need interactive elements.",
  },
  {
    value: 'full-featured',
    label: 'Full-featured',
    description: 'Everything above, plus manage products, payments, bookings, members, or other advanced needs.',
  },
];

// ============================================================================
// Option Constants - Step 2b: Features (Tiered)
// ============================================================================

export const CORE_PAGE_OPTIONS = [
  { value: 'home', label: 'Home page' },
  { value: 'about', label: 'About me / About us' },
  { value: 'services', label: 'Services or what I offer' },
  { value: 'portfolio', label: 'Portfolio / Gallery / My work' },
  { value: 'contact', label: 'Contact page (basic)' },
  { value: 'faq', label: 'FAQs' },
  { value: 'testimonials', label: 'Testimonials / Reviews' },
  { value: 'pricing', label: 'Pricing page' },
  { value: 'team', label: 'Team / Staff page' },
  { value: 'location', label: 'Location / Map' },
  { value: 'legal', label: 'Terms & Conditions / Privacy Policy' },
  { value: 'core-other', label: 'Other' },
];

export const DYNAMIC_FEATURE_OPTIONS = [
  { value: 'blog', label: 'Blog or news posts' },
  { value: 'case-studies', label: 'Project showcase / case studies' },
  { value: 'events', label: 'Events or announcements' },
  { value: 'jobs', label: 'Job listings / Careers page' },
  { value: 'contact-form', label: 'Contact form with email notifications' },
  { value: 'newsletter', label: 'Newsletter signup' },
  { value: 'external-booking', label: 'Link to external booking (e.g. Calendly)' },
  { value: 'social-feed', label: 'Social media feed integration' },
  { value: 'updatable-gallery', label: 'Image gallery you can update' },
  { value: 'video-embeds', label: 'Video embeds (YouTube, Vimeo)' },
  { value: 'downloads', label: 'Downloadable files (PDFs, brochures)' },
  { value: 'dynamic-other', label: 'Other' },
];

export const ADVANCED_FEATURE_OPTIONS = [
  { value: 'shop', label: 'Online shop / product catalogue' },
  { value: 'cart-checkout', label: 'Shopping cart & checkout' },
  { value: 'payments', label: 'Payment processing (Stripe, PayPal, etc.)' },
  { value: 'calendar-booking', label: 'Appointment or calendar booking (built-in)' },
  { value: 'service-deposits', label: 'Service booking with deposits' },
  { value: 'members-area', label: 'Members-only area / user logins' },
  { value: 'courses', label: 'Course or content library' },
  { value: 'customer-dashboard', label: 'Customer accounts / dashboard' },
  { value: 'subscriptions', label: 'Subscription or recurring payments' },
  { value: 'discount-codes', label: 'Discount codes / promotions' },
  { value: 'inventory', label: 'Inventory management' },
  { value: 'order-tracking', label: 'Order tracking / notifications' },
  { value: 'email-automations', label: 'Email automations (confirmations, reminders, follow-ups)' },
  { value: 'crm', label: 'CRM / customer management' },
  { value: 'reviews-ratings', label: 'Reviews & ratings system' },
  { value: 'wishlist', label: 'Wishlist / favourites' },
  { value: 'live-chat', label: 'Live chat (non-AI)' },
  { value: 'multi-language', label: 'Multi-language support' },
  { value: 'multi-location', label: 'Multi-location / franchise support' },
  { value: 'integrations', label: 'Integration with external tools (Zapier, Mailchimp, etc.)' },
  { value: 'advanced-other', label: 'Other' },
];

// ============================================================================
// Option Constants - Step 3: AI Features
// ============================================================================

export const AI_FEATURE_OPTIONS = [
  { value: 'ai-chatbot', label: 'Chatbot that answers visitor questions automatically' },
  { value: 'ai-assistant', label: 'AI assistant that helps customers find products/services' },
  { value: 'ai-contact-form', label: 'Smart contact form (AI triages, categorises, or auto-responds)' },
  { value: 'ai-search', label: 'AI-powered search on your site' },
  { value: 'ai-content', label: 'Content generation help (AI writes drafts for your blog/products)' },
  { value: 'ai-recommendations', label: 'Personalised recommendations for visitors' },
  { value: 'ai-voice', label: 'Voice assistant integration' },
  { value: 'ai-not-sure', label: 'Not sure — tell me more later' },
  { value: 'ai-none', label: 'No AI features needed' },
];

// ============================================================================
// Option Constants - Step 6: Contact Preferences
// ============================================================================

export const PREFERRED_CONTACT_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

// ============================================================================
// Asset Categories Configuration (for Design Assets step)
// ============================================================================

export interface AssetOption {
  value: string;
  label: string;
}

export interface AssetItem {
  key: keyof DesignAssets;
  label: string;
  options: AssetOption[];
  minTier: ContentTier;
}

export interface AssetCategory {
  key: string;
  title: string;
  tier: ContentTier;
  assets: AssetItem[];
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    key: 'branding',
    title: 'Branding',
    tier: 'core',
    assets: [
      { key: 'logo', label: 'Logo (high resolution, PNG or SVG)', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'brandColours', label: 'Brand colours (hex codes or examples)', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'logoVariations', label: 'Logo variations (light/dark versions)', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'not-sure', label: 'Not sure' }] },
      { key: 'brandFonts', label: 'Brand fonts / typography', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'not-sure', label: 'Not sure' }] },
      { key: 'brandGuidelines', label: 'Brand guidelines document', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    ],
  },
  {
    key: 'photography',
    title: 'Photography & Imagery',
    tier: 'core',
    assets: [
      { key: 'heroImage', label: 'Hero image / main banner', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'teamPhotos', label: 'Team / staff photos', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'productPhotos', label: 'Product photos', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'servicePhotos', label: 'Service photos / action shots', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'locationPhotos', label: 'Location / premises photos', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'stockImagery', label: "Stock imagery you've purchased", minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'behindScenes', label: 'Behind-the-scenes / process photos', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'customerPhotos', label: 'Customer photos (with permission)', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
    ],
  },
  {
    key: 'graphics',
    title: 'Graphics & Visual Elements',
    tier: 'dynamic',
    assets: [
      { key: 'icons', label: 'Icons (custom set)', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'use-standard', label: 'Use standard' }] },
      { key: 'favicon', label: 'Favicon (small browser icon)', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'create-from-logo', label: 'Create from logo' }] },
      { key: 'socialGraphics', label: 'Social media graphics', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'backgrounds', label: 'Background patterns / textures', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'illustrations', label: 'Illustrations', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'infographics', label: 'Infographics', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'charts', label: 'Charts / diagrams', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
    ],
  },
  {
    key: 'video',
    title: 'Video & Media',
    tier: 'advanced',
    assets: [
      { key: 'promoVideo', label: 'Promotional video', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'productDemos', label: 'Product demo videos', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'testimonialVideos', label: 'Testimonial videos', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'backgroundVideo', label: 'Background video (for hero sections)', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'audioFiles', label: 'Audio files (podcasts, music)', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
    ],
  },
  {
    key: 'content',
    title: 'Written Content',
    tier: 'core',
    assets: [
      { key: 'homepageText', label: 'Homepage text', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'draft', label: 'Draft' }, { value: 'no', label: 'No' }] },
      { key: 'aboutText', label: 'About page text', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'draft', label: 'Draft' }, { value: 'no', label: 'No' }] },
      { key: 'serviceDescriptions', label: 'Service/product descriptions', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'draft', label: 'Draft' }, { value: 'no', label: 'No' }] },
      { key: 'tagline', label: 'Tagline / slogan', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'callToAction', label: 'Call-to-action text', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'suggest-for-me', label: 'Suggest for me' }] },
      { key: 'teamBios', label: 'Team member bios', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'draft', label: 'Draft' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'testimonials', label: 'Testimonials / reviews (text)', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'faqContent', label: 'FAQ content', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'blogPosts', label: 'Blog posts (existing)', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'caseStudies', label: 'Case studies', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'legalText', label: 'Legal text (Terms, Privacy Policy)', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    ],
  },
  {
    key: 'documents',
    title: 'Documents & Files',
    tier: 'dynamic',
    assets: [
      { key: 'brochures', label: 'Brochures / PDFs for download', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'priceLists', label: 'Price lists / menus', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'catalogues', label: 'Catalogues', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'certificates', label: 'Certificates / awards', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'pressMentions', label: 'Press mentions / logos', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
    ],
  },
  {
    key: 'socialProof',
    title: 'Social Proof & Trust Elements',
    tier: 'dynamic',
    assets: [
      { key: 'clientLogos', label: 'Client logos (for "trusted by" section)', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'starRatings', label: 'Star ratings / review scores', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'partnerLogos', label: 'Partner logos', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'certificationBadges', label: 'Certification badges', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'awardLogos', label: 'Award logos', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'asSeenIn', label: '"As seen in" media logos', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
    ],
  },
  {
    key: 'digital',
    title: 'Existing Digital Assets',
    tier: 'core',
    assets: [
      { key: 'domainOwned', label: 'Domain name (already owned)', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'socialAccounts', label: 'Social media accounts', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'googleBusiness', label: 'Google Business profile', minTier: 'core', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'existingContent', label: 'Current website content to migrate', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      { key: 'emailAccounts', label: 'Email accounts to keep', minTier: 'dynamic', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'customerDatabase', label: 'Existing customer database', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
      { key: 'productDatabase', label: 'Product database / spreadsheet', minTier: 'advanced', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'na', label: 'N/A' }] },
    ],
  },
];
