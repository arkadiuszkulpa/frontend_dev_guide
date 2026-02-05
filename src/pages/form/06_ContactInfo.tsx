import { useTranslation } from 'react-i18next';
import { FormCard } from '../../components/FormCard';
import { TextInput } from '../../components/TextInput';
import { RadioGroup } from '../../components/RadioGroup';
import { EnquiryFormData } from '../../types/enquiry';
import { usePreferredContactOptions } from '../../hooks/useTranslatedOptions';

// Email validation
const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return false;
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// E.164 phone format validation: + followed by 1-15 digits
const isValidPhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return false;
  // Remove spaces and dashes before validation
  const cleaned = phone.replace(/[\s-]/g, '');
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(cleaned);
};

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

        <div>
          <TextInput
            label={t('steps.contactInfo.email')}
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder={t('steps.contactInfo.emailPlaceholder')}
            required
          />
          {formData.email && !isValidEmail(formData.email) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.invalidEmail')}
            </p>
          )}
        </div>

        <div>
          <TextInput
            label={t('steps.contactInfo.phone')}
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder={t('steps.contactInfo.phonePlaceholder')}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {t('validation.phoneHelper')}
          </p>
          {formData.phone && !isValidPhone(formData.phone) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.invalidPhone')}
            </p>
          )}
        </div>

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
    isValidEmail(formData.email) &&
    isValidPhone(formData.phone) &&
    formData.preferredContact !== ''
  );
}
