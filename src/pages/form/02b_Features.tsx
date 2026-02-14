import { useTranslation } from 'react-i18next';
import { FormCard } from '../../components/FormCard';
import { CheckboxGroup } from '../../components/CheckboxGroup';
import { TextInput } from '../../components/TextInput';
import { EnquiryFormData } from '../../types/enquiry';
import {
  useCorePageOptions,
  useDynamicFeatureOptions,
  useAdvancedFeatureOptions,
} from '../../hooks/useTranslatedOptions';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function Features({ formData, updateFormData }: StepProps) {
  const { t } = useTranslation('form');
  const corePageOptions = useCorePageOptions();
  const dynamicFeatureOptions = useDynamicFeatureOptions();
  const advancedFeatureOptions = useAdvancedFeatureOptions();

  const showDynamicFeatures =
    formData.websiteComplexity === 'some-moving-parts' ||
    formData.websiteComplexity === 'full-featured';

  const showAdvancedFeatures = formData.websiteComplexity === 'full-featured';

  const showCorePagesOther = formData.corePages.includes('core-other');
  const showDynamicFeaturesOther = formData.dynamicFeatures.includes('dynamic-other');
  const showAdvancedFeaturesOther = formData.advancedFeatures.includes('advanced-other');

  return (
    <FormCard title={t('steps.features.title')}>
      <div className="space-y-10">
        {/* Core Pages - Always shown */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('steps.features.corePages.title')}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{t('steps.features.corePages.helper')}</p>
          <CheckboxGroup
            options={corePageOptions}
            selected={formData.corePages}
            onChange={(selected) => updateFormData({ corePages: selected })}
          />
          {showCorePagesOther && (
            <div className="mt-4">
              <TextInput
                label={t('steps.features.corePages.otherLabel')}
                value={formData.corePagesOther}
                onChange={(e) => updateFormData({ corePagesOther: e.target.value })}
                placeholder={t('steps.features.corePages.otherPlaceholder')}
              />
            </div>
          )}
        </div>

        {/* Dynamic Features - Show for Tier 2+ */}
        {showDynamicFeatures && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('steps.features.dynamicFeatures.title')}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{t('steps.features.dynamicFeatures.helper')}</p>
            <CheckboxGroup
              options={dynamicFeatureOptions}
              selected={formData.dynamicFeatures}
              onChange={(selected) => updateFormData({ dynamicFeatures: selected })}
            />
            {showDynamicFeaturesOther && (
              <div className="mt-4">
                <TextInput
                  label={t('steps.features.dynamicFeatures.otherLabel')}
                  value={formData.dynamicFeaturesOther}
                  onChange={(e) => updateFormData({ dynamicFeaturesOther: e.target.value })}
                  placeholder={t('steps.features.dynamicFeatures.otherPlaceholder')}
                />
              </div>
            )}
          </div>
        )}

        {/* Advanced Features - Show for Tier 3 only */}
        {showAdvancedFeatures && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('steps.features.advancedFeatures.title')}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{t('steps.features.advancedFeatures.helper')}</p>
            <CheckboxGroup
              options={advancedFeatureOptions}
              selected={formData.advancedFeatures}
              onChange={(selected) => updateFormData({ advancedFeatures: selected })}
            />
            {showAdvancedFeaturesOther && (
              <div className="mt-4">
                <TextInput
                  label={t('steps.features.advancedFeatures.otherLabel')}
                  value={formData.advancedFeaturesOther}
                  onChange={(e) => updateFormData({ advancedFeaturesOther: e.target.value })}
                  placeholder={t('steps.features.advancedFeatures.otherPlaceholder')}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </FormCard>
  );
}