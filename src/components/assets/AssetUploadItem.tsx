import { useCallback, useState } from 'react';
import { FileUploader } from './FileUploader';
import { FileList } from './FileList';
import { TextAssetInput } from './TextAssetInput';
import { UploadProgress } from './UploadProgress';
import type { AssetItem, AssetStatus } from '../../types/enquiry';
import type { EnquiryAssetFile, UploadProgress as UploadProgressType } from '../../types/assets';
import { getAssetUploadConfig } from '../../types/assets';

interface AssetUploadItemProps {
  asset: AssetItem;
  status: AssetStatus;
  textContent: string;
  files: EnquiryAssetFile[];
  uploads: UploadProgressType[];
  onFilesSelected: (files: File[]) => void;
  onTextChange: (text: string) => void;
  onFileDelete: (fileId: string) => void;
  disabled?: boolean;
}

export function AssetUploadItem({
  asset,
  status,
  textContent,
  files,
  uploads,
  onFilesSelected,
  onTextChange,
  onFileDelete,
  disabled = false,
}: AssetUploadItemProps) {
  const [isExpanded, setIsExpanded] = useState(files.length > 0 || textContent.length > 0);
  const config = getAssetUploadConfig(asset.key);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Status badge color
  const getStatusColor = () => {
    switch (status) {
      case 'yes':
        return 'bg-green-100 text-green-800';
      case 'no':
        return 'bg-red-100 text-red-800';
      case 'na':
        return 'bg-gray-100 text-gray-600';
      case 'not-sure':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'use-standard':
      case 'create-from-logo':
      case 'suggest-for-me':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Status label
  const getStatusLabel = () => {
    switch (status) {
      case 'yes':
        return 'Ready';
      case 'no':
        return 'Needs help';
      case 'na':
        return 'N/A';
      case 'not-sure':
        return 'Not sure';
      case 'draft':
        return 'Draft';
      case 'use-standard':
        return 'Use standard';
      case 'create-from-logo':
        return 'Create from logo';
      case 'suggest-for-me':
        return 'Suggest for me';
      default:
        return 'Not set';
    }
  };

  // Check if we have uploaded content
  const hasContent = files.length > 0 || textContent.length > 0;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header row */}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {/* Expand/collapse icon */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>

          {/* Asset label */}
          <span className="text-sm font-medium text-gray-900">{asset.label}</span>

          {/* File count badge */}
          {files.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {files.length} file{files.length !== 1 ? 's' : ''}
            </span>
          )}

          {/* Has text indicator */}
          {textContent.length > 0 && files.length === 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Text provided
            </span>
          )}
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
        >
          {getStatusLabel()}
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
          {/* Upload progress */}
          {uploads.length > 0 && (
            <UploadProgress uploads={uploads} />
          )}

          {/* Input based on config type */}
          {config.inputType === 'text' ? (
            <TextAssetInput
              value={textContent}
              onChange={onTextChange}
              config={config}
              disabled={disabled}
              placeholder={`Enter your ${asset.label.toLowerCase()}...`}
            />
          ) : config.inputType === 'file' ? (
            <div className="space-y-3">
              <FileUploader
                config={config}
                onFilesSelected={onFilesSelected}
                disabled={disabled}
              />
              {files.length > 0 && (
                <FileList files={files} onDelete={onFileDelete} />
              )}
            </div>
          ) : (
            // 'both' - text or file
            <TextAssetInput
              value={textContent}
              onChange={onTextChange}
              onFilesSelected={onFilesSelected}
              files={files}
              onFileDelete={onFileDelete}
              config={config}
              disabled={disabled}
              placeholder={`Enter your ${asset.label.toLowerCase()} or upload a document...`}
            />
          )}

          {/* Help text for assets needing attention */}
          {(status === 'no' || status === 'not-sure') && !hasContent && (
            <p className="text-sm text-amber-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Please provide this asset to help us with your project
            </p>
          )}
        </div>
      )}
    </div>
  );
}
