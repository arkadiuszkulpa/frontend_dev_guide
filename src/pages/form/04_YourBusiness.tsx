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
  const showInspirationReason = formData.inspirationWebsite.trim() !== '';

  return (
    <FormCard title="Tell us about your business">
      <div className="space-y-6">
        <TextInput
          label="Business name"
          value={formData.businessName}
          onChange={(e) => updateFormData({ businessName: e.target.value })}
          placeholder="My Business Ltd"
        />

        <div>
          <TextArea
            label="Describe what you do"
            value={formData.businessDescription}
            onChange={(e) => updateFormData({ businessDescription: e.target.value })}
            placeholder="For example: I run a small bakery in Manchester. We make fresh bread, pastries, and custom cakes for special occasions. We've been in business for 3 years."
            rows={4}
            required
          />
          <p className="mt-1 text-sm text-gray-500">2-3 sentences is perfect</p>
        </div>

        <DynamicUrlList
          label="Who are your competitors?"
          helperText="Share up to 3 competitor websites so we understand your market."
          urls={formData.competitorWebsites}
          onChange={(urls) => updateFormData({ competitorWebsites: urls })}
          maxItems={3}
          placeholder="https://www.example.com"
          required
        />

        <TextInput
          label="Any websites you like the look of?"
          value={formData.inspirationWebsite}
          onChange={(e) => updateFormData({ inspirationWebsite: e.target.value })}
          placeholder="https://www.example.com"
        />
        <p className="-mt-4 text-sm text-gray-500">
          Can be the same as a competitor, or completely different.
        </p>

        {showInspirationReason && (
          <TextArea
            label="What do you like about it?"
            value={formData.inspirationReason}
            onChange={(e) => updateFormData({ inspirationReason: e.target.value })}
            placeholder="e.g. the layout, colours, how it feels, specific features..."
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
