import { useTranslation } from 'react-i18next';
import { FormCard } from '../../components/FormCard';
import { CheckboxGroup } from '../../components/CheckboxGroup';
import { EnquiryFormData } from '../../types/enquiry';
import { useAIFeatureOptions } from '../../hooks/useTranslatedOptions';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function AIFeatures({ formData, updateFormData }: StepProps) {
  const { t } = useTranslation('form');
  const aiFeatureOptions = useAIFeatureOptions();

  const handleAIFeatureChange = (selected: string[]) => {
    const previouslyHadNone = formData.aiFeatures.includes('ai-none');
    const nowHasNone = selected.includes('ai-none');
    const previouslyHadOthers = formData.aiFeatures.some((f) => f !== 'ai-none');
    const nowHasOthers = selected.some((f) => f !== 'ai-none');

    // If user just selected "none" and previously had other options
    if (nowHasNone && !previouslyHadNone && previouslyHadOthers) {
      updateFormData({ aiFeatures: ['ai-none'] });
      return;
    }

    // If user selected another option while "none" was selected
    if (nowHasOthers && previouslyHadNone && !nowHasNone) {
      // "none" was just deselected, keep the new selection
      updateFormData({ aiFeatures: selected });
      return;
    }

    // If user selected another option while "none" is still selected
    if (nowHasOthers && nowHasNone) {
      // Remove "none" from selection
      updateFormData({ aiFeatures: selected.filter((f) => f !== 'ai-none') });
      return;
    }

    // Normal case
    updateFormData({ aiFeatures: selected });
  };

  return (
    <FormCard
      title={t('steps.aiFeatures.title')}
      subtitle={t('steps.aiFeatures.subtitle')}
    >
      <CheckboxGroup
        options={aiFeatureOptions}
        selected={formData.aiFeatures}
        onChange={handleAIFeatureChange}
      />
    </FormCard>
  );
}

export function validateAIFeatures(formData: EnquiryFormData): boolean {
  return formData.aiFeatures.length > 0;
}
