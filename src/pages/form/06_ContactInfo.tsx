import { FormCard } from '../../components/FormCard';
import { TextInput } from '../../components/TextInput';
import { RadioGroup } from '../../components/RadioGroup';
import { EnquiryFormData, PREFERRED_CONTACT_OPTIONS } from '../../types/enquiry';

interface StepProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function ContactInfo({ formData, updateFormData }: StepProps) {
  return (
    <FormCard title="Last step — how do we reach you?">
      <div className="space-y-6">
        <TextInput
          label="Your full name"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          placeholder="John Smith"
          required
        />

        <TextInput
          label="Email address"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="john@example.com"
          required
        />

        <TextInput
          label="Phone number"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          placeholder="+44 7700 900000"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you prefer we contact you? <span className="text-red-500">*</span>
          </label>
          <RadioGroup
            options={PREFERRED_CONTACT_OPTIONS}
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
