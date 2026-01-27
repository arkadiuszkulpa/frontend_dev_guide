import { useState, useMemo } from 'react';
import { FormCard } from '../../components/FormCard';
import { CollapsibleSection } from '../../components/CollapsibleSection';
import { AssetStatusSelector } from '../../components/AssetStatusSelector';
import {
  EnquiryFormData,
  DesignAssets,
  ASSET_CATEGORIES,
  AssetCategory,
  WebsiteComplexity,
  ContentTier,
} from '../../types/enquiry';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

const TIER_ORDER: Record<ContentTier, number> = {
  core: 0,
  dynamic: 1,
  advanced: 2,
};

const COMPLEXITY_TO_TIER: Record<WebsiteComplexity, ContentTier> = {
  'simple-static': 'core',
  'some-moving-parts': 'dynamic',
  'full-featured': 'advanced',
  '': 'advanced', // fallback shows everything
};

function getVisibleCategories(
  complexity: WebsiteComplexity,
  corePages: string[],
  dynamicFeatures: string[],
  advancedFeatures: string[],
  aiFeatures: string[]
): AssetCategory[] {
  const maxTier = COMPLEXITY_TO_TIER[complexity] || 'advanced';
  const maxOrder = TIER_ORDER[maxTier];

  // Combine all selected features
  const selectedFeatures = [
    ...corePages,
    ...dynamicFeatures,
    ...advancedFeatures,
    ...aiFeatures,
  ];

  return ASSET_CATEGORIES
    .filter((cat) => TIER_ORDER[cat.tier] <= maxOrder)
    .map((cat) => ({
      ...cat,
      assets: cat.assets.filter((asset) => {
        // First check tier
        if (TIER_ORDER[asset.minTier] > maxOrder) return false;

        // If no requiredFeatures, show based on tier alone
        if (!asset.requiredFeatures || asset.requiredFeatures.length === 0) {
          return true;
        }

        // Show if ANY required feature is selected
        return asset.requiredFeatures.some((f) => selectedFeatures.includes(f));
      }),
    }))
    .filter((cat) => cat.assets.length > 0);
}

export function DesignAssetsStep({ formData, updateFormData }: StepProps) {
  // Open the first two sections by default
  const [openSections, setOpenSections] = useState<string[]>(['branding', 'content']);

  // Filter categories based on website complexity and selected features
  const visibleCategories = useMemo(
    () => getVisibleCategories(
      formData.websiteComplexity,
      formData.corePages,
      formData.dynamicFeatures,
      formData.advancedFeatures,
      formData.aiFeatures
    ),
    [
      formData.websiteComplexity,
      formData.corePages,
      formData.dynamicFeatures,
      formData.advancedFeatures,
      formData.aiFeatures,
    ]
  );

  const toggleSection = (key: string) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleAssetChange = (assetKey: keyof DesignAssets, value: string) => {
    updateFormData({
      designAssets: {
        ...formData.designAssets,
        [assetKey]: value,
      },
    });
  };

  const getCompletionCount = (category: AssetCategory) => {
    const completed = category.assets.filter(
      (asset) => formData.designAssets[asset.key] !== ''
    ).length;
    return { completed, total: category.assets.length };
  };

  return (
    <FormCard
      title="What materials do you have ready?"
      subtitle="Anything you don't have, we can help create — but design work is quoted separately from the website build."
    >
      <div className="space-y-4">
        {visibleCategories.map((category) => (
          <CollapsibleSection
            key={category.key}
            title={category.title}
            isOpen={openSections.includes(category.key)}
            onToggle={() => toggleSection(category.key)}
            completionCount={getCompletionCount(category)}
          >
            <div>
              {category.assets.map((asset) => (
                <AssetStatusSelector
                  key={asset.key}
                  label={asset.label}
                  options={asset.options}
                  value={formData.designAssets[asset.key]}
                  onChange={(value) => handleAssetChange(asset.key, value)}
                />
              ))}
            </div>
          </CollapsibleSection>
        ))}

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Any assets marked "No" or "I need help" may require additional
            design or copywriting work, quoted separately from the website build.
          </p>
        </div>
      </div>
    </FormCard>
  );
}

export function validateDesignAssets(formData: EnquiryFormData): boolean {
  const assets = formData.designAssets;
  return assets.logo !== '' && assets.brandColours !== '';
}
