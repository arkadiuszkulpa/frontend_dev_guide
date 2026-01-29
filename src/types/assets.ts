import type { DesignAssets, AssetStatus } from './enquiry';

// ============================================================================
// Asset Upload Types
// ============================================================================

export type AssetInputType = 'file' | 'text' | 'both';

export interface AssetUploadConfig {
  inputType: AssetInputType;
  allowMultiple: boolean;
  acceptedTypes: string[];
  maxFileSizeMB: number;
}

// ============================================================================
// Database Model Types (matching Amplify schema)
// ============================================================================

export interface EnquiryAsset {
  id: string;
  enquiryId: string;
  assetKey: keyof DesignAssets;
  status: AssetStatus;
  textContent?: string | null;
  fileCount?: number | null;
  lastUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryAssetFile {
  id: string;
  enquiryAssetId: string;
  enquiryId: string;
  assetKey: string;
  s3Key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailS3Key?: string | null;
  description?: string | null;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Upload State Types
// ============================================================================

export interface UploadProgress {
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface AssetUploadState {
  isUploading: boolean;
  uploads: UploadProgress[];
  error: string | null;
}

// ============================================================================
// Asset Upload Configuration by Asset Key
// ============================================================================

// Default configurations for different asset types
const FILE_CONFIG = (
  acceptedTypes: string[],
  maxSizeMB: number = 10,
  allowMultiple: boolean = false
): AssetUploadConfig => ({
  inputType: 'file',
  allowMultiple,
  acceptedTypes,
  maxFileSizeMB: maxSizeMB,
});

const TEXT_CONFIG: AssetUploadConfig = {
  inputType: 'text',
  allowMultiple: false,
  acceptedTypes: [],
  maxFileSizeMB: 0,
};

const BOTH_CONFIG = (
  acceptedTypes: string[],
  maxSizeMB: number = 5
): AssetUploadConfig => ({
  inputType: 'both',
  allowMultiple: false,
  acceptedTypes,
  maxFileSizeMB: maxSizeMB,
});

// Image types
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const VECTOR_TYPES = ['image/svg+xml', 'application/postscript', '.ai', '.eps'];
const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc',
  '.docx',
  '.txt',
];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi'];
const AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];

export const ASSET_UPLOAD_CONFIG: Record<keyof DesignAssets, AssetUploadConfig> = {
  // Branding
  logo: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES], 10, true), // Allow multiple logo variations
  logoVariations: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES], 10, true),
  brandColours: BOTH_CONFIG([...DOCUMENT_TYPES, ...IMAGE_TYPES], 5), // Can describe or upload palette
  brandFonts: FILE_CONFIG(['.ttf', '.otf', '.woff', '.woff2', 'application/pdf'], 20, true),
  brandGuidelines: FILE_CONFIG(DOCUMENT_TYPES, 20),

  // Photography & Imagery
  heroImage: FILE_CONFIG(IMAGE_TYPES, 20),
  teamPhotos: FILE_CONFIG(IMAGE_TYPES, 20, true), // Multiple team photos
  productPhotos: FILE_CONFIG(IMAGE_TYPES, 20, true),
  servicePhotos: FILE_CONFIG(IMAGE_TYPES, 20, true),
  locationPhotos: FILE_CONFIG(IMAGE_TYPES, 20, true),
  behindScenes: FILE_CONFIG(IMAGE_TYPES, 20, true),
  customerPhotos: FILE_CONFIG(IMAGE_TYPES, 20, true),
  stockImagery: FILE_CONFIG(IMAGE_TYPES, 20, true),

  // Graphics & Visual Elements
  icons: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES], 10, true),
  illustrations: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES], 20, true),
  infographics: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES, 'application/pdf'], 20, true),
  charts: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES, 'application/pdf'], 10, true),
  backgrounds: FILE_CONFIG(IMAGE_TYPES, 20, true),
  socialGraphics: FILE_CONFIG(IMAGE_TYPES, 10, true),
  favicon: FILE_CONFIG(['image/png', 'image/x-icon', 'image/svg+xml', '.ico'], 1),

  // Video & Media
  promoVideo: FILE_CONFIG(VIDEO_TYPES, 500), // Up to 500MB for video
  productDemos: FILE_CONFIG(VIDEO_TYPES, 500, true),
  testimonialVideos: FILE_CONFIG(VIDEO_TYPES, 500, true),
  backgroundVideo: FILE_CONFIG(VIDEO_TYPES, 100),
  audioFiles: FILE_CONFIG(AUDIO_TYPES, 50, true),

  // Written Content - text input with optional document upload
  homepageText: BOTH_CONFIG(DOCUMENT_TYPES),
  aboutText: BOTH_CONFIG(DOCUMENT_TYPES),
  serviceDescriptions: BOTH_CONFIG(DOCUMENT_TYPES),
  teamBios: BOTH_CONFIG(DOCUMENT_TYPES),
  testimonials: BOTH_CONFIG(DOCUMENT_TYPES),
  caseStudies: BOTH_CONFIG(DOCUMENT_TYPES),
  faqContent: BOTH_CONFIG(DOCUMENT_TYPES),
  blogPosts: BOTH_CONFIG(DOCUMENT_TYPES),
  legalText: BOTH_CONFIG(DOCUMENT_TYPES),
  tagline: TEXT_CONFIG, // Short text only
  callToAction: TEXT_CONFIG, // Short text only

  // Documents & Files
  brochures: FILE_CONFIG(DOCUMENT_TYPES, 20, true),
  priceLists: FILE_CONFIG([...DOCUMENT_TYPES, ...IMAGE_TYPES], 10, true),
  catalogues: FILE_CONFIG(DOCUMENT_TYPES, 50, true),
  certificates: FILE_CONFIG([...DOCUMENT_TYPES, ...IMAGE_TYPES], 10, true),
  pressMentions: FILE_CONFIG([...DOCUMENT_TYPES, ...IMAGE_TYPES], 10, true),

  // Social Proof & Trust Elements
  clientLogos: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES], 10, true),
  partnerLogos: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES], 10, true),
  certificationBadges: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES], 5, true),
  awardLogos: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES], 5, true),
  asSeenIn: FILE_CONFIG([...IMAGE_TYPES, ...VECTOR_TYPES], 5, true),
  starRatings: FILE_CONFIG(IMAGE_TYPES, 2, true),

  // Existing Digital Assets - these are mostly informational, limited upload
  existingContent: FILE_CONFIG([...DOCUMENT_TYPES, '.zip'], 100, true), // Allow zip for bulk content
  domainOwned: TEXT_CONFIG, // Just need the domain name text
  emailAccounts: TEXT_CONFIG, // List of email accounts
  customerDatabase: FILE_CONFIG(['.csv', '.xlsx', '.xls', 'application/pdf'], 50),
  productDatabase: FILE_CONFIG(['.csv', '.xlsx', '.xls', 'application/pdf'], 50),
  socialAccounts: TEXT_CONFIG, // List of social media URLs
  googleBusiness: TEXT_CONFIG, // Google Business URL
};

