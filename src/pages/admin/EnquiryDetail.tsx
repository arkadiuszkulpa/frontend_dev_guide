import { useParams, Link } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEnquiry } from '../../hooks/useEnquiry';
import { EnquiryStatusBadge } from '../../components/admin/EnquiryStatusBadge';
import { EnquirySection } from '../../components/admin/EnquirySection';
import { StatusDropdown } from '../../components/admin/StatusDropdown';
import { NotesList } from '../../components/admin/NotesList';
import { AddNoteForm } from '../../components/admin/AddNoteForm';
import type { EnquiryStatus, NoteType } from '../../types/admin';

export function EnquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthenticator((context) => [context.user]);
  const { enquiry, notes, isLoading, error, updateStatus, addNote, deleteNote } = useEnquiry(
    id || ''
  );

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
          to="/admin/enquiries"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to enquiries
        </Link>
      </div>
    );
  }

  const handleAddNote = async (content: string, noteType: NoteType) => {
    const userEmail = user?.signInDetails?.loginId || 'Unknown';
    await addNote(content, noteType, userEmail);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/enquiries"
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

          <StatusDropdown
            currentStatus={(enquiry.status as EnquiryStatus) || 'new'}
            onStatusChange={updateStatus}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Enquiry Details */}
        <div className="lg:col-span-2 space-y-6">
          <EnquirySection
            title="Contact Information"
            fields={[
              { label: 'Full Name', value: enquiry.fullName },
              { label: 'Email', value: enquiry.email },
              { label: 'Phone', value: enquiry.phone },
              { label: 'Business Name', value: enquiry.businessName },
            ]}
          />

          <EnquirySection
            title="Business Understanding"
            fields={[{ label: 'Business Description', value: enquiry.businessDescription }]}
          />

          <EnquirySection
            title="Goals"
            fields={[
              { label: 'Primary Goal', value: enquiry.primaryGoal },
              { label: 'Secondary Goals', value: enquiry.secondaryGoals },
            ]}
          />

          <EnquirySection
            title="Current Situation"
            fields={[
              { label: 'Has Existing Website', value: enquiry.hasExistingWebsite },
              { label: 'Existing Website URL', value: enquiry.existingWebsiteUrl },
              { label: 'Current Challenges', value: enquiry.currentChallenges },
            ]}
          />

          <EnquirySection
            title="Target Audience"
            fields={[
              { label: 'Target Audience', value: enquiry.targetAudience },
              { label: 'Audience Location', value: enquiry.audienceLocation },
            ]}
          />

          <EnquirySection
            title="Content & Features"
            fields={[
              { label: 'Content Types', value: enquiry.contentTypes },
              { label: 'Desired Features', value: enquiry.desiredFeatures },
            ]}
          />

          <EnquirySection
            title="Style Preferences"
            fields={[
              { label: 'Style Preference', value: enquiry.stylePreference },
              { label: 'Example Sites', value: enquiry.exampleSites },
            ]}
          />

          <EnquirySection
            title="Timeline & Budget"
            fields={[
              { label: 'Urgency', value: enquiry.urgency },
              { label: 'Budget Range', value: enquiry.budgetRange },
            ]}
          />

          {enquiry.additionalNotes && (
            <EnquirySection
              title="Additional Notes"
              fields={[{ label: 'Notes from Client', value: enquiry.additionalNotes }]}
            />
          )}
        </div>

        {/* Sidebar - Notes */}
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
      </div>
    </div>
  );
}
