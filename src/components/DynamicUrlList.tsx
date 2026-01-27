import { useState } from 'react';

interface DynamicUrlListProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  maxItems: number;
  placeholder?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
}

export function DynamicUrlList({
  urls,
  onChange,
  maxItems,
  placeholder = 'https://www.example.com',
  label,
  helperText,
  required = false,
}: DynamicUrlListProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && urls.length < maxItems && !urls.includes(trimmed)) {
      onChange([...urls, trimmed]);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const canAdd = urls.length < maxItems && inputValue.trim() !== '';
  const remaining = maxItems - urls.length;

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* Existing URLs */}
      {urls.length > 0 && (
        <ul className="space-y-2">
          {urls.map((url, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="text-sm text-gray-700 truncate flex-1 mr-2">{url}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Remove ${url}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add new URL input */}
      {urls.length < maxItems && (
        <div className="flex gap-2">
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-0 outline-none transition-colors"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
              canAdd
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Add
          </button>
        </div>
      )}

      {/* Remaining slots indicator */}
      {remaining > 0 && remaining < maxItems && (
        <p className="text-xs text-gray-400">
          {remaining} {remaining === 1 ? 'slot' : 'slots'} remaining
        </p>
      )}
    </div>
  );
}
