import { useState, useCallback } from 'react';
import { uploadData, remove, getUrl } from 'aws-amplify/storage';
import type { AssetUploadState } from '../types/assets';
import {
  generateS3Key,
  validateFile,
  getAssetUploadConfig,
} from '../types/assets';
import type { DesignAssets } from '../types/enquiry';

interface UseAssetUploadOptions {
  enquiryId: string;
  onUploadComplete?: (
    assetKey: keyof DesignAssets,
    fileData: {
      s3Key: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
    }
  ) => Promise<void>;
}

export function useAssetUpload({ enquiryId, onUploadComplete }: UseAssetUploadOptions) {
  const [uploadState, setUploadState] = useState<AssetUploadState>({
    isUploading: false,
    uploads: [],
    error: null,
  });

  // Upload a single file
  const uploadFile = useCallback(
    async (
      file: File,
      assetKey: keyof DesignAssets,
      category: string
    ): Promise<{ s3Key: string; fileName: string; fileSize: number; mimeType: string } | null> => {
      const config = getAssetUploadConfig(assetKey);

      // Validate file
      const validation = validateFile(file, config);
      if (!validation.valid) {
        setUploadState((prev) => ({
          ...prev,
          error: validation.error || 'Invalid file',
        }));
        return null;
      }

      const s3Key = generateS3Key(enquiryId, category, assetKey, file.name);

      // Add to uploads list
      setUploadState((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
        uploads: [
          ...prev.uploads,
          {
            fileName: file.name,
            progress: 0,
            status: 'uploading',
          },
        ],
      }));

      try {
        // Upload to S3
        await uploadData({
          path: s3Key,
          data: file,
          options: {
            contentType: file.type,
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                const progress = Math.round((transferredBytes / totalBytes) * 100);
                setUploadState((prev) => ({
                  ...prev,
                  uploads: prev.uploads.map((u) =>
                    u.fileName === file.name ? { ...u, progress } : u
                  ),
                }));
              }
            },
          },
        });

        // Mark as completed
        setUploadState((prev) => ({
          ...prev,
          uploads: prev.uploads.map((u) =>
            u.fileName === file.name ? { ...u, status: 'completed', progress: 100 } : u
          ),
        }));

        const fileData = {
          s3Key,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        };

        // Call completion handler if provided
        if (onUploadComplete) {
          await onUploadComplete(assetKey, fileData);
        }

        return fileData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';

        setUploadState((prev) => ({
          ...prev,
          error: errorMessage,
          uploads: prev.uploads.map((u) =>
            u.fileName === file.name ? { ...u, status: 'error', error: errorMessage } : u
          ),
        }));

        return null;
      }
    },
    [enquiryId, onUploadComplete]
  );

  // Upload multiple files
  const uploadFiles = useCallback(
    async (
      files: File[],
      assetKey: keyof DesignAssets,
      category: string
    ): Promise<
      Array<{ s3Key: string; fileName: string; fileSize: number; mimeType: string } | null>
    > => {
      const config = getAssetUploadConfig(assetKey);

      // Check if multiple files allowed
      if (!config.allowMultiple && files.length > 1) {
        setUploadState((prev) => ({
          ...prev,
          error: 'Only one file allowed for this asset',
        }));
        return [];
      }

      setUploadState({
        isUploading: true,
        uploads: files.map((f) => ({
          fileName: f.name,
          progress: 0,
          status: 'pending',
        })),
        error: null,
      });

      const results = [];
      for (const file of files) {
        const result = await uploadFile(file, assetKey, category);
        results.push(result);
      }

      // Check if all done
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
      }));

      return results;
    },
    [uploadFile]
  );

  // Delete a file from S3
  const deleteFromS3 = useCallback(async (s3Key: string): Promise<boolean> => {
    try {
      await remove({ path: s3Key });
      return true;
    } catch (err) {
      console.error('Failed to delete from S3:', err);
      return false;
    }
  }, []);

  // Get a pre-signed URL for viewing/downloading
  const getFileUrl = useCallback(
    async (s3Key: string, expiresInSeconds: number = 3600): Promise<string | null> => {
      try {
        const result = await getUrl({
          path: s3Key,
          options: {
            expiresIn: expiresInSeconds,
          },
        });
        return result.url.toString();
      } catch (err) {
        console.error('Failed to get file URL:', err);
        return null;
      }
    },
    []
  );

  // Clear upload state
  const clearUploads = useCallback(() => {
    setUploadState({
      isUploading: false,
      uploads: [],
      error: null,
    });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setUploadState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    uploadState,
    uploadFile,
    uploadFiles,
    deleteFromS3,
    getFileUrl,
    clearUploads,
    clearError,
    getAssetConfig: getAssetUploadConfig,
  };
}

// Helper hook to get a file URL
export function useFileUrl(s3Key: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUrl = useCallback(async () => {
    if (!s3Key) {
      setUrl(null);
      return;
    }

    setIsLoading(true);
    try {
      const result = await getUrl({
        path: s3Key,
        options: { expiresIn: 3600 },
      });
      setUrl(result.url.toString());
    } catch (err) {
      console.error('Failed to get file URL:', err);
      setUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [s3Key]);

  return { url, isLoading, fetchUrl };
}
