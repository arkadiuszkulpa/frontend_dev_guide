# Website Enquiry Form - Specification Document

## Overview

This document specifies a complete redesign of the website enquiry form. The form collects information to generate a quote for web development services.

**Key Design Principles:**
- Non-technical language throughout
- Tiered features (each tier includes all previous tiers)
- AI features as an independent add-on
- Contact info collected last (after user is invested)
- Timeline and budget are OUTPUTS (calculated), not inputs

---

## Form Structure

| Step | Name | Purpose |
|------|------|---------|
| 1 | Involvement Level | How hands-on does the client want to be? |
| 2 | Website Complexity | What tier of website do they need? |
| 2b | Features | Conditional feature selection based on tier |
| 3 | AI Features | Independent add-on tier |
| 4 | Your Business | Business description and competitor/inspiration sites |
| 5 | Design Assets | Comprehensive inventory of available materials |
| 6 | Contact Info | Name, email, phone, preferred contact method |

---

## Step 1: Involvement Level

### File: `01_InvolvementLevel.tsx`

**Title:** "How hands-on do you want to be?"

**Subtitle:** "This affects how we work together and what you'll pay for ongoing changes."

### Main Selection (Radio Group - Required)

| Value | Label | Description |
|-------|-------|-------------|
| `do-it-for-me` | Do it for me | You handle everything. I tell you what I want, you make it happen. I contact you for any changes. |
| `teach-me-basics` | Teach me the basics | Set things up, but show me how to do simple updates myself (like adding posts or changing text). |
| `guide-me` | Guide me through it | I want to do it myself, but I need help when I get stuck. Maybe a call or two. |

### Follow-up Question (Conditional)

**Show if:** `involvementLevel !== 'guide-me'`

**Label:** "For things like buying a domain, setting up hosting, or managing logins—how would you like to handle that?"

| Value | Label |
|-------|-------|
| `you-manage` | You manage everything in your accounts, I don't need access |
| `my-name-you-setup` | Set them up in my name, but you do the setup |
| `walk-me-through` | Walk me through it so I own and understand it |

### TypeScript Interface Addition

```typescript
interface EnquiryFormData {
  // Step 1
  involvementLevel: 'do-it-for-me' | 'teach-me-basics' | 'guide-me' | '';
  accountManagement: 'you-manage' | 'my-name-you-setup' | 'walk-me-through' | '';
  // ... rest of fields
}
```

### Validation

```typescript
function validateInvolvementLevel(formData: EnquiryFormData): boolean {
  if (formData.involvementLevel === '') return false;
  if (formData.involvementLevel !== 'guide-me' && formData.accountManagement === '') return false;
  return true;
}
```

---

## Step 2: Website Complexity

### File: `02_WebsiteComplexity.tsx`

**Title:** "What kind of website do you need?"

**Subtitle:** (none)

### Main Selection (Radio Group - Required)

| Value | Label | Description |
|-------|-------|-------------|
| `simple-static` | Simple & static | A clean online presence. People find you, see what you do, and contact you. Content rarely changes. |
| `some-moving-parts` | Some moving parts | Everything above, plus you'll regularly add content or need interactive elements. |
| `full-featured` | Full-featured | Everything above, plus manage products, payments, bookings, members, or other advanced needs. |

### TypeScript Interface Addition

```typescript
interface EnquiryFormData {
  // Step 2
  websiteComplexity: 'simple-static' | 'some-moving-parts' | 'full-featured' | '';
  // ... rest of fields
}
```

### Validation

```typescript
function validateWebsiteComplexity(formData: EnquiryFormData): boolean {
  return formData.websiteComplexity !== '';
}
```

---

## Step 2b: Features (Conditional)

### File: `02b_Features.tsx`

This step shows different feature checkboxes based on the tier selected in Step 2. Features are CUMULATIVE - each tier includes all features from previous tiers.

### Tier 1: Core Pages (Always Shown)

**Section Title:** "What pages do you need?"
**Subtitle:** "Select all that apply"

