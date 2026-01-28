import { useState, useCallback } from 'react';
import { FileUploader } from './FileUploader';
import { FileList } from './FileList';
import type { AssetUploadConfig, EnquiryAssetFile } from '../../types/assets';

interface TextAssetInputProps {
  value: string;
  onChange: (value: string) => void;
  onFilesSelected?: (files: File[]) => void;
  files?: EnquiryAssetFile[];
  onFileDelete?: (fileId: string) => void;
  config: AssetUploadConfig;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

export function TextAssetInput({
  value,
  onChange,
  onFilesSelected,
  files = [],
  onFileDelete,
  config,
  placeholder = 'Enter your content here...',
  disabled = false,
  label,
}: TextAssetInputProps) {
  const [mode, setMode] = useState<'text' | 'file'>(
    files.length > 0 ? 'file' : 'text'
  );

  const handleModeChange = useCallback((newMode: 'text' | 'file') => {
    setMode(newMode);
  }, []);

  // For text-only mode, just show textarea
  if (config.inputType === 'text') {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">{label}</label>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className={`
            w-full px-3 py-2 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'}
            border-gray-300
          `}
        />
      </div>
    );
  }

  // For file-only mode, just show uploader
  if (config.inputType === 'file') {
    return (
      <div className="space-y-3">
        {label && (
          <label className="block text-sm font-medium text-gray-700">{label}</label>
        )}
        <FileUploader
          config={config}
          onFilesSelected={onFilesSelected || (() => {})}
          disabled={disabled}
        />
        {files.length > 0 && (
          <FileList files={files} onDelete={onFileDelete} />
        )}
      </div>
    );
  }

  // For 'both' mode, show toggle between text and file
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeChange('text')}
          className={`
            px-3 py-1.5 text-sm rounded-lg border transition-colors
            ${
              mode === 'text'
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Type text
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('file')}
          className={`
            px-3 py-1.5 text-sm rounded-lg border transition-colors
            ${
              mode === 'file'
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload document
          </span>
        </button>
      </div>

      {/* Content based on mode */}
      {mode === 'text' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={`
            w-full px-3 py-2 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'}
            border-gray-300
          `}
        />
      ) : (
        <div className="space-y-3">
          <FileUploader
            config={config}
            onFilesSelected={onFilesSelected || (() => {})}
            disabled={disabled}
          />
          {files.length > 0 && (
            <FileList files={files} onDelete={onFileDelete} />
          )}
        </div>
      )}

      {/* Show existing files even in text mode */}
      {mode === 'text' && files.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Previously uploaded documents:</p>
          <FileList files={files} onDelete={onFileDelete} />
        </div>
      )}
    </div>
  );
}
