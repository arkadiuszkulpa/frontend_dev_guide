interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[] | string[];
  selected: string;
  onChange: (value: string) => void;
}

export function RadioGroup({ options, selected, onChange }: RadioGroupProps) {
  const normalizedOptions: RadioOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className="space-y-3">
      {normalizedOptions.map((option) => (
        <label
          key={option.value}
          className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selected === option.value
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full border-2 mr-4 mt-0.5 flex items-center justify-center transition-colors ${
              selected === option.value
                ? 'border-primary-500'
                : 'border-gray-300'
            }`}
          >
            {selected === option.value && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
            )}
          </div>
          <div>
            <span className="text-gray-700 font-medium">{option.label}</span>
            {option.description && (
              <p className="text-gray-500 text-sm mt-0.5">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
