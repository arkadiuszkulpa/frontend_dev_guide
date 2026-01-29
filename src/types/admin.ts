export type EnquiryStatus =
  | 'new'
  | 'in_review'
  | 'contacted'
  | 'quoted'
  | 'accepted'
  | 'declined'
  | 'completed';

export type NoteType =
  | 'context'
  | 'call_summary'
  | 'quote_sent'
  | 'follow_up'
  | 'general';

export const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  contacted: 'Contacted',
  quoted: 'Quote Sent',
  accepted: 'Accepted',
  declined: 'Declined',
  completed: 'Completed',
};

export const STATUS_COLORS: Record<EnquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-purple-100 text-purple-800',
  quoted: 'bg-orange-100 text-orange-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  context: 'Context',
  call_summary: 'Call Summary',
  quote_sent: 'Quote Sent',
  follow_up: 'Follow Up',
  general: 'General',
};

export const NOTE_TYPE_COLORS: Record<NoteType, string> = {
  context: 'bg-blue-100 text-blue-700',
  call_summary: 'bg-green-100 text-green-700',
  quote_sent: 'bg-orange-100 text-orange-700',
  follow_up: 'bg-purple-100 text-purple-700',
  general: 'bg-gray-100 text-gray-700',
};

// Section keys for section-specific notes (visible to enquiry owner)
export type SectionKey =
  | 'contact'
  | 'workingRelationship'
  | 'websiteRequirements'
  | 'aiFeatures'
  | 'businessInfo'
  | 'designAssets';

export const SECTION_LABELS: Record<SectionKey, string> = {
  contact: 'Contact Information',
  workingRelationship: 'Working Relationship',
  websiteRequirements: 'Website Requirements',
  aiFeatures: 'AI Features',
  businessInfo: 'Business Information',
  designAssets: 'Design Assets',
};

export interface SectionNote {
  id: string;
  enquiryId: string;
  sectionKey: SectionKey;
  content: string;
  createdBy: string;
  createdAt: string;
}
