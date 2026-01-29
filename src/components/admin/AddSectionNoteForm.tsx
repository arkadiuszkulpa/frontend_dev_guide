import { useState, useCallback } from 'react';

interface AddSectionNoteFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}

export function AddSectionNoteForm({ onSubmit, onCancel }: AddSectionNoteFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!content.trim() || isSubmitting) return;

      setIsSubmitting(true);
      try {
        await onSubmit(content.trim());
        setContent('');
      } finally {
        setIsSubmitting(false);
      }
    },
    [content, isSubmitting, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a message visible to the enquiry author..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
          disabled={isSubmitting}
          autoFocus
        />

        <div className="flex items-center justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
