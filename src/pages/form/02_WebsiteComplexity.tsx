import { FormCard } from '../../components/FormCard';
import { RadioGroup } from '../../components/RadioGroup';
import { EnquiryFormData, COMPLEXITY_OPTIONS } from '../../types/enquiry';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function WebsiteComplexity({ formData, updateFormData }: StepProps) {
  return (
    <FormCard title="What kind of website do you need?">
      <RadioGroup
        options={COMPLEXITY_OPTIONS}
        selected={formData.websiteComplexity}
        onChange={(value) => updateFormData({ websiteComplexity: value as EnquiryFormData['websiteComplexity'] })}
      />
    </FormCard>
  );
}

export function validateWebsiteComplexity(formData: EnquiryFormData): boolean {
  return formData.websiteComplexity !== '';
}
