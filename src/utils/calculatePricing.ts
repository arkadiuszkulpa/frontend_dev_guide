import {
  EnquiryFormData,
  PricingBreakdown,
  PriceRange,
  PricingLineItem,
  DesignAssets,
  BASE_PRICES,
  AI_FEATURE_PRICES,
  INTEGRATION_PRICES,
  CONTENT_CREATION_PRICES,
  COMPLEXITY_LABELS,
  INVOLVEMENT_LABELS,
} from '../types/enquiry';

/**
 * Sum multiple price ranges together
 */
function sumPriceRanges(...ranges: PriceRange[]): PriceRange {
  return ranges.reduce(
    (acc, range) => ({
      min: acc.min + range.min,
      max: acc.max + range.max,
    }),
    { min: 0, max: 0 }
  );
}

/**
 * Get base price from complexity × involvement matrix
 */
function getBasePrice(
  complexity: string,
  involvement: string
): { label: string; price: PriceRange } {
  // Handle empty selections with fallback
  if (!complexity || !involvement || complexity === '' || involvement === '') {
    return {
      label: 'Select options to see pricing',
      price: { min: 0, max: 0 },
    };
  }

  const complexityKey = complexity as keyof typeof BASE_PRICES;
  const involvementKey = involvement as keyof (typeof BASE_PRICES)[typeof complexityKey];

  const price = BASE_PRICES[complexityKey]?.[involvementKey] ?? { min: 0, max: 0 };
  const complexityLabel = COMPLEXITY_LABELS[complexityKey] ?? complexity;
  const involvementLabel = INVOLVEMENT_LABELS[involvementKey] ?? involvement;

  return {
    label: `${complexityLabel} + ${involvementLabel}`,
    price,
  };
}

/**
 * Get AI feature add-ons pricing
 */
function getAIFeaturesPricing(aiFeatures: string[]): PricingLineItem[] {
  return aiFeatures
    .filter((f) => AI_FEATURE_PRICES[f]) // Only features with pricing
    .map((f) => ({
      label: AI_FEATURE_PRICES[f].label,
      price: AI_FEATURE_PRICES[f].price,
    }));
}

/**
 * Get integration add-ons pricing from advancedFeatures and dynamicFeatures
 */
function getIntegrationsPricing(
  advancedFeatures: string[],
  dynamicFeatures: string[]
): PricingLineItem[] {
  const allFeatures = [...advancedFeatures, ...dynamicFeatures];

  return allFeatures
    .filter((f) => INTEGRATION_PRICES[f]) // Only features with pricing
    .map((f) => ({
      label: INTEGRATION_PRICES[f].label,
      price: INTEGRATION_PRICES[f].price,
    }));
}

/**
 * Count pages that need copywriting based on written content assets
 */
function countCopywritingPages(designAssets: DesignAssets): number {
  // Check written content assets marked as 'no'
  const writtenContentKeys: (keyof DesignAssets)[] = [
    'homepageText',
    'aboutText',
    'serviceDescriptions',
  ];

  let count = 0;
  for (const key of writtenContentKeys) {
    if (designAssets[key] === 'no') {
      count++;
    }
  }

  return count;
}

/**
 * Get content creation needs based on designAssets marked 'no'
 */
function getContentNeedsFromAssets(designAssets: DesignAssets): PricingLineItem[] {
  const needs: PricingLineItem[] = [];

  // Logo design
  if (designAssets.logo === 'no') {
    needs.push({
      label: CONTENT_CREATION_PRICES['logo'].label,
      price: CONTENT_CREATION_PRICES['logo'].price,
    });
  }

  // Brand colours & fonts
  if (designAssets.brandColours === 'no' || designAssets.brandFonts === 'no') {
    needs.push({
      label: CONTENT_CREATION_PRICES['brandColours'].label,
      price: CONTENT_CREATION_PRICES['brandColours'].price,
    });
  }

  // Copywriting - calculate based on pages needing content
  const copywritingPages = countCopywritingPages(designAssets);
  if (copywritingPages > 0) {
    const perPage = CONTENT_CREATION_PRICES['copywriting'].price;
    needs.push({
      label: `Copywriting (approx. ${copywritingPages} ${copywritingPages === 1 ? 'page' : 'pages'})`,
      price: {
        min: perPage.min * copywritingPages,
        max: perPage.max * copywritingPages,
      },
    });
  }

  // Photo sourcing - check for key photo assets marked 'no'
  const photoKeys: (keyof DesignAssets)[] = [
    'heroImage',
    'teamPhotos',
    'productPhotos',
    'servicePhotos',
  ];
  const needsPhotos = photoKeys.some((key) => designAssets[key] === 'no');
  if (needsPhotos) {
    needs.push({
      label: CONTENT_CREATION_PRICES['photoSourcing'].label,
      price: CONTENT_CREATION_PRICES['photoSourcing'].price,
    });
  }

  return needs;
}

/**
 * Calculate full pricing breakdown based on form data
 */
export function calculatePricing(formData: EnquiryFormData): PricingBreakdown {
  // Get base price from complexity × involvement matrix
  const base = getBasePrice(formData.websiteComplexity, formData.involvementLevel);

  // Calculate AI feature add-ons
  const aiFeatures = getAIFeaturesPricing(formData.aiFeatures);

  // Calculate integration add-ons
  const integrations = getIntegrationsPricing(
    formData.advancedFeatures,
    formData.dynamicFeatures
  );

  // Calculate content creation needs
  const contentNeeds = getContentNeedsFromAssets(formData.designAssets);

  // Sum all price ranges for total
  const allPrices = [
    base.price,
    ...aiFeatures.map((f) => f.price),
    ...integrations.map((f) => f.price),
    // Note: content needs are shown separately, not included in total
  ];
  const total = sumPriceRanges(...allPrices);

  return {
    base,
    aiFeatures,
    integrations,
    contentNeeds,
    total,
  };
}

/**
 * Format a price range for display
 */
export function formatPriceRange(range: PriceRange): string {
  if (range.min === 0 && range.max === 0) {
    return '—';
  }
  if (range.min === range.max) {
    return `£${range.min.toLocaleString()}`;
  }
  return `£${range.min.toLocaleString()} - £${range.max.toLocaleString()}`;
}