| Value | Label |
|-------|-------|
| `home` | Home page |
| `about` | About me / About us |
| `services` | Services or what I offer |
| `portfolio` | Portfolio / Gallery / My work |
| `contact` | Contact page (basic) |
| `faq` | FAQs |
| `testimonials` | Testimonials / Reviews |
| `pricing` | Pricing page |
| `team` | Team / Staff page |
| `location` | Location / Map |
| `legal` | Terms & Conditions / Privacy Policy |
| `core-other` | Other (with text input) |

### Tier 2: Dynamic Content (Show if `some-moving-parts` or `full-featured`)

**Section Title:** "What do you need to regularly update or manage?"
**Subtitle:** "Select all that apply"

| Value | Label |
|-------|-------|
| `blog` | Blog or news posts |
| `case-studies` | Project showcase / case studies |
| `events` | Events or announcements |
| `jobs` | Job listings / Careers page |
| `contact-form` | Contact form with email notifications |
| `newsletter` | Newsletter signup |
| `external-booking` | Link to external booking (e.g. Calendly) |
| `social-feed` | Social media feed integration |
| `updatable-gallery` | Image gallery you can update |
| `video-embeds` | Video embeds (YouTube, Vimeo) |
| `downloads` | Downloadable files (PDFs, brochures) |
| `dynamic-other` | Other (with text input) |

### Tier 3: Advanced Functionality (Show only if `full-featured`)

**Section Title:** "What advanced features do you need?"
**Subtitle:** "Select all that apply"

| Value | Label |
|-------|-------|
| `shop` | Online shop / product catalogue |
| `cart-checkout` | Shopping cart & checkout |
| `payments` | Payment processing (Stripe, PayPal, etc.) |
| `calendar-booking` | Appointment or calendar booking (built-in) |
| `service-deposits` | Service booking with deposits |
| `members-area` | Members-only area / user logins |
| `courses` | Course or content library |
| `customer-dashboard` | Customer accounts / dashboard |
| `subscriptions` | Subscription or recurring payments |
| `discount-codes` | Discount codes / promotions |
| `inventory` | Inventory management |
| `order-tracking` | Order tracking / notifications |
| `email-automations` | Email automations (confirmations, reminders, follow-ups) |
| `crm` | CRM / customer management |
| `reviews-ratings` | Reviews & ratings system |
| `wishlist` | Wishlist / favourites |
| `live-chat` | Live chat (non-AI) |
| `multi-language` | Multi-language support |
| `multi-location` | Multi-location / franchise support |
| `integrations` | Integration with external tools (Zapier, Mailchimp, etc.) |
| `advanced-other` | Other (with text input) |

### TypeScript Interface Addition

```typescript
interface EnquiryFormData {
  // Step 2b
  corePages: string[];
  corePagesOther: string;
  dynamicFeatures: string[];
  dynamicFeaturesOther: string;
  advancedFeatures: string[];
  advancedFeaturesOther: string;
  // ... rest of fields
}
```

### Validation

```typescript
function validateFeatures(formData: EnquiryFormData): boolean {
  // Must select at least one core page
  return formData.corePages.length > 0;
}
```

---

## Step 3: AI Features

### File: `03_AIFeatures.tsx`

**Title:** "Are you interested in AI-powered features?"

**Subtitle:** "These can be added to any type of website."

### Selection (Checkbox Group)

| Value | Label |
|-------|-------|
| `ai-chatbot` | Chatbot that answers visitor questions automatically |
| `ai-assistant` | AI assistant that helps customers find products/services |
| `ai-contact-form` | Smart contact form (AI triages, categorises, or auto-responds) |
| `ai-search` | AI-powered search on your site |
| `ai-content` | Content generation help (AI writes drafts for your blog/products) |
| `ai-recommendations` | Personalised recommendations for visitors |
| `ai-voice` | Voice assistant integration |
| `ai-not-sure` | Not sure — tell me more later |
| `ai-none` | No AI features needed |

