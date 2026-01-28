import { useTranslation } from 'react-i18next';

interface Option {
  value: string;
  label: string;
  description?: string;
}

export function useInvolvementOptions(): Option[] {
  const { t } = useTranslation('form');

  return [
    {
      value: 'do-it-for-me',
      label: t('options.involvement.doItForMe.label'),
      description: t('options.involvement.doItForMe.description'),
    },
    {
      value: 'teach-me-basics',
      label: t('options.involvement.teachMeBasics.label'),
      description: t('options.involvement.teachMeBasics.description'),
    },
    {
      value: 'guide-me',
      label: t('options.involvement.guideMe.label'),
      description: t('options.involvement.guideMe.description'),
    },
  ];
}

export function useAccountManagementOptions(): Option[] {
  const { t } = useTranslation('form');

  return [
    {
      value: 'you-manage',
      label: t('options.accountManagement.youManage'),
    },
    {
      value: 'my-name-you-setup',
      label: t('options.accountManagement.myNameYouSetup'),
    },
    {
      value: 'walk-me-through',
      label: t('options.accountManagement.walkMeThrough'),
    },
  ];
}

export function useComplexityOptions(): Option[] {
  const { t } = useTranslation('form');

  return [
    {
      value: 'simple-static',
      label: t('options.complexity.simpleStatic.label'),
      description: t('options.complexity.simpleStatic.description'),
    },
    {
      value: 'some-moving-parts',
      label: t('options.complexity.someMovingParts.label'),
      description: t('options.complexity.someMovingParts.description'),
    },
    {
      value: 'full-featured',
      label: t('options.complexity.fullFeatured.label'),
      description: t('options.complexity.fullFeatured.description'),
    },
  ];
}

export function useCorePageOptions(): Option[] {
  const { t } = useTranslation('form');

  return [
    { value: 'home', label: t('options.corePages.home') },
    { value: 'about', label: t('options.corePages.about') },
    { value: 'services', label: t('options.corePages.services') },
    { value: 'portfolio', label: t('options.corePages.portfolio') },
    { value: 'contact', label: t('options.corePages.contact') },
    { value: 'faq', label: t('options.corePages.faq') },
    { value: 'testimonials', label: t('options.corePages.testimonials') },
    { value: 'pricing', label: t('options.corePages.pricing') },
    { value: 'team', label: t('options.corePages.team') },
    { value: 'location', label: t('options.corePages.location') },
    { value: 'legal', label: t('options.corePages.legal') },
    { value: 'core-other', label: t('options.corePages.other') },
  ];
}

export function useDynamicFeatureOptions(): Option[] {
  const { t } = useTranslation('form');

  return [
    { value: 'blog', label: t('options.dynamicFeatures.blog') },
    { value: 'case-studies', label: t('options.dynamicFeatures.caseStudies') },
    { value: 'events', label: t('options.dynamicFeatures.events') },
    { value: 'jobs', label: t('options.dynamicFeatures.jobs') },
    { value: 'contact-form', label: t('options.dynamicFeatures.contactForm') },
    { value: 'newsletter', label: t('options.dynamicFeatures.newsletter') },
    { value: 'external-booking', label: t('options.dynamicFeatures.externalBooking') },
    { value: 'social-feed', label: t('options.dynamicFeatures.socialFeed') },
    { value: 'updatable-gallery', label: t('options.dynamicFeatures.updatableGallery') },
    { value: 'video-embeds', label: t('options.dynamicFeatures.videoEmbeds') },
    { value: 'downloads', label: t('options.dynamicFeatures.downloads') },
    { value: 'dynamic-other', label: t('options.dynamicFeatures.other') },
  ];
}

export function useAdvancedFeatureOptions(): Option[] {
  const { t } = useTranslation('form');

  return [
    { value: 'shop', label: t('options.advancedFeatures.shop') },
    { value: 'cart-checkout', label: t('options.advancedFeatures.cartCheckout') },
    { value: 'payments', label: t('options.advancedFeatures.payments') },
    { value: 'calendar-booking', label: t('options.advancedFeatures.calendarBooking') },
    { value: 'service-deposits', label: t('options.advancedFeatures.serviceDeposits') },
    { value: 'members-area', label: t('options.advancedFeatures.membersArea') },
    { value: 'courses', label: t('options.advancedFeatures.courses') },
    { value: 'customer-dashboard', label: t('options.advancedFeatures.customerDashboard') },
    { value: 'subscriptions', label: t('options.advancedFeatures.subscriptions') },
    { value: 'discount-codes', label: t('options.advancedFeatures.discountCodes') },
    { value: 'inventory', label: t('options.advancedFeatures.inventory') },
    { value: 'order-tracking', label: t('options.advancedFeatures.orderTracking') },
    { value: 'email-automations', label: t('options.advancedFeatures.emailAutomations') },
    { value: 'crm', label: t('options.advancedFeatures.crm') },
    { value: 'reviews-ratings', label: t('options.advancedFeatures.reviewsRatings') },
    { value: 'wishlist', label: t('options.advancedFeatures.wishlist') },
    { value: 'live-chat', label: t('options.advancedFeatures.liveChat') },
    { value: 'multi-language', label: t('options.advancedFeatures.multiLanguage') },
    { value: 'multi-location', label: t('options.advancedFeatures.multiLocation') },
    { value: 'integrations', label: t('options.advancedFeatures.integrations') },
    { value: 'advanced-other', label: t('options.advancedFeatures.other') },
  ];
}

