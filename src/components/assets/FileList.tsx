import { FilePreview } from './FilePreview';
import type { EnquiryAssetFile } from '../../types/assets';

interface FileListProps {
  files: EnquiryAssetFile[];
  onDelete?: (fileId: string) => void;
  showDelete?: boolean;
  emptyMessage?: string;
}

export function FileList({
  files,
  onDelete,
  showDelete = true,
  emptyMessage = 'No files uploaded yet',
}: FileListProps) {
  if (files.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic py-2">{emptyMessage}</p>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <FilePreview
          key={file.id}
          file={file}
          onDelete={onDelete}
          showDelete={showDelete}
        />
      ))}
    </div>
  );
}
