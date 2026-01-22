interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function CheckboxGroup({ options, selected, onChange }: CheckboxGroupProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option}
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selected.includes(option)
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggleOption(option)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border-2 mr-4 flex items-center justify-center transition-colors ${
              selected.includes(option)
                ? 'bg-primary-500 border-primary-500'
                : 'border-gray-300'
            }`}
          >
            {selected.includes(option) && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );
}