**Note:** If `ai-none` is selected, deselect all other options. If any other option is selected, deselect `ai-none`.

### TypeScript Interface Addition

```typescript
interface EnquiryFormData {
  // Step 3
  aiFeatures: string[];
  // ... rest of fields
}
```

### Validation

```typescript
function validateAIFeatures(formData: EnquiryFormData): boolean {
  // Must make a selection (even if "none")
  return formData.aiFeatures.length > 0;
}
```

---

## Step 4: Your Business

### File: `04_YourBusiness.tsx`

**Title:** "Tell us about your business"

**Subtitle:** (none)

### Fields

#### Business Name (Text Input - Optional)
- **Label:** "Business name"
- **Placeholder:** "My Business Ltd"

#### Business Description (TextArea - Required)
- **Label:** "Describe what you do"
- **Placeholder:** "For example: I run a small bakery in Manchester. We make fresh bread, pastries, and custom cakes for special occasions. We've been in business for 3 years."
- **Rows:** 4
- **Helper text:** "2-3 sentences is perfect"

#### Competitor Websites (Dynamic List - Optional, max 3)
- **Label:** "Who are your competitors?"
- **Helper text:** "Share up to 3 competitor websites so we understand your market."
- **Placeholder:** "https://www.example.com"

#### Inspiration Website (Text Input - Optional)
- **Label:** "Any websites you like the look of?"
- **Helper text:** "Can be the same as a competitor, or completely different."
- **Placeholder:** "https://www.example.com"

#### Inspiration Reason (TextArea - Conditional, show if inspiration URL provided)
- **Label:** "What do you like about it?"
- **Placeholder:** "e.g. the layout, colours, how it feels, specific features..."
- **Rows:** 3

### TypeScript Interface Addition

```typescript
interface EnquiryFormData {
  // Step 4
  businessName: string;
  businessDescription: string;
  competitorWebsites: string[]; // max 3
  inspirationWebsite: string;
  inspirationReason: string;
  // ... rest of fields
}
```

### Validation

```typescript
function validateYourBusiness(formData: EnquiryFormData): boolean {
  return formData.businessDescription.trim().length >= 10;
}
```

---

## Step 5: Design Assets

### File: `05_DesignAssets.tsx`

**Title:** "What materials do you have ready?"

**Subtitle:** "Anything you don't have, we can help create — but design work is quoted separately from the website build."

Each asset has three possible states:
- `yes` - "Yes, I have it ready" / "Yes"
- `no` - "No, I need one" / "No, I need help" / "No"
- `na` - "N/A" (not applicable)

Some assets have only `yes`/`no` options (no N/A).

### Asset Categories and Items

#### Branding

| Key | Label | Options |
|-----|-------|---------|
| `logo` | Logo (high resolution, PNG or SVG) | yes / no |
| `logoVariations` | Logo variations (light/dark versions) | yes / no / not-sure |
| `brandColours` | Brand colours (hex codes or examples) | yes / no |
| `brandFonts` | Brand fonts / typography | yes / no / not-sure |
| `brandGuidelines` | Brand guidelines document | yes / no |

#### Photography & Imagery

| Key | Label | Options |
|-----|-------|---------|
| `heroImage` | Hero image / main banner | yes / no |
| `teamPhotos` | Team / staff photos | yes / no / na |
| `productPhotos` | Product photos | yes / no / na |
| `servicePhotos` | Service photos / action shots | yes / no / na |
| `locationPhotos` | Location / premises photos | yes / no / na |
| `behindScenes` | Behind-the-scenes / process photos | yes / no / na |
| `customerPhotos` | Customer photos (with permission) | yes / no / na |
| `stockImagery` | Stock imagery you've purchased | yes / no |

#### Graphics & Visual Elements

| Key | Label | Options |
|-----|-------|---------|
| `icons` | Icons (custom set) | yes / use-standard |
| `illustrations` | Illustrations | yes / no / na |
| `infographics` | Infographics | yes / no / na |
| `charts` | Charts / diagrams | yes / no / na |
| `backgrounds` | Background patterns / textures | yes / no |
| `socialGraphics` | Social media graphics | yes / no |
| `favicon` | Favicon (small browser icon) | yes / create-from-logo |

