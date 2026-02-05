import { describe, it, expect } from 'vitest';
import { calculatePricing, formatPriceRange } from './calculatePricing';
import {
  createInitialFormData,
  EnquiryFormData,
  BASE_PRICES,
} from '../types/enquiry';

describe('calculatePricing', () => {
  describe('base pricing matrix', () => {
    it('returns zero pricing when no selections made', () => {
      const formData = createInitialFormData();
      const result = calculatePricing(formData);

      expect(result.base.price).toEqual({ min: 0, max: 0 });
      expect(result.total).toEqual({ min: 0, max: 0 });
      expect(result.base.label).toBe('Select options to see pricing');
    });

    it('returns zero when complexity is empty', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: '',
        involvementLevel: 'do-it-for-me',
      };
      const result = calculatePricing(formData);

      expect(result.base.price).toEqual({ min: 0, max: 0 });
    });

    it('returns zero when involvement is empty', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: '',
      };
      const result = calculatePricing(formData);

      expect(result.base.price).toEqual({ min: 0, max: 0 });
    });

    // Test all 9 base price combinations
    it.each([
      ['simple-static', 'do-it-for-me', { min: 400, max: 500 }],
      ['simple-static', 'teach-me-basics', { min: 500, max: 650 }],
      ['simple-static', 'guide-me', { min: 650, max: 800 }],
      ['some-moving-parts', 'do-it-for-me', { min: 700, max: 1000 }],
      ['some-moving-parts', 'teach-me-basics', { min: 900, max: 1200 }],
      ['some-moving-parts', 'guide-me', { min: 1100, max: 1500 }],
      ['full-featured', 'do-it-for-me', { min: 1400, max: 2000 }],
      ['full-featured', 'teach-me-basics', { min: 1600, max: 2200 }],
      ['full-featured', 'guide-me', { min: 1800, max: 2500 }],
    ] as const)(
      'calculates %s × %s = %o',
      (complexity, involvement, expected) => {
        const formData: EnquiryFormData = {
          ...createInitialFormData(),
          websiteComplexity: complexity,
          involvementLevel: involvement,
        };
        const result = calculatePricing(formData);

        expect(result.base.price).toEqual(expected);
      }
    );

    it('generates correct label for base price', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'full-featured',
        involvementLevel: 'guide-me',
      };
      const result = calculatePricing(formData);

      expect(result.base.label).toBe('Full-Featured + Guide me through');
    });
  });

  describe('AI features pricing', () => {
    it('returns empty array when no AI features selected', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        aiFeatures: [],
      };
      const result = calculatePricing(formData);

      expect(result.aiFeatures).toHaveLength(0);
    });

    it('adds AI chatbot price correctly', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        aiFeatures: ['ai-chatbot'],
      };
      const result = calculatePricing(formData);

      expect(result.aiFeatures).toHaveLength(1);
      expect(result.aiFeatures[0].label).toBe('AI Chatbot');
      expect(result.aiFeatures[0].price).toEqual({ min: 300, max: 500 });
    });

    it('adds multiple AI features correctly', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        aiFeatures: ['ai-chatbot', 'ai-search', 'ai-content'],
      };
      const result = calculatePricing(formData);

      expect(result.aiFeatures).toHaveLength(3);

      // AI Chatbot: 300-500
      expect(result.aiFeatures[0].price).toEqual({ min: 300, max: 500 });
      // AI Search: 500-800
      expect(result.aiFeatures[1].price).toEqual({ min: 500, max: 800 });
      // AI Content: 300-500
      expect(result.aiFeatures[2].price).toEqual({ min: 300, max: 500 });
    });

    it('excludes non-priced AI options like "ai-not-sure"', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        aiFeatures: ['ai-not-sure', 'ai-none'],
      };
      const result = calculatePricing(formData);

      expect(result.aiFeatures).toHaveLength(0);
    });

    it('includes AI in total calculation', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        aiFeatures: ['ai-chatbot'],
      };
      const result = calculatePricing(formData);

      // Base: 400-500 + AI Chatbot: 300-500 = 700-1000
      expect(result.total).toEqual({ min: 700, max: 1000 });
    });
  });

  describe('integration pricing', () => {
    it('returns empty array when no integrations selected', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
      };
      const result = calculatePricing(formData);

      expect(result.integrations).toHaveLength(0);
    });

    it('adds integration pricing from advancedFeatures', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        advancedFeatures: ['payments', 'shop'],
      };
      const result = calculatePricing(formData);

      expect(result.integrations).toHaveLength(2);
      // Payment Processing: 100-200
      expect(result.integrations[0].label).toBe('Payment Processing');
      expect(result.integrations[0].price).toEqual({ min: 100, max: 200 });
      // Online Shop: 200-400
      expect(result.integrations[1].label).toBe('Online Shop');
      expect(result.integrations[1].price).toEqual({ min: 200, max: 400 });
    });

    it('adds integration pricing from dynamicFeatures', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        dynamicFeatures: ['newsletter', 'external-booking'],
      };
      const result = calculatePricing(formData);

      expect(result.integrations).toHaveLength(2);
      // Newsletter: 50-100
      expect(result.integrations[0].label).toBe('Newsletter Signup');
      // External Booking: 50-100
      expect(result.integrations[1].label).toBe('External Booking Link');
    });

    it('combines advanced and dynamic feature pricing', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        advancedFeatures: ['members-area'],
        dynamicFeatures: ['newsletter'],
      };
      const result = calculatePricing(formData);

      expect(result.integrations).toHaveLength(2);
    });

    it('includes integrations in total calculation', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        advancedFeatures: ['payments'], // 100-200
      };
      const result = calculatePricing(formData);

      // Base: 400-500 + Payments: 100-200 = 500-700
      expect(result.total).toEqual({ min: 500, max: 700 });
    });
  });

  describe('content needs from design assets', () => {
    it('returns empty array when all assets have content', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        designAssets: {
          ...createInitialFormData().designAssets,
          logo: 'yes',
          brandColours: 'yes',
          homepageText: 'yes',
        },
      };
      const result = calculatePricing(formData);

      expect(result.contentNeeds).toHaveLength(0);
    });

    it('adds logo design when logo marked as "no"', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        designAssets: {
          ...createInitialFormData().designAssets,
          logo: 'no',
        },
      };
      const result = calculatePricing(formData);

      const logoDesign = result.contentNeeds.find((n) =>
        n.label.includes('Logo')
      );
      expect(logoDesign).toBeDefined();
      expect(logoDesign!.price).toEqual({ min: 200, max: 400 });
    });

    it('adds brand colours when brandColours marked as "no"', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        designAssets: {
          ...createInitialFormData().designAssets,
          brandColours: 'no',
        },
      };
      const result = calculatePricing(formData);

      const brandItem = result.contentNeeds.find((n) =>
        n.label.includes('Brand')
      );
      expect(brandItem).toBeDefined();
      expect(brandItem!.price).toEqual({ min: 100, max: 200 });
    });

    it('adds brand colours when brandFonts marked as "no"', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        designAssets: {
          ...createInitialFormData().designAssets,
          brandFonts: 'no',
        },
      };
      const result = calculatePricing(formData);

      const brandItem = result.contentNeeds.find((n) =>
        n.label.includes('Brand')
      );
      expect(brandItem).toBeDefined();
    });

    it('calculates copywriting pages correctly for 1 page', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        designAssets: {
          ...createInitialFormData().designAssets,
          homepageText: 'no',
        },
      };
      const result = calculatePricing(formData);

      const copywritingItem = result.contentNeeds.find((n) =>
        n.label.includes('Copywriting')
      );
      expect(copywritingItem).toBeDefined();
      expect(copywritingItem!.label).toContain('1 page');
      expect(copywritingItem!.price).toEqual({ min: 50, max: 100 });
    });

    it('calculates copywriting pages correctly for multiple pages', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        designAssets: {
          ...createInitialFormData().designAssets,
          homepageText: 'no',
          aboutText: 'no',
          serviceDescriptions: 'no',
        },
      };
      const result = calculatePricing(formData);

      const copywritingItem = result.contentNeeds.find((n) =>
        n.label.includes('Copywriting')
      );
      expect(copywritingItem).toBeDefined();
      expect(copywritingItem!.label).toContain('3 pages');
      expect(copywritingItem!.price).toEqual({ min: 150, max: 300 }); // 50-100 × 3
    });

    it('adds photo sourcing when photo assets marked as "no"', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        designAssets: {
          ...createInitialFormData().designAssets,
          heroImage: 'no',
        },
      };
      const result = calculatePricing(formData);

      const photoSourcing = result.contentNeeds.find((n) =>
        n.label.includes('Photo')
      );
      expect(photoSourcing).toBeDefined();
      expect(photoSourcing!.price).toEqual({ min: 50, max: 150 });
    });

    it('does not add photo sourcing when photo assets are "yes" or "na"', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        designAssets: {
          ...createInitialFormData().designAssets,
          heroImage: 'yes',
          teamPhotos: 'na',
          productPhotos: 'yes',
          servicePhotos: 'na',
        },
      };
      const result = calculatePricing(formData);

      const photoSourcing = result.contentNeeds.find((n) =>
        n.label.includes('Photo')
      );
      expect(photoSourcing).toBeUndefined();
    });

    it('content needs are NOT included in total (shown separately)', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'simple-static',
        involvementLevel: 'do-it-for-me',
        designAssets: {
          ...createInitialFormData().designAssets,
          logo: 'no', // Would add 200-400
        },
      };
      const result = calculatePricing(formData);

      // Total should only be base price, not including content needs
      expect(result.total).toEqual({ min: 400, max: 500 });
      expect(result.contentNeeds.length).toBeGreaterThan(0);
    });
  });

  describe('total calculation', () => {
    it('sums base + AI + integrations correctly', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'some-moving-parts', // Base: 700-1000
        involvementLevel: 'do-it-for-me',
        aiFeatures: ['ai-chatbot'], // AI: 300-500
        advancedFeatures: ['payments'], // Integration: 100-200
      };
      const result = calculatePricing(formData);

      // 700-1000 + 300-500 + 100-200 = 1100-1700
      expect(result.total).toEqual({ min: 1100, max: 1700 });
    });

    it('handles complex pricing scenario', () => {
      const formData: EnquiryFormData = {
        ...createInitialFormData(),
        websiteComplexity: 'full-featured', // Base: 1400-2000
        involvementLevel: 'do-it-for-me',
        aiFeatures: ['ai-assistant', 'ai-recommendations'], // 800-1500 + 800-1500
        advancedFeatures: ['shop', 'members-area'], // 200-400 + 300-500
        dynamicFeatures: ['newsletter'], // 50-100
      };
      const result = calculatePricing(formData);

      // 1400-2000 + 1600-3000 + 550-1000 = 3550-6000
      expect(result.total).toEqual({ min: 3550, max: 6000 });
    });
  });
});

