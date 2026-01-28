interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[] | string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function CheckboxGroup({ options, selected, onChange }: CheckboxGroupProps) {
  const normalizedOptions: CheckboxOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-3">
      {normalizedOptions.map((option) => (
        <label
          key={option.value}
          className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selected.includes(option.value)
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => toggleOption(option.value)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 min-w-5 min-h-5 flex-shrink-0 rounded border-2 mr-4 mt-0.5 flex items-center justify-center transition-colors ${
              selected.includes(option.value)
                ? 'bg-primary-500 border-primary-500'
                : 'border-gray-300'
            }`}
          >
            {selected.includes(option.value) && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div>
            <span className="text-gray-700">{option.label}</span>
            {option.description && (
              <p className="text-gray-500 text-sm mt-0.5">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