#### Video & Media

| Key | Label | Options |
|-----|-------|---------|
| `promoVideo` | Promotional video | yes / no / na |
| `productDemos` | Product demo videos | yes / no / na |
| `testimonialVideos` | Testimonial videos | yes / no / na |
| `backgroundVideo` | Background video (for hero sections) | yes / no / na |
| `audioFiles` | Audio files (podcasts, music) | yes / no / na |

#### Written Content

| Key | Label | Options |
|-----|-------|---------|
| `homepageText` | Homepage text | yes / draft / no |
| `aboutText` | About page text | yes / draft / no |
| `serviceDescriptions` | Service/product descriptions | yes / draft / no |
| `teamBios` | Team member bios | yes / draft / no / na |
| `testimonials` | Testimonials / reviews (text) | yes / no |
| `caseStudies` | Case studies | yes / no / na |
| `faqContent` | FAQ content | yes / no |
| `blogPosts` | Blog posts (existing) | yes / no |
| `legalText` | Legal text (Terms, Privacy Policy) | yes / no |
| `tagline` | Tagline / slogan | yes / no |
| `callToAction` | Call-to-action text | yes / suggest-for-me |

#### Documents & Files

| Key | Label | Options |
|-----|-------|---------|
| `brochures` | Brochures / PDFs for download | yes / no / na |
| `priceLists` | Price lists / menus | yes / no / na |
| `catalogues` | Catalogues | yes / no / na |
| `certificates` | Certificates / awards | yes / no / na |
| `pressMentions` | Press mentions / logos | yes / no / na |

#### Social Proof & Trust Elements

| Key | Label | Options |
|-----|-------|---------|
| `clientLogos` | Client logos (for "trusted by" section) | yes / no / na |
| `partnerLogos` | Partner logos | yes / no / na |
| `certificationBadges` | Certification badges | yes / no / na |
| `awardLogos` | Award logos | yes / no / na |
| `asSeenIn` | "As seen in" media logos | yes / no / na |
| `starRatings` | Star ratings / review scores | yes / no |

#### Existing Digital Assets

| Key | Label | Options |
|-----|-------|---------|
| `existingContent` | Current website content to migrate | yes / no |
| `domainOwned` | Domain name (already owned) | yes / no |
| `emailAccounts` | Email accounts to keep | yes / no / na |
| `customerDatabase` | Existing customer database | yes / no / na |
| `productDatabase` | Product database / spreadsheet | yes / no / na |
| `socialAccounts` | Social media accounts | yes / no |
| `googleBusiness` | Google Business profile | yes / no |

### Footer Note

Display at the bottom of this step:

> **Note:** Any assets marked "No" or "I need help" may require additional design or copywriting work, quoted separately from the website build.

### TypeScript Interface Addition

```typescript
type AssetStatus = 'yes' | 'no' | 'na' | 'not-sure' | 'draft' | 'use-standard' | 'create-from-logo' | 'suggest-for-me' | '';

interface DesignAssets {
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

interface EnquiryFormData {
  // Step 5
  designAssets: DesignAssets;
  // ... rest of fields
}
```

### Validation

```typescript
function validateDesignAssets(formData: EnquiryFormData): boolean {
  // At minimum, must answer about logo and brand colours
  const assets = formData.designAssets;
  return assets.logo !== '' && assets.brandColours !== '';
}
```

---

## Step 6: Contact Info

### File: `06_ContactInfo.tsx`

**Title:** "Last step — how do we reach you?"

**Subtitle:** (none)

### Fields

#### Full Name (Text Input - Required)
- **Label:** "Your full name"
- **Placeholder:** "John Smith"

#### Email (Email Input - Required)
- **Label:** "Email address"
- **Placeholder:** "john@example.com"

