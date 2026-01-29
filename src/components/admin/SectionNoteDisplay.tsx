import type { SectionNote } from '../../types/admin';

interface SectionNoteDisplayProps {
  notes: SectionNote[];
  onDelete?: (noteId: string) => void;
  isAdmin?: boolean;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString();
}

export function SectionNoteDisplay({ notes, onDelete, isAdmin = false }: SectionNoteDisplayProps) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg"
        >
          <div className="flex items-start gap-3">
            {/* Chat bubble icon */}
            <svg
              className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>

            <div className="flex-1 min-w-0">
              {/* Note content */}
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>

              {/* Meta info */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">{note.createdBy}</span>
                  <span className="mx-1">·</span>
                  <span>{formatRelativeTime(note.createdAt)}</span>
                </p>

                {/* Delete button - only show for admin */}
                {isAdmin && onDelete && (
                  <button
                    onClick={() => onDelete(note.id)}
                    className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
