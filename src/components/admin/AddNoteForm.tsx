import { useState } from 'react';
import { NOTE_TYPE_LABELS, type NoteType } from '../../types/admin';

interface AddNoteFormProps {
  onSubmit: (content: string, noteType: NoteType) => Promise<void>;
}

const noteTypes: NoteType[] = ['context', 'call_summary', 'quote_sent', 'follow_up', 'general'];

export function AddNoteForm({ onSubmit }: AddNoteFormProps) {
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), noteType);
      setContent('');
      setNoteType('general');
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="noteType" className="block text-sm font-medium text-gray-700 mb-1">
          Note Type
        </label>
        <select
          id="noteType"
          value={noteType}
          onChange={(e) => setNoteType(e.target.value as NoteType)}
          className="w-full rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
        >
          {noteTypes.map((type) => (
            <option key={type} value={type}>
              {NOTE_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Note
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add context, call summary, or any relevant notes..."
          rows={4}
          className="w-full rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!content.trim() || isSubmitting}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Adding...' : 'Add Note'}
      </button>
    </form>
  );
}
