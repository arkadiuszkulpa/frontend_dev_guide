# Content Requirements Architecture

## Overview

This document defines the relationship between **Website Complexity** → **Features** → **Required Digital Content**.

This architecture serves two purposes:
1. **Form UX**: Only ask users for content relevant to their website tier
2. **Admin Tracking**: Checklist for tracking content delivery before project start

---

## Tier Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WEBSITE COMPLEXITY                                 │
├─────────────────┬─────────────────────┬─────────────────────────────────────┤
│  SIMPLE &       │  SOME MOVING        │  FULL-FEATURED                      │
│  STATIC         │  PARTS              │                                     │
│                 │                     │                                     │
│  Brochure site  │  + Dynamic content  │  + E-commerce / Bookings / Members  │
└────────┬────────┴──────────┬──────────┴──────────────────┬──────────────────┘
         │                   │                              │
         ▼                   ▼                              ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────────────┐
│  CORE FEATURES  │  │ DYNAMIC FEATURES│  │  ADVANCED FEATURES                  │
│  (Always)       │  │ (Tier 2+)       │  │  (Tier 3 only)                      │
└────────┬────────┘  └────────┬────────┘  └──────────────────┬──────────────────┘
         │                    │                               │
         ▼                    ▼                               ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────────────┐
│  CORE CONTENT   │  │ DYNAMIC CONTENT │  │  ADVANCED CONTENT                   │
└─────────────────┘  └─────────────────┘  └─────────────────────────────────────┘
```

---

## Feature → Content Mapping

### CORE FEATURES (All Tiers)

| Feature | Required Content |
|---------|------------------|
| **Home page** | Homepage text, Hero image, Tagline, Call-to-action |
| **About page** | About text, Team photos (optional) |
| **Services page** | Service descriptions, Service photos |
| **Portfolio/Gallery** | Portfolio images, Project descriptions |
| **Contact page** | Contact details, Location/map info |
| **FAQs** | FAQ content (Q&A pairs) |
| **Testimonials** | Testimonial text, Customer photos (optional) |
| **Pricing page** | Price list content |
| **Team page** | Team bios, Team photos |
| **Location/Map** | Address, Location photos |
| **Legal pages** | Terms & Conditions, Privacy Policy |

**Always Required (regardless of features):**
- Logo
- Brand colours

---

### DYNAMIC FEATURES (Tier 2+)

| Feature | Required Content |
|---------|------------------|
| **Blog/News** | Blog posts (initial), Featured images |
| **Case Studies** | Case study content, Project photos, Results/metrics |
| **Events** | Event descriptions, Event images |
| **Job Listings** | Job descriptions, Company culture content |
| **Contact Form** | Form fields specification, Thank-you message |
| **Newsletter** | Signup incentive copy, Welcome email content |
| **External Booking** | Booking link, Service descriptions |
| **Social Feed** | Social account links |
| **Updatable Gallery** | Gallery images (initial set) |
| **Video Embeds** | Video files or YouTube/Vimeo links |
| **Downloads** | PDF brochures, Downloadable files |

**Additional Content for Tier 2+:**
- Logo variations (light/dark)
- Brand fonts
- Social media graphics
- Icons (or approval to use standard)
- Favicon

---

### ADVANCED FEATURES (Tier 3 only)

| Feature | Required Content |
|---------|------------------|
| **Online Shop** | Product photos, Product descriptions, Pricing |
| **Cart & Checkout** | Shipping info, Return policy |
| **Payments** | Payment method details |
| **Calendar Booking** | Service durations, Availability rules |
| **Service Deposits** | Deposit amounts, Cancellation policy |
| **Members Area** | Membership tier descriptions, Welcome content |
| **Courses/Content Library** | Course content, Module structure |
| **Customer Dashboard** | Account feature descriptions |
| **Subscriptions** | Subscription tier details, Benefits |
| **Discount Codes** | Promo code strategy (optional) |
| **Inventory** | Product database/spreadsheet |
| **Order Tracking** | Notification templates |
| **Email Automations** | Email copy for each automation |
| **CRM** | Customer data import (if existing) |
| **Reviews System** | Review collection strategy |
| **Wishlist** | (No content needed) |
| **Live Chat** | Chat greeting, FAQ responses |
| **Multi-language** | Translated content |
| **Multi-location** | Location-specific content per site |
| **Integrations** | Account credentials, API keys |

**Additional Content for Tier 3:**
- Brand guidelines document
- Product demo videos
- Promotional video
- Customer database (if migrating)
- Product database

---

## Content Categories by Tier

### SIMPLE & STATIC - Content Checklist

| Category | Items |
|----------|-------|
| **Branding** | Logo, Brand colours |
| **Photography** | Hero image |
| **Written Content** | Homepage text, About text, Service descriptions, Tagline, Call-to-action |
| **Digital Setup** | Domain ownership, Social accounts, Google Business |

**Total: ~10 items**

---

### SOME MOVING PARTS - Content Checklist

*Includes everything from Simple & Static, plus:*

| Category | Items |
|----------|-------|
| **Branding** | Logo variations, Brand fonts, Favicon |
| **Photography** | Team photos, Product/Service photos, Location photos |
| **Graphics** | Icons (or use standard), Social graphics |
| **Written Content** | FAQ content, Blog posts, Testimonials, Team bios |
| **Documents** | Brochures/PDFs, Price lists |
| **Social Proof** | Client logos, Star ratings |
| **Digital Setup** | Email accounts |

**Total: ~25 items**

---

### FULL-FEATURED - Content Checklist

*Includes everything from Some Moving Parts, plus:*

| Category | Items |
|----------|-------|
| **Branding** | Brand guidelines document |
| **Photography** | Behind-the-scenes, Customer photos |
| **Graphics** | Infographics, Charts, Illustrations |
| **Video & Media** | Promo video, Product demos, Testimonial videos |
| **Written Content** | Case studies, Legal text |
| **Documents** | Catalogues, Certificates |
| **Social Proof** | Partner logos, Certification badges, Award logos, Press mentions |
| **Digital Setup** | Customer database, Product database |

**Total: ~43 items (all)**

---

## AI Features → Content Requirements

AI features are independent add-ons. If selected, they require additional content:

| AI Feature | Required Content |
|------------|------------------|
| **Chatbot (basic Q&A)** | FAQ content (minimum 10-20 Q&A pairs), Common questions list |
| **AI Sales Assistant** | Product/service database, Pricing rules, Sales scripts/objection handling |
| **Smart Contact Form** | Triage categories, Auto-response templates, Routing rules |
| **AI-powered Search** | (Uses existing site content - no extra needed) |
| **Content Generation** | Brand voice guidelines, Example content, Topics list |
| **Personalised Recommendations** | Product categories, Customer segments |
| **Voice Assistant** | Voice script, Conversation flows |

---

## Admin Tracking Schema

For the member area / admin panel to track content delivery:

```typescript
interface ContentDeliveryTracker {
  enquiryId: string;
  websiteComplexity: 'simple-static' | 'some-moving-parts' | 'full-featured';

