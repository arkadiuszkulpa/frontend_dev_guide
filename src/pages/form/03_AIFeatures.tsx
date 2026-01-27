import { FormCard } from '../../components/FormCard';
import { CheckboxGroup } from '../../components/CheckboxGroup';
import { EnquiryFormData, AI_FEATURE_OPTIONS } from '../../types/enquiry';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function AIFeatures({ formData, updateFormData }: StepProps) {
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
      title="Are you interested in AI-powered features?"
      subtitle="These can be added to any type of website."
    >
      <CheckboxGroup
        options={AI_FEATURE_OPTIONS}
        selected={formData.aiFeatures}
        onChange={handleAIFeatureChange}
      />
    </FormCard>
  );
}

export function validateAIFeatures(formData: EnquiryFormData): boolean {
  return formData.aiFeatures.length > 0;
}
