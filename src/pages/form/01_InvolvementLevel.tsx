import { FormCard } from '../../components/FormCard';
import { RadioGroup } from '../../components/RadioGroup';
import {
  EnquiryFormData,
  INVOLVEMENT_OPTIONS,
  ACCOUNT_MANAGEMENT_OPTIONS,
} from '../../types/enquiry';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function InvolvementLevel({ formData, updateFormData }: StepProps) {
  const showAccountManagement = formData.involvementLevel !== '' && formData.involvementLevel !== 'guide-me';

  return (
    <FormCard
      title="How hands-on do you want to be?"
      subtitle="This affects how we work together and what you'll pay for ongoing changes."
    >
      <div className="space-y-8">
        <RadioGroup
          options={INVOLVEMENT_OPTIONS}
          selected={formData.involvementLevel}
          onChange={(value) => updateFormData({ involvementLevel: value as EnquiryFormData['involvementLevel'] })}
        />

        {showAccountManagement && (
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-4">
              For things like buying a domain, setting up hosting, or managing logins—how would you like to handle that?
            </p>
            <RadioGroup
              options={ACCOUNT_MANAGEMENT_OPTIONS}
              selected={formData.accountManagement}
              onChange={(value) => updateFormData({ accountManagement: value as EnquiryFormData['accountManagement'] })}
            />
          </div>
        )}
      </div>
    </FormCard>
  );
}

export function validateInvolvementLevel(formData: EnquiryFormData): boolean {
  if (formData.involvementLevel === '') return false;
  if (formData.involvementLevel !== 'guide-me' && formData.accountManagement === '') return false;
  return true;
}
