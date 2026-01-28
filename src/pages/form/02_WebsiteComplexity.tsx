import { useTranslation } from 'react-i18next';
import { FormCard } from '../../components/FormCard';
import { RadioGroup } from '../../components/RadioGroup';
import { EnquiryFormData } from '../../types/enquiry';
import { useComplexityOptions } from '../../hooks/useTranslatedOptions';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function WebsiteComplexity({ formData, updateFormData }: StepProps) {
  const { t } = useTranslation('form');
  const complexityOptions = useComplexityOptions();

  return (
    <FormCard title={t('steps.complexity.title')}>
      <RadioGroup
        options={complexityOptions}
        selected={formData.websiteComplexity}
        onChange={(value) => updateFormData({ websiteComplexity: value as EnquiryFormData['websiteComplexity'] })}
      />
    </FormCard>
  );
}

export function validateWebsiteComplexity(formData: EnquiryFormData): boolean {
  return formData.websiteComplexity !== '';
}
