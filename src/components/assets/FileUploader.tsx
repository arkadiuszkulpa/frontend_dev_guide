import { useCallback, useState, useRef } from 'react';
import type { AssetUploadConfig } from '../../types/assets';

interface FileUploaderProps {
  config: AssetUploadConfig;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

export function FileUploader({
  config,
  onFilesSelected,
  disabled = false,
  className = '',
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(config.allowMultiple ? files : [files[0]]);
      }
    },
    [disabled, config.allowMultiple, onFilesSelected]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(config.allowMultiple ? files : [files[0]]);
      }
      // Reset input so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [config.allowMultiple, onFilesSelected]
  );

  // Build accept string for input
  const acceptString = config.acceptedTypes.join(',');

  // Format accepted types for display
  const formatAcceptedTypes = () => {
    const types = config.acceptedTypes.map((type) => {
      if (type.startsWith('.')) return type.toUpperCase().slice(1);
      if (type.includes('/')) {
        const [, subtype] = type.split('/');
        if (subtype === '*') return type.split('/')[0].toUpperCase();
        return subtype.toUpperCase();
      }
      return type;
    });
    return [...new Set(types)].slice(0, 5).join(', ');
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
        transition-colors duration-200
        ${
          isDragOver
            ? 'border-primary-500 bg-primary-50'
            : disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
        multiple={config.allowMultiple}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-2">
        <svg
          className={`w-8 h-8 ${isDragOver ? 'text-primary-500' : 'text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <div className="text-sm">
          <span className={`font-medium ${isDragOver ? 'text-primary-600' : 'text-gray-700'}`}>
            {isDragOver ? 'Drop files here' : 'Click to upload'}
          </span>
          <span className="text-gray-500"> or drag and drop</span>
        </div>

        <p className="text-xs text-gray-500">
          {formatAcceptedTypes()} up to {config.maxFileSizeMB}MB
          {config.allowMultiple ? ' (multiple allowed)' : ''}
        </p>
      </div>
    </div>
  );
}
