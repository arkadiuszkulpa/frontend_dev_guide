import { FormCard } from '../../components/FormCard';
import { RadioGroup } from '../../components/RadioGroup';
import { TextArea } from '../../components/TextArea';
import { EnquiryFormData, URGENCY_OPTIONS } from '../../types/enquiry';

interface TimelineProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function Timeline({ formData, updateFormData }: TimelineProps) {
  const budgetOptions = [
    { value: 'not-sure', label: "I'm not sure yet", description: "I need guidance on what to expect" },
    { value: 'under-500', label: 'Under \u00A3500', description: 'Basic website with essential features' },
    { value: '500-1500', label: '\u00A3500 - \u00A31,500', description: 'Professional site with more features' },
    { value: '1500-5000', label: '\u00A31,500 - \u00A35,000', description: 'Custom design with advanced features' },
    { value: 'over-5000', label: 'Over \u00A35,000', description: 'Fully custom solution' },
  ];

  return (
    <FormCard
      title="Almost done!"
      subtitle="Just a couple more questions"
    >
      <div className="space-y-10">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            When do you need your website ready?
          </p>
          <RadioGroup
            options={URGENCY_OPTIONS}
            selected={formData.urgency}
            onChange={(value) => updateFormData({ urgency: value })}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Do you have a budget in mind? (optional)
          </p>
          <RadioGroup
            options={budgetOptions}
            selected={formData.budgetRange}
            onChange={(value) => updateFormData({ budgetRange: value })}
          />
        </div>

        <TextArea
          label="Anything else you'd like us to know? (optional)"
          value={formData.additionalNotes}
          onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
          placeholder="Any other details, questions, or concerns..."
          rows={4}
        />
      </div>
    </FormCard>
  );
}

export function validateTimeline(formData: EnquiryFormData): boolean {
  return formData.urgency !== '';
}
