import { FormCard } from '../../components/FormCard';
import { CheckboxGroup } from '../../components/CheckboxGroup';
import { EnquiryFormData, CONTENT_OPTIONS, FEATURE_OPTIONS } from '../../types/enquiry';

interface ContentFeaturesProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function ContentFeatures({ formData, updateFormData }: ContentFeaturesProps) {
  return (
    <FormCard
      title="What will your website include?"
      subtitle="Select the content and features you need"
    >
      <div className="space-y-10">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            What content do you have to share?
          </h3>
          <CheckboxGroup
            options={CONTENT_OPTIONS}
            selected={formData.contentTypes}
            onChange={(selected) => updateFormData({ contentTypes: selected })}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            What features would you like?
          </h3>
          <CheckboxGroup
            options={FEATURE_OPTIONS}
            selected={formData.desiredFeatures}
            onChange={(selected) => updateFormData({ desiredFeatures: selected })}
          />
        </div>
      </div>
    </FormCard>
  );
}

export function validateContentFeatures(formData: EnquiryFormData): boolean {
  return formData.contentTypes.length > 0 && formData.desiredFeatures.length > 0;
}
