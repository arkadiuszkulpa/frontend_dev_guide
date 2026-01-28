import { NOTE_TYPE_LABELS, NOTE_TYPE_COLORS, type NoteType } from '../../types/admin';

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  noteType: NoteType | null;
}

interface NotesListProps {
  notes: Note[];
  onDelete?: (noteId: string) => Promise<void>;
}

export function NotesList({ notes, onDelete }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No notes yet. Add your first note below.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {note.noteType && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${NOTE_TYPE_COLORS[note.noteType]}`}
                >
                  {NOTE_TYPE_LABELS[note.noteType]}
                </span>
              )}
              <span className="text-sm text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()} at{' '}
                {new Date(note.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(note.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete note"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
          <p className="text-xs text-gray-400 mt-2">By {note.createdBy}</p>
        </div>
      ))}
    </div>
  );
}
