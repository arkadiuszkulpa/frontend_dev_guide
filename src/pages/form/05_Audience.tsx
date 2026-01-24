import { FormCard } from '../../components/FormCard';
import { TextArea } from '../../components/TextArea';
import { RadioGroup } from '../../components/RadioGroup';
import { EnquiryFormData, LOCATION_OPTIONS } from '../../types/enquiry';

interface AudienceProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function Audience({ formData, updateFormData }: AudienceProps) {
  return (
    <FormCard
      title="Who are your customers?"
      subtitle="Help us understand who will visit your website"
    >
      <div className="space-y-8">
        <TextArea
          label="Describe your ideal customer"
          value={formData.targetAudience}
          onChange={(e) => updateFormData({ targetAudience: e.target.value })}
          placeholder="For example: Busy parents aged 30-45 looking for healthy meal options. They care about quality and convenience but don't have much time to cook."
          rows={4}
          required
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Where are your customers located?
          </p>
          <RadioGroup
            options={LOCATION_OPTIONS}
            selected={formData.audienceLocation}
            onChange={(value) => updateFormData({ audienceLocation: value })}
          />
        </div>
      </div>
    </FormCard>
  );
}

export function validateAudience(formData: EnquiryFormData): boolean {
  return (
    formData.targetAudience.trim().length >= 10 &&
    formData.audienceLocation !== ''
  );
}
