import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEnquiry } from '../../hooks/useEnquiry';
import { useUserGroups } from '../../hooks/useUserGroups';
import { EnquiryStatusBadge } from '../../components/admin/EnquiryStatusBadge';
import { EnquirySection } from '../../components/admin/EnquirySection';
import { StatusDropdown } from '../../components/admin/StatusDropdown';
import { NotesList } from '../../components/admin/NotesList';
import { AddNoteForm } from '../../components/admin/AddNoteForm';
import { SectionNoteDisplay } from '../../components/admin/SectionNoteDisplay';
import { AddSectionNoteForm } from '../../components/admin/AddSectionNoteForm';
import type { EnquiryStatus, NoteType, SectionKey } from '../../types/admin';

interface DesignAssets {
  [key: string]: string;
}

function getInvolvementLabel(value?: string): string {
  if (!value) return '';
  const labels: Record<string, string> = {
    'do-it-for-me': 'Do it for me',
    'teach-me-basics': 'Teach me the basics',
    'guide-me': 'Guide me through it',
  };
  return labels[value] || value;
}

function getAccountManagementLabel(value?: string): string {
  if (!value) return '';
  const labels: Record<string, string> = {
    'you-manage': "You manage everything in your accounts",
    'my-name-you-setup': 'Set them up in my name, but you do the setup',
    'walk-me-through': 'Walk me through it so I own and understand it',
  };
  return labels[value] || value;
}

function getComplexityLabel(value?: string): string {
  if (!value) return '';
  const labels: Record<string, string> = {
    'simple-static': 'Simple & static',
    'some-moving-parts': 'Some moving parts',
    'full-featured': 'Full-featured',
  };
  return labels[value] || value;
}

function getPreferredContactLabel(value?: string): string {
  if (!value) return '';
  const labels: Record<string, string> = {
    'email': 'Email',
    'phone': 'Phone',
    'whatsapp': 'WhatsApp',
  };
  return labels[value] || value;
}

function parseDesignAssets(value: unknown): DesignAssets {
  if (!value) return {};
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  if (typeof value === 'object') return value as DesignAssets;
  return {};
}

function summarizeAssets(assets: DesignAssets): string {
  let ready = 0;
  let needed = 0;
  let notApplicable = 0;

  Object.values(assets).forEach(status => {
    if (['yes', 'draft', 'use-standard', 'create-from-logo', 'suggest-for-me'].includes(status)) {
      ready++;
    } else if (['no', 'not-sure'].includes(status)) {
      needed++;
    } else if (status === 'na') {
      notApplicable++;
    }
  });

  return `${ready} ready, ${needed} need help, ${notApplicable} N/A`;
}

