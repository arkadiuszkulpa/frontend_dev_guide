interface AssetOption {
  value: string;
  label: string;
}

interface AssetStatusSelectorProps {
  label: string;
  options: AssetOption[];
  value: string;
  onChange: (value: string) => void;
}

export function AssetStatusSelector({
  label,
  options,
  value,
  onChange,
}: AssetStatusSelectorProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-700 flex-1 pr-4">{label}</span>
      <div className="flex gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              value === option.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
