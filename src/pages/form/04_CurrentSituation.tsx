import { FormCard } from '../../components/FormCard';
import { RadioGroup } from '../../components/RadioGroup';
import { TextInput } from '../../components/TextInput';
import { CheckboxGroup } from '../../components/CheckboxGroup';
import { EnquiryFormData, CHALLENGE_OPTIONS } from '../../types/enquiry';

interface CurrentSituationProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function CurrentSituation({ formData, updateFormData }: CurrentSituationProps) {
  const hasWebsiteOptions = [
    { value: 'yes', label: 'Yes, I have a website' },
    { value: 'no', label: "No, I don't have one yet" },
  ];

  return (
    <FormCard
      title="Where are you now?"
      subtitle="Tell us about your current online presence"
    >
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Do you currently have a website?
          </p>
          <RadioGroup
            options={hasWebsiteOptions}
            selected={
              formData.hasExistingWebsite === null
                ? ''
                : formData.hasExistingWebsite
                ? 'yes'
                : 'no'
            }
            onChange={(value) =>
              updateFormData({ hasExistingWebsite: value === 'yes' })
            }
          />
        </div>

        {formData.hasExistingWebsite && (
          <TextInput
            label="What's your current website address?"
            type="url"
            value={formData.existingWebsiteUrl}
            onChange={(e) => updateFormData({ existingWebsiteUrl: e.target.value })}
            placeholder="https://www.example.com"
          />
        )}

        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            {formData.hasExistingWebsite
              ? "What problems are you having with your current site?"
              : "What's stopping you from having a website?"}
          </p>
          <CheckboxGroup
            options={CHALLENGE_OPTIONS}
            selected={formData.currentChallenges}
            onChange={(selected) => updateFormData({ currentChallenges: selected })}
          />
        </div>
      </div>
    </FormCard>
  );
}

export function validateCurrentSituation(formData: EnquiryFormData): boolean {
  return formData.hasExistingWebsite !== null;
}