export function EnquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthenticator((context) => [context.user]);
  const { groups } = useUserGroups();
  const userEmail = user?.signInDetails?.loginId;
  const {
    enquiry,
    notes,
    isLoading,
    error,
    updateStatus,
    addNote,
    deleteNote,
    isAdmin,
    getSectionNotes,
    addSectionNote,
    deleteSectionNote,
  } = useEnquiry(id || '', { userGroups: groups, userEmail });

  // State for design assets section note form
  const [showDesignAssetsNoteForm, setShowDesignAssetsNoteForm] = useState(false);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading enquiry...</p>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">
          {error?.message || 'Enquiry not found'}
        </p>
        <Link
          to="/account/enquiries"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to enquiries
        </Link>
      </div>
    );
  }

  const handleAddNote = async (content: string, noteType: NoteType) => {
    const email = user?.signInDetails?.loginId || 'Unknown';
    await addNote(content, noteType, email);
  };

  const handleAddSectionNote = async (sectionKey: SectionKey, content: string) => {
    const email = user?.signInDetails?.loginId || 'Unknown';
    await addSectionNote(sectionKey, content, email);
  };

  const handleDeleteSectionNote = async (noteId: string) => {
    await deleteSectionNote(noteId);
  };

  const designAssets = parseDesignAssets(enquiry.designAssets);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/account/enquiries"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to enquiries
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{enquiry.fullName}</h1>
              <EnquiryStatusBadge status={(enquiry.status as EnquiryStatus) || 'new'} />
            </div>
            {enquiry.businessName && (
              <p className="text-gray-600 mt-1">{enquiry.businessName}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Submitted on {new Date(enquiry.createdAt).toLocaleDateString()} at{' '}
              {new Date(enquiry.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {isAdmin && (
            <StatusDropdown
              currentStatus={(enquiry.status as EnquiryStatus) || 'new'}
              onStatusChange={updateStatus}
            />
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        {/* Main Content - Enquiry Details */}
        <div className={`${isAdmin ? 'lg:col-span-2' : ''} space-y-6`}>
          <EnquirySection
            title="Contact Information"
            sectionKey="contact"
            notes={getSectionNotes('contact')}
            isAdmin={isAdmin}
            onAddNote={(content) => handleAddSectionNote('contact', content)}
            onDeleteNote={handleDeleteSectionNote}
            fields={[
              { label: 'Full Name', value: enquiry.fullName },
              { label: 'Email', value: enquiry.email },
              { label: 'Phone', value: enquiry.phone },
              { label: 'Preferred Contact', value: getPreferredContactLabel(enquiry.preferredContact) },
              { label: 'Business Name', value: enquiry.businessName },
            ]}
          />

          <EnquirySection
            title="Working Relationship"
            sectionKey="workingRelationship"
            notes={getSectionNotes('workingRelationship')}
            isAdmin={isAdmin}
            onAddNote={(content) => handleAddSectionNote('workingRelationship', content)}
            onDeleteNote={handleDeleteSectionNote}
            fields={[
              { label: 'Involvement Level', value: getInvolvementLabel(enquiry.involvementLevel) },
              { label: 'Account Management', value: getAccountManagementLabel(enquiry.accountManagement || '') },
            ]}
          />

          <EnquirySection
            title="Website Requirements"
            sectionKey="websiteRequirements"
            notes={getSectionNotes('websiteRequirements')}
            isAdmin={isAdmin}
            onAddNote={(content) => handleAddSectionNote('websiteRequirements', content)}
            onDeleteNote={handleDeleteSectionNote}
            fields={[
              { label: 'Complexity Tier', value: getComplexityLabel(enquiry.websiteComplexity) },
              { label: 'Core Pages', value: enquiry.corePages },
              { label: 'Core Pages (Other)', value: enquiry.corePagesOther },
              { label: 'Dynamic Features', value: enquiry.dynamicFeatures },
              { label: 'Dynamic Features (Other)', value: enquiry.dynamicFeaturesOther },
              { label: 'Advanced Features', value: enquiry.advancedFeatures },
              { label: 'Advanced Features (Other)', value: enquiry.advancedFeaturesOther },
            ]}
          />

          <EnquirySection
            title="AI Features"
            sectionKey="aiFeatures"
            notes={getSectionNotes('aiFeatures')}
            isAdmin={isAdmin}
            onAddNote={(content) => handleAddSectionNote('aiFeatures', content)}
            onDeleteNote={handleDeleteSectionNote}
            fields={[{ label: 'Selected AI Features', value: enquiry.aiFeatures }]}
          />

          <EnquirySection
            title="Business Information"
            sectionKey="businessInfo"
            notes={getSectionNotes('businessInfo')}
            isAdmin={isAdmin}
            onAddNote={(content) => handleAddSectionNote('businessInfo', content)}
            onDeleteNote={handleDeleteSectionNote}
            fields={[
              { label: 'Business Description', value: enquiry.businessDescription },
              { label: 'Competitor Websites', value: enquiry.competitorWebsites },
              { label: 'Inspiration Website', value: enquiry.inspirationWebsite },
              { label: 'Inspiration Reason', value: enquiry.inspirationReason },
            ]}
          />

          {/* Design Assets Section with Manage Link */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Design Assets</h3>
              <div className="flex items-center gap-3">
                {isAdmin && !showDesignAssetsNoteForm && (
                  <button
                    onClick={() => setShowDesignAssetsNoteForm(true)}
                    className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add note
                  </button>
                )}
                <Link
                  to={`/account/enquiries/${id}/assets`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Manage Assets
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Add note form (admin only) */}
            {showDesignAssetsNoteForm && (
              <AddSectionNoteForm
                onSubmit={async (content) => {
                  await handleAddSectionNote('designAssets', content);
                  setShowDesignAssetsNoteForm(false);
                }}
                onCancel={() => setShowDesignAssetsNoteForm(false)}
              />
            )}

            {/* Section notes */}
            <SectionNoteDisplay
              notes={getSectionNotes('designAssets')}
              onDelete={isAdmin ? handleDeleteSectionNote : undefined}
              isAdmin={isAdmin}
            />

            <div className="text-gray-600">
              <p className="text-sm">{summarizeAssets(designAssets)}</p>
              <p className="text-xs text-gray-500 mt-2">
                Click "Manage Assets" to upload files and provide your design materials.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Notes (Admin only) */}
        {isAdmin && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>

              <div className="mb-6">
                <NotesList
                  notes={notes.map((n) => ({
                    id: n.id,
                    content: n.content,
                    createdBy: n.createdBy,
                    createdAt: n.createdAt,
                    noteType: n.noteType as NoteType | null,
                  }))}
                  onDelete={deleteNote}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Add New Note</h4>
                <AddNoteForm onSubmit={handleAddNote} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
