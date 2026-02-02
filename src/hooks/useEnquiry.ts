import { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import type { EnquiryStatus, NoteType, SectionKey, SectionNote } from '../types/admin';
import { isAdmin } from '../utils/authWhitelist';

const client = generateClient<Schema>();

type Enquiry = Schema['Enquiry']['type'];
type EnquiryNote = Schema['EnquiryNote']['type'];
type EnquirySectionNote = Schema['EnquirySectionNote']['type'];

interface UseEnquiryOptions {
  userGroups?: string[];
  userEmail?: string;
  groupsLoading?: boolean;
}

export function useEnquiry(id: string, options: UseEnquiryOptions = {}) {
  const { userGroups, userEmail, groupsLoading } = options;
  const userIsAdmin = isAdmin(userGroups);
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState<EnquiryNote[]>([]);
  const [sectionNotes, setSectionNotes] = useState<Map<SectionKey, SectionNote[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEnquiry = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, errors } = await client.models.Enquiry.get(
        { id },
        { authMode: 'userPool' }
      );

      if (errors) {
        throw new Error(errors[0]?.message || 'Failed to fetch enquiry');
      }

      // For non-admin users, verify email match
      // Skip check if groups are still loading (to avoid race condition)
      if (data && !groupsLoading && !userIsAdmin && userEmail) {
        if (data.email.toLowerCase() !== userEmail.toLowerCase()) {
          setError(new Error('You do not have permission to view this enquiry'));
          setEnquiry(null);
          setIsLoading(false);
          return;
        }
      }

      setEnquiry(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [id, userIsAdmin, userEmail, groupsLoading]);

  const fetchNotes = useCallback(async () => {
    if (!id) return;

    try {
      // Use list with filter instead of custom query
      const { data, errors } = await client.models.EnquiryNote.list({
        filter: { enquiryId: { eq: id } },
        authMode: 'userPool',
      });

      if (errors) {
        console.error('Failed to fetch notes:', errors);
        return;
      }

      // Sort by creation date, newest first
      const sortedNotes = (data || []).sort((a: EnquiryNote, b: EnquiryNote) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setNotes(sortedNotes);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  }, [id]);

  const fetchSectionNotes = useCallback(async () => {
    if (!id) return;

    try {
      const { data, errors } = await client.models.EnquirySectionNote.listSectionNotesByEnquiry(
        { enquiryId: id },
        { authMode: 'userPool' }
      );

      if (errors) {
        console.error('Failed to fetch section notes:', errors);
        return;
      }

      // Group notes by sectionKey
      const groupedNotes = new Map<SectionKey, SectionNote[]>();
      (data || []).forEach((note: EnquirySectionNote) => {
        const key = note.sectionKey as SectionKey;
        const existing = groupedNotes.get(key) || [];
        existing.push({
          id: note.id,
          enquiryId: note.enquiryId,
          sectionKey: key,
          content: note.content,
          createdBy: note.createdBy,
          createdAt: note.createdAt,
        });
        groupedNotes.set(key, existing);
      });

      // Sort each group by date (newest first)
      groupedNotes.forEach((notesList, key) => {
        notesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        groupedNotes.set(key, notesList);
      });

      setSectionNotes(groupedNotes);
    } catch (err) {
      console.error('Failed to fetch section notes:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchEnquiry();
    fetchNotes();
    fetchSectionNotes();
  }, [fetchEnquiry, fetchNotes, fetchSectionNotes]);

  const updateStatus = useCallback(
    async (status: EnquiryStatus): Promise<void> => {
      if (!enquiry) return;

      try {
        const { data, errors } = await client.models.Enquiry.update(
          {
            id: enquiry.id,
            status,
            ...(status === 'contacted' ? { lastContactedAt: new Date().toISOString() } : {}),
          },
          { authMode: 'userPool' }
        );

        if (errors) {
          throw new Error(errors[0]?.message || 'Failed to update status');
        }

        setEnquiry(data);
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
    [enquiry]
  );

  const addNote = useCallback(
    async (content: string, noteType: NoteType, createdBy: string) => {
      if (!id) return;

      try {
        const { data, errors } = await client.models.EnquiryNote.create(
          {
            enquiryId: id,
            content,
            noteType,
            createdBy,
          },
          { authMode: 'userPool' }
        );

        if (errors) {
          throw new Error(errors[0]?.message || 'Failed to add note');
        }

        // Refetch notes to include the new one
        await fetchNotes();
        return data;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
    [id, fetchNotes]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        const { errors } = await client.models.EnquiryNote.delete(
          { id: noteId },
          { authMode: 'userPool' }
        );

        if (errors) {
          throw new Error(errors[0]?.message || 'Failed to delete note');
        }

        // Refetch notes
        await fetchNotes();
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
    [fetchNotes]
  );

  // Add a section note (visible to enquiry owner)
  const addSectionNote = useCallback(
    async (sectionKey: SectionKey, content: string, createdBy: string) => {
      if (!id) return;

      try {
        const { data, errors } = await client.models.EnquirySectionNote.create(
          {
            enquiryId: id,
            sectionKey,
            content,
            createdBy,
          },
          { authMode: 'userPool' }
        );

        if (errors) {
          throw new Error(errors[0]?.message || 'Failed to add section note');
        }

        // Refetch section notes
        await fetchSectionNotes();
        return data;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
    [id, fetchSectionNotes]
  );

  // Delete a section note
  const deleteSectionNote = useCallback(
    async (noteId: string) => {
      try {
        const { errors } = await client.models.EnquirySectionNote.delete(
          { id: noteId },
          { authMode: 'userPool' }
        );

        if (errors) {
          throw new Error(errors[0]?.message || 'Failed to delete section note');
        }

        // Refetch section notes
        await fetchSectionNotes();
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
    [fetchSectionNotes]
  );

  // Helper to get notes for a specific section
  const getSectionNotes = useCallback(
    (sectionKey: SectionKey): SectionNote[] => {
      return sectionNotes.get(sectionKey) || [];
    },
    [sectionNotes]
  );

  return {
    enquiry,
    notes,
    sectionNotes,
    getSectionNotes,
    isLoading,
    error,
    refetch: fetchEnquiry,
    updateStatus,
    addNote,
    deleteNote,
    addSectionNote,
    deleteSectionNote,
    isAdmin: userIsAdmin,
  };
}
