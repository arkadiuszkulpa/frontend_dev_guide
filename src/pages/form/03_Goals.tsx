import { FormCard } from '../../components/FormCard';
import { CheckboxGroup } from '../../components/CheckboxGroup';
import { TextInput } from '../../components/TextInput';
import { EnquiryFormData, GOAL_OPTIONS } from '../../types/enquiry';

interface GoalsProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function Goals({ formData, updateFormData }: GoalsProps) {
  const handleGoalsChange = (selected: string[]) => {
    const primary = selected[0] || '';
    const secondary = selected.slice(1);
    updateFormData({ primaryGoal: primary, secondaryGoals: secondary });
  };

  const allSelected = formData.primaryGoal
    ? [formData.primaryGoal, ...formData.secondaryGoals]
    : formData.secondaryGoals;

  return (
    <FormCard
      title="What should your website do for you?"
      subtitle="Select all that apply"
    >
      <div className="space-y-6">
        <CheckboxGroup
          options={GOAL_OPTIONS}
          selected={allSelected}
          onChange={handleGoalsChange}
        />
        <TextInput
          label="Anything else? (optional)"
          type="text"
          value={formData.secondaryGoals.find((g) => !GOAL_OPTIONS.includes(g)) || ''}
          onChange={(e) => {
            const customGoal = e.target.value;
            const standardGoals = allSelected.filter((g) => GOAL_OPTIONS.includes(g));
            if (customGoal) {
              handleGoalsChange([...standardGoals, customGoal]);
            } else {
              handleGoalsChange(standardGoals);
            }
          }}
          placeholder="Something else you'd like your website to help with..."
        />
      </div>
    </FormCard>
  );
}

export function validateGoals(formData: EnquiryFormData): boolean {
  return formData.primaryGoal !== '' || formData.secondaryGoals.length > 0;
}
