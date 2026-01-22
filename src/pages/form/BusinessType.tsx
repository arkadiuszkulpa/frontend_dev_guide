import { FormCard } from '../../components/FormCard';
import { TextArea } from '../../components/TextArea';
import { EnquiryFormData } from '../../types/enquiry';

interface BusinessTypeProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function BusinessType({ formData, updateFormData }: BusinessTypeProps) {
  return (
    <FormCard
      title="Tell us about your business"
      subtitle="In your own words, what do you do?"
    >
      <div className="space-y-6">
        <TextArea
          label="Describe your business"
          value={formData.businessDescription}
          onChange={(e) => updateFormData({ businessDescription: e.target.value })}
          placeholder="For example: I run a small bakery in Manchester. We make fresh bread, pastries, and custom cakes for special occasions. We've been in business for 3 years."
          rows={6}
          required
        />
        <p className="text-sm text-gray-500">
          Don't worry about being too detailed. Just give us a general idea of what your business is about.
        </p>
      </div>
    </FormCard>
  );
}

export function validateBusinessType(formData: EnquiryFormData): boolean {
  return formData.businessDescription.trim().length >= 10;
}
