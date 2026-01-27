import { ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  completionCount?: { completed: number; total: number };
}

export function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
  completionCount,
}: CollapsibleSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {completionCount && (
          <span
            className={`text-sm px-2 py-0.5 rounded-full ${
              completionCount.completed === completionCount.total
                ? 'bg-green-100 text-green-700'
                : completionCount.completed > 0
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {completionCount.completed}/{completionCount.total}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}
