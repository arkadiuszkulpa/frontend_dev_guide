import { FormCard } from '../../components/FormCard';
import { CheckboxGroup } from '../../components/CheckboxGroup';
import { TextInput } from '../../components/TextInput';
import {
  EnquiryFormData,
  CORE_PAGE_OPTIONS,
  DYNAMIC_FEATURE_OPTIONS,
  ADVANCED_FEATURE_OPTIONS,
} from '../../types/enquiry';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function Features({ formData, updateFormData }: StepProps) {
  const showDynamicFeatures =
    formData.websiteComplexity === 'some-moving-parts' ||
    formData.websiteComplexity === 'full-featured';

  const showAdvancedFeatures = formData.websiteComplexity === 'full-featured';

  const showCorePagesOther = formData.corePages.includes('core-other');
  const showDynamicFeaturesOther = formData.dynamicFeatures.includes('dynamic-other');
  const showAdvancedFeaturesOther = formData.advancedFeatures.includes('advanced-other');

  return (
    <FormCard title="What features do you need?">
      <div className="space-y-10">
        {/* Core Pages - Always shown */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">What pages do you need?</h3>
          <p className="text-sm text-gray-500 mb-4">Select all that apply</p>
          <CheckboxGroup
            options={CORE_PAGE_OPTIONS}
            selected={formData.corePages}
            onChange={(selected) => updateFormData({ corePages: selected })}
          />
          {showCorePagesOther && (
            <div className="mt-4">
              <TextInput
                label="Please specify other pages"
                value={formData.corePagesOther}
                onChange={(e) => updateFormData({ corePagesOther: e.target.value })}
                placeholder="e.g., Custom landing pages, Partner page..."
              />
            </div>
          )}
        </div>

        {/* Dynamic Features - Show for Tier 2+ */}
        {showDynamicFeatures && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              What do you need to regularly update or manage?
            </h3>
            <p className="text-sm text-gray-500 mb-4">Select all that apply</p>
            <CheckboxGroup
              options={DYNAMIC_FEATURE_OPTIONS}
              selected={formData.dynamicFeatures}
              onChange={(selected) => updateFormData({ dynamicFeatures: selected })}
            />
            {showDynamicFeaturesOther && (
              <div className="mt-4">
                <TextInput
                  label="Please specify other dynamic features"
                  value={formData.dynamicFeaturesOther}
                  onChange={(e) => updateFormData({ dynamicFeaturesOther: e.target.value })}
                  placeholder="e.g., Member directory, Resource library..."
                />
              </div>
            )}
          </div>
        )}

        {/* Advanced Features - Show for Tier 3 only */}
        {showAdvancedFeatures && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              What advanced features do you need?
            </h3>
            <p className="text-sm text-gray-500 mb-4">Select all that apply</p>
            <CheckboxGroup
              options={ADVANCED_FEATURE_OPTIONS}
              selected={formData.advancedFeatures}
              onChange={(selected) => updateFormData({ advancedFeatures: selected })}
            />
            {showAdvancedFeaturesOther && (
              <div className="mt-4">
                <TextInput
                  label="Please specify other advanced features"
                  value={formData.advancedFeaturesOther}
                  onChange={(e) => updateFormData({ advancedFeaturesOther: e.target.value })}
                  placeholder="e.g., Custom API integrations, Auction system..."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </FormCard>
  );
}

export function validateFeatures(formData: EnquiryFormData): boolean {
  return formData.corePages.length > 0;
}
