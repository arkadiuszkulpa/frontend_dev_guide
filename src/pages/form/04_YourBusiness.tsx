import { useTranslation } from 'react-i18next';
import { FormCard } from '../../components/FormCard';
import { TextInput } from '../../components/TextInput';
import { TextArea } from '../../components/TextArea';
import { DynamicUrlList } from '../../components/DynamicUrlList';
import { EnquiryFormData } from '../../types/enquiry';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function YourBusiness({ formData, updateFormData }: StepProps) {
  const { t } = useTranslation('form');
  const showInspirationReason = formData.inspirationWebsite.trim() !== '';

  return (
    <FormCard title={t('steps.yourBusiness.title')}>
      <div className="space-y-6">
        <TextInput
          label={t('steps.yourBusiness.businessName')}
          value={formData.businessName}
          onChange={(e) => updateFormData({ businessName: e.target.value })}
          placeholder={t('steps.yourBusiness.businessNamePlaceholder')}
        />

        <div>
          <TextArea
            label={t('steps.yourBusiness.businessDescription')}
            value={formData.businessDescription}
            onChange={(e) => updateFormData({ businessDescription: e.target.value })}
            placeholder={t('steps.yourBusiness.businessDescriptionPlaceholder')}
            rows={4}
            required
          />
          <p className="mt-1 text-sm text-gray-500">{t('steps.yourBusiness.businessDescriptionHelper')}</p>
        </div>

        <DynamicUrlList
          label={t('steps.yourBusiness.competitors.label')}
          helperText={t('steps.yourBusiness.competitors.helper')}
          urls={formData.competitorWebsites}
          onChange={(urls) => updateFormData({ competitorWebsites: urls })}
          maxItems={3}
          placeholder="https://www.example.com"
          required
        />

        <TextInput
          label={t('steps.yourBusiness.inspiration.label')}
          value={formData.inspirationWebsite}
          onChange={(e) => updateFormData({ inspirationWebsite: e.target.value })}
          placeholder="https://www.example.com"
        />
        <p className="-mt-4 text-sm text-gray-500">
          {t('steps.yourBusiness.inspiration.helper')}
        </p>

        {showInspirationReason && (
          <TextArea
            label={t('steps.yourBusiness.inspiration.reasonLabel')}
            value={formData.inspirationReason}
            onChange={(e) => updateFormData({ inspirationReason: e.target.value })}
            placeholder={t('steps.yourBusiness.inspiration.reasonPlaceholder')}
            rows={3}
          />
        )}
      </div>
    </FormCard>
  );
}

export function validateYourBusiness(formData: EnquiryFormData): boolean {
  const hasDescription = formData.businessDescription.trim().length >= 10;
  const hasAtLeastOneCompetitor = formData.competitorWebsites.some(url => url.trim() !== '');
  return hasDescription && hasAtLeastOneCompetitor;
}