#### Phone (Tel Input - Required)
- **Label:** "Phone number"
- **Placeholder:** "+44 7700 900000"

#### Preferred Contact Method (Radio Group - Required)
- **Label:** "How would you prefer we contact you?"
- **Options:**
  - `email` - Email
  - `phone` - Phone
  - `whatsapp` - WhatsApp

### TypeScript Interface Addition

```typescript
interface EnquiryFormData {
  // Step 6
  fullName: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'whatsapp' | '';
  // ... rest of fields
}
```

### Validation

```typescript
function validateContactInfo(formData: EnquiryFormData): boolean {
  return (
    formData.fullName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.preferredContact !== ''
  );
}
```

---

## Complete TypeScript Interface

### File: `types/enquiry.ts`

```typescript
export type InvolvementLevel = 'do-it-for-me' | 'teach-me-basics' | 'guide-me' | '';
export type AccountManagement = 'you-manage' | 'my-name-you-setup' | 'walk-me-through' | '';
export type WebsiteComplexity = 'simple-static' | 'some-moving-parts' | 'full-featured' | '';
export type PreferredContact = 'email' | 'phone' | 'whatsapp' | '';
export type AssetStatus = 'yes' | 'no' | 'na' | 'not-sure' | 'draft' | 'use-standard' | 'create-from-logo' | 'suggest-for-me' | '';

export interface DesignAssets {
  // All fields as defined in Step 5 above
  [key: string]: AssetStatus;
}

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

// Feature options constants
export const CORE_PAGE_OPTIONS = [
  'Home page',
  'About me / About us',
  'Services or what I offer',
  'Portfolio / Gallery / My work',
  'Contact page (basic)',
  'FAQs',
  'Testimonials / Reviews',
  'Pricing page',
  'Team / Staff page',
  'Location / Map',
  'Terms & Conditions / Privacy Policy',
];

export const DYNAMIC_FEATURE_OPTIONS = [
  'Blog or news posts',
  'Project showcase / case studies',
  'Events or announcements',
  'Job listings / Careers page',
  'Contact form with email notifications',
  'Newsletter signup',
  'Link to external booking (e.g. Calendly)',
  'Social media feed integration',
  'Image gallery you can update',
  'Video embeds (YouTube, Vimeo)',
  'Downloadable files (PDFs, brochures)',
];

export const ADVANCED_FEATURE_OPTIONS = [
  'Online shop / product catalogue',
  'Shopping cart & checkout',
  'Payment processing (Stripe, PayPal, etc.)',
  'Appointment or calendar booking (built-in)',
  'Service booking with deposits',
  'Members-only area / user logins',
  'Course or content library',
  'Customer accounts / dashboard',
  'Subscription or recurring payments',
  'Discount codes / promotions',
  'Inventory management',
  'Order tracking / notifications',
  'Email automations (confirmations, reminders, follow-ups)',
  'CRM / customer management',
  'Reviews & ratings system',
  'Wishlist / favourites',
  'Live chat (non-AI)',
  'Multi-language support',
  'Multi-location / franchise support',
  'Integration with external tools (Zapier, Mailchimp, etc.)',
];

export const AI_FEATURE_OPTIONS = [
  'Chatbot that answers visitor questions automatically',
  'AI assistant that helps customers find products/services',
  'Smart contact form (AI triages, categorises, or auto-responds)',
  'AI-powered search on your site',
  'Content generation help (AI writes drafts for your blog/products)',
  'Personalised recommendations for visitors',
  'Voice assistant integration',
  'Not sure — tell me more later',
  'No AI features needed',
];

export const INVOLVEMENT_OPTIONS = [
  { value: 'do-it-for-me', label: 'Do it for me', description: 'You handle everything. I tell you what I want, you make it happen. I contact you for any changes.' },
  { value: 'teach-me-basics', label: 'Teach me the basics', description: 'Set things up, but show me how to do simple updates myself (like adding posts or changing text).' },
  { value: 'guide-me', label: 'Guide me through it', description: 'I want to do it myself, but I need help when I get stuck. Maybe a call or two.' },
];

export const ACCOUNT_MANAGEMENT_OPTIONS = [
  { value: 'you-manage', label: 'You manage everything in your accounts, I don\'t need access' },
  { value: 'my-name-you-setup', label: 'Set them up in my name, but you do the setup' },
  { value: 'walk-me-through', label: 'Walk me through it so I own and understand it' },
];

export const COMPLEXITY_OPTIONS = [
  { value: 'simple-static', label: 'Simple & static', description: 'A clean online presence. People find you, see what you do, and contact you. Content rarely changes.' },
  { value: 'some-moving-parts', label: 'Some moving parts', description: 'Everything above, plus you\'ll regularly add content or need interactive elements.' },
  { value: 'full-featured', label: 'Full-featured', description: 'Everything above, plus manage products, payments, bookings, members, or other advanced needs.' },
];

export const PREFERRED_CONTACT_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
];
```

