import { FormCard } from '../../components/FormCard';
import { TextInput } from '../../components/TextInput';
import { EnquiryFormData } from '../../types/enquiry';

interface ContactInfoProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function ContactInfo({ formData, updateFormData }: ContactInfoProps) {
  return (
    <FormCard
      title="Let's start with your details"
      subtitle="So we know who to contact about your project"
    >
      <div className="space-y-6">
        <TextInput
          label="Your full name"
          type="text"
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
        <TextInput
          label="Business name (if applicable)"
          type="text"
          value={formData.businessName}
          onChange={(e) => updateFormData({ businessName: e.target.value })}
          placeholder="My Business Ltd"
        />
      </div>
    </FormCard>
  );
}

export function validateContactInfo(formData: EnquiryFormData): boolean {
  return (
    formData.fullName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== ''
  );
}
