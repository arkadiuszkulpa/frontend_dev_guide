import { useTranslation } from 'react-i18next';
import { FormCard } from '../../components/FormCard';
import { TextInput } from '../../components/TextInput';
import { RadioGroup } from '../../components/RadioGroup';
import { EnquiryFormData } from '../../types/enquiry';
import { usePreferredContactOptions } from '../../hooks/useTranslatedOptions';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function ContactInfo({ formData, updateFormData }: StepProps) {
  const { t } = useTranslation('form');
  const preferredContactOptions = usePreferredContactOptions();

  return (
    <FormCard title={t('steps.contactInfo.title')}>
      <div className="space-y-6">
        <TextInput
          label={t('steps.contactInfo.fullName')}
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          placeholder={t('steps.contactInfo.fullNamePlaceholder')}
          required
        />

        <TextInput
          label={t('steps.contactInfo.email')}
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder={t('steps.contactInfo.emailPlaceholder')}
          required
        />

        <TextInput
          label={t('steps.contactInfo.phone')}
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          placeholder={t('steps.contactInfo.phonePlaceholder')}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('steps.contactInfo.preferredContact')} <span className="text-red-500">*</span>
          </label>
          <RadioGroup
            options={preferredContactOptions}
            selected={formData.preferredContact}
            onChange={(value) => updateFormData({ preferredContact: value as EnquiryFormData['preferredContact'] })}
          />
        </div>
      </div>
    </FormCard>
  );
}

export function validateContactInfo(formData: EnquiryFormData): boolean {
  return (
    formData.fullName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.preferredContact !== ''
  );
}
