import { useState, useCallback } from 'react';
import { SectionNoteDisplay } from './SectionNoteDisplay';
import { AddSectionNoteForm } from './AddSectionNoteForm';
import type { SectionKey, SectionNote } from '../../types/admin';

type FieldValue = string | (string | null)[] | boolean | null | undefined;

interface FieldProps {
  label: string;
  value: FieldValue;
}

function Field({ label, value }: FieldProps) {
  const displayValue = () => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Not provided</span>;
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      const filteredValue = value.filter((item): item is string => item !== null);
      if (filteredValue.length === 0) {
        return <span className="text-gray-400 italic">None</span>;
      }
      return (
        <ul className="list-disc list-inside space-y-1">
          {filteredValue.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    // Check if it's a URL
    if (typeof value === 'string' && value.startsWith('http')) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 underline"
        >
          {value}
        </a>
      );
    }
    return value;
  };

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-gray-900">{displayValue()}</dd>
    </div>
  );
}

interface EnquirySectionProps {
  title: string;
  fields: Array<{ label: string; value: FieldValue }>;
  sectionKey?: SectionKey;
  notes?: SectionNote[];
  isAdmin?: boolean;
  onAddNote?: (content: string) => Promise<void>;
  onDeleteNote?: (noteId: string) => Promise<void>;
}

export function EnquirySection({
  title,
  fields,
  sectionKey,
  notes = [],
  isAdmin = false,
  onAddNote,
  onDeleteNote,
}: EnquirySectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddNote = useCallback(
    async (content: string) => {
      if (onAddNote) {
        await onAddNote(content);
        setShowAddForm(false);
      }
    },
    [onAddNote]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with title and add note button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isAdmin && sectionKey && onAddNote && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add note
          </button>
        )}
      </div>

      {/* Add note form (admin only) */}
      {showAddForm && (
        <AddSectionNoteForm
          onSubmit={handleAddNote}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Section notes (visible to both admin and owner) */}
      <SectionNoteDisplay
        notes={notes}
        onDelete={isAdmin ? onDeleteNote : undefined}
        isAdmin={isAdmin}
      />

      {/* Field data */}
      <dl className="space-y-4">
        {fields.map((field, index) => (
          <Field key={index} label={field.label} value={field.value} />
        ))}
      </dl>
    </div>
  );
}
