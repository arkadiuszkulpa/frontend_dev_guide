import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { AssetCategorySection } from './AssetCategorySection';
import { useEnquiryAssets } from '../../hooks/useEnquiryAssets';
import { useAssetUpload } from '../../hooks/useAssetUpload';
import { useUserGroups } from '../../hooks/useUserGroups';
import { ASSET_CATEGORIES, type DesignAssets } from '../../types/enquiry';
import type { UploadProgress } from '../../types/assets';

interface AssetUploadPageProps {
  enquiryId: string;
  enquiryName?: string;
}

export function AssetUploadPage({ enquiryId, enquiryName }: AssetUploadPageProps) {
  useAuthenticator((context) => [context.user]);
  const { groups } = useUserGroups();

  const {
    isLoading,
    error,
    getAssetStatus,
    getTextContent,
    getAssetFiles,
    updateAsset,
    addFile,
    deleteFile,
    getSummary,
  } = useEnquiryAssets(enquiryId, { userGroups: groups });

  // Track uploads per asset key
  const [uploadsMap, setUploadsMap] = useState<Map<string, UploadProgress[]>>(new Map());

  // Upload hook with completion handler
  const { uploadFiles, deleteFromS3 } = useAssetUpload({
    enquiryId,
    onUploadComplete: async (assetKey, fileData) => {
      await addFile(assetKey, fileData);
    },
  });

  // Handle file selection for an asset
  const handleFilesSelected = useCallback(
    async (assetKey: keyof DesignAssets, files: File[]) => {
      // Find the category for this asset
      const category = ASSET_CATEGORIES.find((cat) =>
        cat.assets.some((a) => a.key === assetKey)
      );

      if (!category) return;

      // Initialize upload progress
      setUploadsMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(
          assetKey,
          files.map((f) => ({
            fileName: f.name,
            progress: 0,
            status: 'pending' as const,
          }))
        );
        return newMap;
      });

      // Upload files
      await uploadFiles(files, assetKey, category.key);

      // Clear uploads after a delay
      setTimeout(() => {
        setUploadsMap((prev) => {
          const newMap = new Map(prev);
          newMap.delete(assetKey);
          return newMap;
        });
      }, 2000);
    },
    [uploadFiles]
  );

  // Handle text content change
  const handleTextChange = useCallback(
    async (assetKey: keyof DesignAssets, text: string) => {
      await updateAsset(assetKey, {
        textContent: text,
        status: text.length > 0 ? 'yes' : getAssetStatus(assetKey),
      });
    },
    [updateAsset, getAssetStatus]
  );

  // Handle file deletion
  const handleFileDelete = useCallback(
    async (assetKey: keyof DesignAssets, fileId: string) => {
      const files = getAssetFiles(assetKey);
      const file = files.find((f) => f.id === fileId);

      if (file) {
        // Delete from S3 first
        await deleteFromS3(file.s3Key);
        // Then delete from database
        await deleteFile(fileId, assetKey);
      }
    },
    [getAssetFiles, deleteFromS3, deleteFile]
  );

  // Calculate overall summary
  const summary = useMemo(() => getSummary(), [getSummary]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error.message}</p>
        <Link
          to={`/account/enquiries/${enquiryId}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to enquiry
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/account/enquiries/${enquiryId}`}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to enquiry details
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Design Assets</h1>
        {enquiryName && <p className="text-gray-600 mt-1">{enquiryName}</p>}

        {/* Summary stats */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <span className="text-green-800 font-medium">{summary.ready} ready</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
            <span className="text-amber-800 font-medium">{summary.needed} need attention</span>
          </div>
          <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
            <span className="text-primary-800 font-medium">{summary.withFiles} with files</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-1">How to provide your assets</h3>
        <p className="text-sm text-blue-800">
          Expand each category below to upload your design materials. For text content like homepage
          copy, you can either type directly or upload a document. Files you upload are securely
          stored and only accessible to you and our team.
        </p>
      </div>

      {/* Asset categories */}
      <div className="space-y-4">
        {ASSET_CATEGORIES.map((category) => (
          <AssetCategorySection
            key={category.key}
            category={category}
            getAssetStatus={getAssetStatus}
            getTextContent={getTextContent}
            getAssetFiles={getAssetFiles}
            uploads={uploadsMap}
            onFilesSelected={handleFilesSelected}
            onTextChange={handleTextChange}
            onFileDelete={handleFileDelete}
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Any assets marked "Needs help" or "Not sure" may require additional
          design or copywriting work, which will be quoted separately from the website build.
        </p>
      </div>
    </div>
  );
}
