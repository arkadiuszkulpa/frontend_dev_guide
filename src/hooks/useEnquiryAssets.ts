import { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import type { EnquiryAsset, EnquiryAssetFile } from '../types/assets';
import type { DesignAssets, AssetStatus } from '../types/enquiry';
import { isAdmin } from '../utils/authWhitelist';

const client = generateClient<Schema>();

interface UseEnquiryAssetsOptions {
  userGroups?: string[];
}

interface AssetData {
  asset: EnquiryAsset | null;
  files: EnquiryAssetFile[];
}

export function useEnquiryAssets(enquiryId: string, options: UseEnquiryAssetsOptions = {}) {
  const { userGroups } = options;
  const userIsAdmin = isAdmin(userGroups);

  // Map of assetKey -> { asset, files }
  const [assetsMap, setAssetsMap] = useState<Map<string, AssetData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Original design assets from enquiry (for status fallback)
  const [originalAssets, setOriginalAssets] = useState<DesignAssets | null>(null);

  const fetchAssets = useCallback(async () => {
    if (!enquiryId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch the enquiry first to get original design assets and verify access
      const { data: enquiry, errors: enquiryErrors } = await client.models.Enquiry.get(
        { id: enquiryId },
        { authMode: 'userPool' }
      );

      if (enquiryErrors) {
        throw new Error(enquiryErrors[0]?.message || 'Failed to fetch enquiry');
      }

      if (!enquiry) {
        throw new Error('Enquiry not found');
      }

      // Authorization is handled by GraphQL - if we got data, user has access

      // Parse original design assets
      let parsedAssets: DesignAssets | null = null;
      if (enquiry.designAssets) {
        try {
          parsedAssets =
            typeof enquiry.designAssets === 'string'
              ? JSON.parse(enquiry.designAssets)
              : enquiry.designAssets;
        } catch {
          console.error('Failed to parse design assets');
        }
      }
      setOriginalAssets(parsedAssets);

      // Fetch EnquiryAsset records
      const { data: assets, errors: assetErrors } = await client.models.EnquiryAsset.listAssetsByEnquiry(
        { enquiryId },
        { authMode: 'userPool' }
      );

      if (assetErrors) {
        console.error('Failed to fetch assets:', assetErrors);
      }

      // Fetch EnquiryAssetFile records
      const { data: files, errors: fileErrors } = await client.models.EnquiryAssetFile.listFilesByEnquiry(
        { enquiryId },
        { authMode: 'userPool' }
      );

      if (fileErrors) {
        console.error('Failed to fetch files:', fileErrors);
      }

      // Build the assets map
      const newMap = new Map<string, AssetData>();

      // Add assets from EnquiryAsset records
      (assets || []).forEach((asset) => {
        newMap.set(asset.assetKey, {
          asset: asset as unknown as EnquiryAsset,
          files: [],
        });
      });

      // Add files to their respective assets
      (files || []).forEach((file) => {
        const existing = newMap.get(file.assetKey);
        if (existing) {
          existing.files.push(file as unknown as EnquiryAssetFile);
        } else {
          newMap.set(file.assetKey, {
            asset: null,
            files: [file as unknown as EnquiryAssetFile],
          });
        }
      });

      // Sort files by uploadedAt (newest first)
      newMap.forEach((data) => {
        data.files.sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      });

      setAssetsMap(newMap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [enquiryId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Get status for an asset (from EnquiryAsset or fallback to original)
  const getAssetStatus = useCallback(
    (assetKey: keyof DesignAssets): AssetStatus => {
      const assetData = assetsMap.get(assetKey);
      if (assetData?.asset?.status) {
        return assetData.asset.status as AssetStatus;
      }
      if (originalAssets && originalAssets[assetKey]) {
        return originalAssets[assetKey];
      }
      return '';
    },
    [assetsMap, originalAssets]
  );

  // Get text content for an asset
  const getTextContent = useCallback(
    (assetKey: keyof DesignAssets): string => {
      const assetData = assetsMap.get(assetKey);
      return assetData?.asset?.textContent || '';
    },
    [assetsMap]
  );

  // Get files for an asset
  const getAssetFiles = useCallback(
    (assetKey: keyof DesignAssets): EnquiryAssetFile[] => {
      const assetData = assetsMap.get(assetKey);
      return assetData?.files || [];
    },
    [assetsMap]
  );

  // Create or update an EnquiryAsset record
  const updateAsset = useCallback(
    async (
      assetKey: keyof DesignAssets,
      updates: { status?: AssetStatus; textContent?: string; fileCount?: number }
    ): Promise<EnquiryAsset> => {
      const existing = assetsMap.get(assetKey);

      if (existing?.asset) {
        // Update existing
        const { data, errors } = await client.models.EnquiryAsset.update(
          {
            id: existing.asset.id,
            ...updates,
            lastUpdatedAt: new Date().toISOString(),
          },
          { authMode: 'userPool' }
        );

        if (errors) {
          throw new Error(errors[0]?.message || 'Failed to update asset');
        }

        // Update local state
        setAssetsMap((prev) => {
          const newMap = new Map(prev);
          const current = newMap.get(assetKey);
          if (current) {
            newMap.set(assetKey, {
              ...current,
              asset: data as unknown as EnquiryAsset,
            });
          }
          return newMap;
        });

        return data as unknown as EnquiryAsset;
      } else {
        // Create new
        const { data, errors } = await client.models.EnquiryAsset.create(
          {
            enquiryId,
            assetKey,
            status: updates.status || getAssetStatus(assetKey) || 'no',
            textContent: updates.textContent,
            fileCount: updates.fileCount || 0,
            lastUpdatedAt: new Date().toISOString(),
          },
          { authMode: 'userPool' }
        );

        if (errors) {
          throw new Error(errors[0]?.message || 'Failed to create asset');
        }

        // Update local state
        setAssetsMap((prev) => {
          const newMap = new Map(prev);
          const current = newMap.get(assetKey) || { asset: null, files: [] };
          newMap.set(assetKey, {
            ...current,
            asset: data as unknown as EnquiryAsset,
          });
          return newMap;
        });

        return data as unknown as EnquiryAsset;
      }
    },
    [enquiryId, assetsMap, getAssetStatus]
  );

  // Add a file record (after S3 upload)
  const addFile = useCallback(
    async (
      assetKey: keyof DesignAssets,
      fileData: {
        s3Key: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        thumbnailS3Key?: string;
        description?: string;
      }
    ): Promise<EnquiryAssetFile> => {
      // Ensure EnquiryAsset exists
      const existing = assetsMap.get(assetKey);
      let assetId: string;

      if (existing?.asset) {
        assetId = existing.asset.id;
      } else {
        // Create the asset first
        const asset = await updateAsset(assetKey, {
          status: 'yes',
          fileCount: 1,
        });
        assetId = asset.id;
      }

      // Create the file record
      const { data, errors } = await client.models.EnquiryAssetFile.create(
        {
          enquiryAssetId: assetId,
          enquiryId,
          assetKey,
          s3Key: fileData.s3Key,
          fileName: fileData.fileName,
          fileSize: fileData.fileSize,
          mimeType: fileData.mimeType,
          thumbnailS3Key: fileData.thumbnailS3Key,
          description: fileData.description,
          uploadedAt: new Date().toISOString(),
        },
        { authMode: 'userPool' }
      );

      if (errors) {
        throw new Error(errors[0]?.message || 'Failed to add file');
      }

      // Update file count
      const currentFiles = getAssetFiles(assetKey);
      await updateAsset(assetKey, {
        status: 'yes',
        fileCount: currentFiles.length + 1,
      });

      // Update local state
      setAssetsMap((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(assetKey) || { asset: null, files: [] };
        newMap.set(assetKey, {
          ...current,
          files: [data as unknown as EnquiryAssetFile, ...current.files],
        });
        return newMap;
      });

      return data as unknown as EnquiryAssetFile;
    },
    [enquiryId, assetsMap, updateAsset, getAssetFiles]
  );

  // Delete a file record
  const deleteFile = useCallback(
    async (fileId: string, assetKey: keyof DesignAssets): Promise<void> => {
      const { errors } = await client.models.EnquiryAssetFile.delete(
        { id: fileId },
        { authMode: 'userPool' }
      );

      if (errors) {
        throw new Error(errors[0]?.message || 'Failed to delete file');
      }

      // Update local state
      setAssetsMap((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(assetKey);
        if (current) {
          const updatedFiles = current.files.filter((f) => f.id !== fileId);
          newMap.set(assetKey, {
            ...current,
            files: updatedFiles,
          });

          // Update file count
          if (current.asset) {
            updateAsset(assetKey, { fileCount: updatedFiles.length });
          }
        }
        return newMap;
      });
    },
    [updateAsset]
  );

  // Calculate summary stats
  const getSummary = useCallback(() => {
    let ready = 0;
    let needed = 0;
    let notApplicable = 0;
    let withFiles = 0;

    assetsMap.forEach((data, key) => {
      const status = data.asset?.status || originalAssets?.[key as keyof DesignAssets] || '';
      if (['yes', 'draft', 'use-standard', 'create-from-logo', 'suggest-for-me'].includes(status)) {
        ready++;
      } else if (['no', 'not-sure'].includes(status)) {
        needed++;
      } else if (status === 'na') {
        notApplicable++;
      }

      if (data.files.length > 0) {
        withFiles++;
      }
    });

    // Also count original assets not in assetsMap
    if (originalAssets) {
      Object.entries(originalAssets).forEach(([key, status]) => {
        if (!assetsMap.has(key) && status) {
          if (['yes', 'draft', 'use-standard', 'create-from-logo', 'suggest-for-me'].includes(status)) {
            ready++;
          } else if (['no', 'not-sure'].includes(status)) {
            needed++;
          } else if (status === 'na') {
            notApplicable++;
          }
        }
      });
    }

    return { ready, needed, notApplicable, withFiles };
  }, [assetsMap, originalAssets]);

  return {
    isLoading,
    error,
    refetch: fetchAssets,
    getAssetStatus,
    getTextContent,
    getAssetFiles,
    updateAsset,
    addFile,
    deleteFile,
    getSummary,
    isAdmin: userIsAdmin,
  };
}