  // Each content item
  items: {
    [contentKey: string]: {
      required: boolean;       // Based on complexity + features selected
      status: 'pending' | 'received' | 'approved' | 'needs-revision';
      receivedDate?: Date;
      notes?: string;
      fileUrl?: string;        // If uploaded
    }
  };

  // Summary
  totalRequired: number;
  totalReceived: number;
  readyToStart: boolean;       // All required items received
}
```

---

## Feature-Triggered Content (Granular Mapping)

Content items can be triggered by **specific features** selected in Step 2b, not just by complexity tier.

### Two-Level Filtering

1. **Tier-Based**: Always-required items based on complexity (logo, brand colours, hero image)
2. **Feature-Triggered**: Only shown if specific feature is selected

### Feature → Content Asset Mapping

#### Core Pages (Step 2b Tier 1)

| Feature Value | Triggers Content Assets |
|---------------|------------------------|
| `home` | homepageText, heroImage, tagline, callToAction |
| `about` | aboutText |
| `services` | serviceDescriptions, servicePhotos |
| `portfolio` | productPhotos, behindScenes |
| `faq` | faqContent |
| `testimonials` | testimonials, customerPhotos, clientLogos, starRatings |
| `pricing` | priceLists |
| `team` | teamBios, teamPhotos |
| `location` | locationPhotos |
| `legal` | legalText |

#### Dynamic Features (Step 2b Tier 2)

| Feature Value | Triggers Content Assets |
|---------------|------------------------|
| `blog` | blogPosts |
| `case-studies` | caseStudies, behindScenes |
| `social-feed` | socialAccounts, socialGraphics |
| `updatable-gallery` | productPhotos, servicePhotos |
| `video-embeds` | promoVideo, productDemos, testimonialVideos, backgroundVideo, audioFiles |
| `downloads` | brochures |

#### Advanced Features (Step 2b Tier 3)

| Feature Value | Triggers Content Assets |
|---------------|------------------------|
| `shop` | productPhotos, productDatabase, catalogues |
| `customer-dashboard` | customerDatabase |
| `inventory` | productDatabase |
| `crm` | customerDatabase |
| `reviews-ratings` | starRatings |
| `live-chat` | faqContent |
| `multi-location` | locationPhotos |
| `members-area` | customerDatabase |

#### AI Features (Step 3)

| Feature Value | Triggers Content Assets |
|---------------|------------------------|
| `ai-chatbot` | faqContent |
| `ai-assistant` | productDatabase, serviceDescriptions |

### Always Tier-Based (No Feature Trigger)

These items show based on complexity tier only:

**Core (Always):**
- logo, brandColours
- heroImage
- homepageText, aboutText, serviceDescriptions
- tagline, callToAction
- domainOwned, socialAccounts, googleBusiness

**Dynamic Tier:**
- logoVariations, brandFonts
- favicon, icons
- backgrounds, stockImagery
- existingContent, emailAccounts

**Advanced Tier:**
- brandGuidelines
- partnerLogos, certificationBadges, awardLogos, asSeenIn
- illustrations, infographics, charts

---

## Implementation Notes

### Types (enquiry.ts)

```typescript
interface AssetItem {
  key: keyof DesignAssets;
  label: string;
  options: AssetOption[];
  minTier: 'core' | 'dynamic' | 'advanced';
  requiredFeatures?: string[];  // If set, only show when ANY of these features selected
}
```

### Filtering Logic (05_DesignAssets.tsx)

```typescript
function getVisibleCategories(
  complexity: WebsiteComplexity,
  corePages: string[],
  dynamicFeatures: string[],
  advancedFeatures: string[],
  aiFeatures: string[]
) {
  const selectedFeatures = [...corePages, ...dynamicFeatures, ...advancedFeatures, ...aiFeatures];

  return ASSET_CATEGORIES
    .filter(cat => tierAllowed(cat.tier, complexity))
    .map(cat => ({
      ...cat,
      assets: cat.assets.filter(asset => {
        if (!tierAllowed(asset.minTier, complexity)) return false;
        if (!asset.requiredFeatures) return true;  // Tier-based only
        return asset.requiredFeatures.some(f => selectedFeatures.includes(f));
      })
    }))
    .filter(cat => cat.assets.length > 0);
}
```

### Future: Admin Content Tracker

When building the admin panel, use this architecture to:
1. Generate a checklist based on enquiry's complexity + features selected
2. Allow marking items as received/approved
3. Show "Ready to Start" indicator when all required items collected
4. Track what's missing before project kickoff
