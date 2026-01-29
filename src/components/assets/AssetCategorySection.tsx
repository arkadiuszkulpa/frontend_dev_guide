import { useState, useCallback } from 'react';
import { AssetUploadItem } from './AssetUploadItem';
import type { AssetCategory, AssetStatus, DesignAssets } from '../../types/enquiry';
import type { EnquiryAssetFile, UploadProgress } from '../../types/assets';

interface AssetCategorySectionProps {
  category: AssetCategory;
  getAssetStatus: (key: keyof DesignAssets) => AssetStatus;
  getTextContent: (key: keyof DesignAssets) => string;
  getAssetFiles: (key: keyof DesignAssets) => EnquiryAssetFile[];
  uploads: Map<string, UploadProgress[]>;
  onFilesSelected: (assetKey: keyof DesignAssets, files: File[]) => void;
  onTextChange: (assetKey: keyof DesignAssets, text: string) => void;
  onFileDelete: (assetKey: keyof DesignAssets, fileId: string) => void;
  disabled?: boolean;
}

export function AssetCategorySection({
  category,
  getAssetStatus,
  getTextContent,
  getAssetFiles,
  uploads,
  onFilesSelected,
  onTextChange,
  onFileDelete,
  disabled = false,
}: AssetCategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Calculate category stats
  const categoryStats = category.assets.reduce(
    (acc, asset) => {
      const status = getAssetStatus(asset.key);
      const files = getAssetFiles(asset.key);
      const text = getTextContent(asset.key);

      if (files.length > 0 || text.length > 0) {
        acc.withContent++;
      }
      if (['yes', 'draft', 'use-standard', 'create-from-logo', 'suggest-for-me'].includes(status)) {
        acc.ready++;
      } else if (['no', 'not-sure'].includes(status)) {
        acc.needsHelp++;
      }
      acc.total++;

      return acc;
    },
    { ready: 0, needsHelp: 0, withContent: 0, total: 0 }
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Category header */}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {/* Expand/collapse icon */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>

          {/* Category title */}
          <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm">
          {categoryStats.withContent > 0 && (
            <span className="text-primary-600 font-medium">
              {categoryStats.withContent} uploaded
            </span>
          )}
          {categoryStats.needsHelp > 0 && (
            <span className="text-amber-600">
              {categoryStats.needsHelp} needs attention
            </span>
          )}
          <span className="text-gray-500">
            {categoryStats.ready}/{categoryStats.total} ready
          </span>
        </div>
      </button>

      {/* Assets list */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
          {category.assets.map((asset) => (
            <AssetUploadItem
              key={asset.key}
              asset={asset}
              status={getAssetStatus(asset.key)}
              textContent={getTextContent(asset.key)}
              files={getAssetFiles(asset.key)}
              uploads={uploads.get(asset.key) || []}
              onFilesSelected={(files) => onFilesSelected(asset.key, files)}
              onTextChange={(text) => onTextChange(asset.key, text)}
              onFileDelete={(fileId) => onFileDelete(asset.key, fileId)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