export function useAIFeatureOptions(): Option[] {
  const { t } = useTranslation('form');

  return [
    { value: 'ai-chatbot', label: t('options.aiFeatures.chatbot') },
    { value: 'ai-assistant', label: t('options.aiFeatures.assistant') },
    { value: 'ai-contact-form', label: t('options.aiFeatures.contactForm') },
    { value: 'ai-search', label: t('options.aiFeatures.search') },
    { value: 'ai-content', label: t('options.aiFeatures.content') },
    { value: 'ai-recommendations', label: t('options.aiFeatures.recommendations') },
    { value: 'ai-voice', label: t('options.aiFeatures.voice') },
    { value: 'ai-not-sure', label: t('options.aiFeatures.notSure') },
    { value: 'ai-none', label: t('options.aiFeatures.none') },
  ];
}

export function usePreferredContactOptions(): Option[] {
  const { t } = useTranslation('form');

  return [
    { value: 'email', label: t('options.preferredContact.email') },
    { value: 'phone', label: t('options.preferredContact.phone') },
    { value: 'whatsapp', label: t('options.preferredContact.whatsapp') },
  ];
}

export function useTranslatedAssetStatus(): Record<string, string> {
  const { t } = useTranslation('form');

  return {
    yes: t('options.assetStatus.yes'),
    no: t('options.assetStatus.no'),
    na: t('options.assetStatus.na'),
    'not-sure': t('options.assetStatus.notSure'),
    draft: t('options.assetStatus.draft'),
    'use-standard': t('options.assetStatus.useStandard'),
    'create-from-logo': t('options.assetStatus.createFromLogo'),
    'suggest-for-me': t('options.assetStatus.suggestForMe'),
  };
}

export function useTranslatedAssetCategories(): Record<string, string> {
  const { t } = useTranslation('form');

  return {
    branding: t('assetCategories.branding'),
    photography: t('assetCategories.photography'),
    graphics: t('assetCategories.graphics'),
    video: t('assetCategories.video'),
    content: t('assetCategories.content'),
    documents: t('assetCategories.documents'),
    socialProof: t('assetCategories.socialProof'),
    digital: t('assetCategories.digital'),
  };
}

export function useTranslatedAssetLabels(): Record<string, string> {
  const { t } = useTranslation('form');

  return {
    logo: t('assets.logo'),
    logoVariations: t('assets.logoVariations'),
    brandColours: t('assets.brandColours'),
    brandFonts: t('assets.brandFonts'),
    brandGuidelines: t('assets.brandGuidelines'),
    heroImage: t('assets.heroImage'),
    teamPhotos: t('assets.teamPhotos'),
    productPhotos: t('assets.productPhotos'),
    servicePhotos: t('assets.servicePhotos'),
    locationPhotos: t('assets.locationPhotos'),
    behindScenes: t('assets.behindScenes'),
    customerPhotos: t('assets.customerPhotos'),
    stockImagery: t('assets.stockImagery'),
    icons: t('assets.icons'),
    illustrations: t('assets.illustrations'),
    infographics: t('assets.infographics'),
    charts: t('assets.charts'),
    backgrounds: t('assets.backgrounds'),
    socialGraphics: t('assets.socialGraphics'),
    favicon: t('assets.favicon'),
    promoVideo: t('assets.promoVideo'),
    productDemos: t('assets.productDemos'),
    testimonialVideos: t('assets.testimonialVideos'),
    backgroundVideo: t('assets.backgroundVideo'),
    audioFiles: t('assets.audioFiles'),
    homepageText: t('assets.homepageText'),
    aboutText: t('assets.aboutText'),
    serviceDescriptions: t('assets.serviceDescriptions'),
    teamBios: t('assets.teamBios'),
    testimonials: t('assets.testimonials'),
    caseStudies: t('assets.caseStudies'),
    faqContent: t('assets.faqContent'),
    blogPosts: t('assets.blogPosts'),
    legalText: t('assets.legalText'),
    tagline: t('assets.tagline'),
    callToAction: t('assets.callToAction'),
    brochures: t('assets.brochures'),
    priceLists: t('assets.priceLists'),
    catalogues: t('assets.catalogues'),
    certificates: t('assets.certificates'),
    pressMentions: t('assets.pressMentions'),
    clientLogos: t('assets.clientLogos'),
    partnerLogos: t('assets.partnerLogos'),
    certificationBadges: t('assets.certificationBadges'),
    awardLogos: t('assets.awardLogos'),
    asSeenIn: t('assets.asSeenIn'),
    starRatings: t('assets.starRatings'),
    existingContent: t('assets.existingContent'),
    domainOwned: t('assets.domainOwned'),
    emailAccounts: t('assets.emailAccounts'),
    customerDatabase: t('assets.customerDatabase'),
    productDatabase: t('assets.productDatabase'),
    socialAccounts: t('assets.socialAccounts'),
    googleBusiness: t('assets.googleBusiness'),
  };
}
