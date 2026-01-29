import { useState, useEffect } from 'react';
import { getUrl } from 'aws-amplify/storage';
import { isImageFile, isPdfFile, isVideoFile, formatFileSize } from '../../types/assets';
import type { EnquiryAssetFile } from '../../types/assets';

interface FilePreviewProps {
  file: EnquiryAssetFile;
  onDelete?: (fileId: string) => void;
  showDelete?: boolean;
}

export function FilePreview({ file, onDelete, showDelete = true }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUrl = async () => {
      setIsLoadingUrl(true);
      try {
        const result = await getUrl({
          path: file.s3Key,
          options: { expiresIn: 3600 },
        });
        setPreviewUrl(result.url.toString());
      } catch (err) {
        console.error('Failed to get preview URL:', err);
      } finally {
        setIsLoadingUrl(false);
      }
    };

    fetchUrl();
  }, [file.s3Key]);

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(file.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const isImage = isImageFile(file.mimeType);
  const isPdf = isPdfFile(file.mimeType);
  const isVideo = isVideoFile(file.mimeType);

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      {/* Thumbnail / Icon */}
      <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-200 flex items-center justify-center">
        {isLoadingUrl ? (
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        ) : isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt={file.fileName}
            className="w-full h-full object-cover"
          />
        ) : isPdf ? (
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13h1c.28 0 .5.22.5.5v3c0 .28-.22.5-.5.5H8v-1h.5v-.5H8v-1h.5V14H8v-.5c0-.28.22-.5.5-.5zm3.5 0h1c.28 0 .5.22.5.5V15h-.5v-.5H12v3h.5V17h.5v1.5c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5zm3.5 0h1c.28 0 .5.22.5.5V15h-.5v-.5H15.5v.5h.5v1h-.5v.5h.5V17h-.5v.5h.5v1h-1c-.28 0-.5-.22-.5-.5v-4.5c0-.28.22-.5.5-.5z" />
          </svg>
        ) : isVideo ? (
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate" title={file.fileName}>
          {file.fileName}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleDownload}
          disabled={!previewUrl}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          title="Download"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>

        {showDelete && onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            title="Delete"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
