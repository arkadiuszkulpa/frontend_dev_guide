import type { UploadProgress as UploadProgressType } from '../../types/assets';

interface UploadProgressProps {
  uploads: UploadProgressType[];
}

export function UploadProgress({ uploads }: UploadProgressProps) {
  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {uploads.map((upload, index) => (
        <div
          key={`${upload.fileName}-${index}`}
          className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
        >
          {/* Status icon */}
          <div className="flex-shrink-0">
            {upload.status === 'uploading' && (
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            )}
            {upload.status === 'completed' && (
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {upload.status === 'error' && (
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {upload.status === 'pending' && (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          {/* File name and progress */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{upload.fileName}</p>
            {upload.status === 'uploading' && (
              <div className="mt-1">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              </div>
            )}
            {upload.status === 'error' && upload.error && (
              <p className="text-xs text-red-600 mt-0.5">{upload.error}</p>
            )}
          </div>

          {/* Progress percentage */}
          {upload.status === 'uploading' && (
            <span className="text-xs text-gray-500 tabular-nums">{upload.progress}%</span>
          )}
        </div>
      ))}
    </div>
  );
}