// ============================================================================
// Helper Functions
// ============================================================================

export function getAssetUploadConfig(assetKey: keyof DesignAssets): AssetUploadConfig {
  return ASSET_UPLOAD_CONFIG[assetKey];
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

export function isPdfFile(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export function generateS3Key(
  enquiryId: string,
  category: string,
  assetKey: string,
  fileName: string
): string {
  const uuid = crypto.randomUUID();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `enquiry-assets/${enquiryId}/${category}/${assetKey}/${uuid}_${sanitizedFileName}`;
}

export function validateFile(
  file: File,
  config: AssetUploadConfig
): { valid: boolean; error?: string } {
  // Check file size
  const maxSizeBytes = config.maxFileSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${config.maxFileSizeMB}MB`,
    };
  }

  // Check file type
  if (config.acceptedTypes.length > 0) {
    const fileExtension = `.${getFileExtension(file.name)}`;
    const isTypeAccepted = config.acceptedTypes.some(
      (type) =>
        file.type === type ||
        file.type.match(type.replace('*', '.*')) ||
        fileExtension.toLowerCase() === type.toLowerCase()
    );

    if (!isTypeAccepted) {
      return {
        valid: false,
        error: `File type not accepted. Allowed types: ${config.acceptedTypes.join(', ')}`,
      };
    }
  }

  return { valid: true };
}