describe('formatPriceRange', () => {
  it('returns dash for zero range', () => {
    expect(formatPriceRange({ min: 0, max: 0 })).toBe('—');
  });

  it('formats single value when min equals max', () => {
    expect(formatPriceRange({ min: 500, max: 500 })).toBe('£500');
  });

  it('formats range correctly', () => {
    expect(formatPriceRange({ min: 400, max: 500 })).toBe('£400 - £500');
  });

  it('formats large numbers with locale formatting', () => {
    expect(formatPriceRange({ min: 1000, max: 2500 })).toBe('£1,000 - £2,500');
  });

  it('formats very large numbers correctly', () => {
    expect(formatPriceRange({ min: 10000, max: 25000 })).toBe(
      '£10,000 - £25,000'
    );
  });
});

describe('pricing constants integrity', () => {
  it('BASE_PRICES has all required combinations', () => {
    const complexities = [
      'simple-static',
      'some-moving-parts',
      'full-featured',
    ] as const;
    const involvements = [
      'do-it-for-me',
      'teach-me-basics',
      'guide-me',
    ] as const;

    for (const complexity of complexities) {
      expect(BASE_PRICES[complexity]).toBeDefined();
      for (const involvement of involvements) {
        const price = BASE_PRICES[complexity][involvement];
        expect(price).toBeDefined();
        expect(price.min).toBeGreaterThan(0);
        expect(price.max).toBeGreaterThanOrEqual(price.min);
      }
    }
  });

  it('prices increase with complexity', () => {
    const involvement = 'do-it-for-me' as const;

    const simpleMin = BASE_PRICES['simple-static'][involvement].min;
    const movingMin = BASE_PRICES['some-moving-parts'][involvement].min;
    const fullMin = BASE_PRICES['full-featured'][involvement].min;

    expect(movingMin).toBeGreaterThan(simpleMin);
    expect(fullMin).toBeGreaterThan(movingMin);
  });

  it('prices increase with involvement level (more guidance = higher cost)', () => {
    const complexity = 'simple-static' as const;

    const doItMin = BASE_PRICES[complexity]['do-it-for-me'].min;
    const teachMin = BASE_PRICES[complexity]['teach-me-basics'].min;
    const guideMin = BASE_PRICES[complexity]['guide-me'].min;

    expect(teachMin).toBeGreaterThan(doItMin);
    expect(guideMin).toBeGreaterThan(teachMin);
  });
});
