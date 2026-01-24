import { useState } from 'react';
import { FormCard } from '../../components/FormCard';
import { RadioGroup } from '../../components/RadioGroup';
import { EnquiryFormData, STYLE_OPTIONS } from '../../types/enquiry';

interface StylePreferencesProps {
  formData: EnquiryFormData;
  updateFormData: (updates: Partial<EnquiryFormData>) => void;
}

export function StylePreferences({ formData, updateFormData }: StylePreferencesProps) {
  const [exampleInput, setExampleInput] = useState('');

  const addExample = () => {
    if (exampleInput.trim() && !formData.exampleSites.includes(exampleInput.trim())) {
      updateFormData({
        exampleSites: [...formData.exampleSites, exampleInput.trim()],
      });
      setExampleInput('');
    }
  };

  const removeExample = (site: string) => {
    updateFormData({
      exampleSites: formData.exampleSites.filter((s) => s !== site),
    });
  };

  return (
    <FormCard
      title="How should it look and feel?"
      subtitle="Help us understand the vibe you're going for"
    >
      <div className="space-y-10">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            What style best describes the feeling you want?
          </p>
          <RadioGroup
            options={STYLE_OPTIONS}
            selected={formData.stylePreference}
            onChange={(value) => updateFormData({ stylePreference: value })}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Any websites you like? (optional)
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Share links to websites that have a style or feeling you like. They don't need to be in your industry.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExample())}
              placeholder="https://www.example.com"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addExample}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.exampleSites.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.exampleSites.map((site) => (
                <div
                  key={site}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-600 truncate">{site}</span>
                  <button
                    type="button"
                    onClick={() => removeExample(site)}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FormCard>
  );
}

export function validateStylePreferences(formData: EnquiryFormData): boolean {
  return formData.stylePreference !== '';
}
