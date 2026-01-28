import { useTranslation } from 'react-i18next';
import { FormCard } from '../../components/FormCard';
import { RadioGroup } from '../../components/RadioGroup';
import { EnquiryFormData } from '../../types/enquiry';
import { useInvolvementOptions, useAccountManagementOptions } from '../../hooks/useTranslatedOptions';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function InvolvementLevel({ formData, updateFormData }: StepProps) {
  const { t } = useTranslation('form');
  const involvementOptions = useInvolvementOptions();
  const accountManagementOptions = useAccountManagementOptions();

  const showAccountManagement = formData.involvementLevel !== '' && formData.involvementLevel !== 'guide-me';

  return (
    <FormCard
      title={t('steps.involvement.title')}
      subtitle={t('steps.involvement.subtitle')}
    >
      <div className="space-y-8">
        <RadioGroup
          options={involvementOptions}
          selected={formData.involvementLevel}
          onChange={(value) => updateFormData({ involvementLevel: value as EnquiryFormData['involvementLevel'] })}
        />

        {showAccountManagement && (
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-4">
              {t('steps.involvement.accountManagementPrompt')}
            </p>
            <RadioGroup
              options={accountManagementOptions}
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
