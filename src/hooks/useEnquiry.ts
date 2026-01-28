import { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import type { EnquiryStatus, NoteType } from '../types/admin';
import { isAdmin } from '../utils/authWhitelist';

const client = generateClient<Schema>();

type Enquiry = Schema['Enquiry']['type'];
type EnquiryNote = Schema['EnquiryNote']['type'];

interface UseEnquiryOptions {
  userEmail?: string;
}

export function useEnquiry(id: string, options: UseEnquiryOptions = {}) {
  const { userEmail } = options;
  const userIsAdmin = isAdmin(userEmail);
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState<EnquiryNote[]>([]);
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

      // Check if user has access to this enquiry
      if (data && !userIsAdmin && userEmail) {
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
  }, [id, userEmail, userIsAdmin]);

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

  useEffect(() => {
    fetchEnquiry();
    fetchNotes();
  }, [fetchEnquiry, fetchNotes]);

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

  return {
    enquiry,
    notes,
    isLoading,
    error,
    refetch: fetchEnquiry,
    updateStatus,
    addNote,
    deleteNote,
    isAdmin: userIsAdmin,
  };
}