---

## Files to Delete

The following files from the original form are no longer needed:

- `03_Goals.tsx` - Absorbed into Features (Step 2b)
- `04_CurrentSituation.tsx` - Removed (not needed for quoting)
- `05_Audience.tsx` - Removed (overkill for intake)
- `06_ContentFeatures.tsx` - Replaced by Features (Step 2b)
- `07_StylePreferences.tsx` - Removed (competitor/inspiration sites cover this)
- `08_Timeline.tsx` - Removed (will be calculated output, not input)

---

## Files to Create

| New File | Based On | Notes |
|----------|----------|-------|
| `01_InvolvementLevel.tsx` | New | New step |
| `02_WebsiteComplexity.tsx` | New | New step |
| `02b_Features.tsx` | Partial from `06_ContentFeatures.tsx` | Tiered, conditional features |
| `03_AIFeatures.tsx` | New | Independent tier |
| `04_YourBusiness.tsx` | Partial from `02_BusinessType.tsx` | Expanded with competitors/inspiration |
| `05_DesignAssets.tsx` | New | Comprehensive asset inventory |
| `06_ContactInfo.tsx` | Modified from `01_ContactInfo.tsx` | Add preferred contact method |

---

## Form Flow Logic

```
Step 1: Involvement Level
    ↓
    If NOT "guide-me" → Show account management follow-up
    ↓
Step 2: Website Complexity
    ↓
Step 2b: Features
    ├── Always show: Tier 1 (Core Pages)
    ├── If "some-moving-parts" OR "full-featured": Also show Tier 2 (Dynamic)
    └── If "full-featured": Also show Tier 3 (Advanced)
    ↓
Step 3: AI Features (always shown, independent)
    ↓
Step 4: Your Business
    ↓
    If inspiration URL provided → Show "what do you like about it" field
    ↓
Step 5: Design Assets
    ↓
Step 6: Contact Info
    ↓
[Submit → Generate Quote]
```

---

## UI Components Needed

The form will need these reusable components:

1. **RadioGroup** - Single selection with optional descriptions (already exists)
2. **CheckboxGroup** - Multi-selection (already exists)
3. **TextInput** - Single line text (already exists)
4. **TextArea** - Multi-line text (already exists)
5. **DynamicUrlList** - Add/remove URLs with max limit (needed for competitors)
6. **AssetStatusSelector** - Custom component for yes/no/na selection per asset
7. **FormCard** - Card wrapper with title/subtitle (already exists)

---

## Notes for Implementation

1. **Preserve existing component patterns** - Use the same styling and structure as existing `FormCard`, `TextInput`, etc.

2. **Update the main form controller** - The step navigation logic needs to account for the conditional Step 2b content.

3. **Create initial state factory** - A function to create a blank `EnquiryFormData` object with all empty defaults.

4. **Design Assets UI** - Consider grouping by category with collapsible sections to avoid overwhelming users.

5. **Validation per step** - Each step should have its own validation function that returns boolean.

6. **Summary/Review step** - Consider adding a final review step before submission showing all selections (not specified here but recommended).