import { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import type { EnquiryStatus } from '../types/admin';
import { isAdmin } from '../utils/authWhitelist';

const client = generateClient<Schema>();

type Enquiry = Schema['Enquiry']['type'];

interface UseEnquiriesOptions {
  statusFilter?: EnquiryStatus | 'all';
  userGroups?: string[];
  userEmail?: string;
  groupsLoading?: boolean;
}

export function useEnquiries(options: UseEnquiriesOptions = {}) {
  const { statusFilter = 'all', userGroups, userEmail, groupsLoading } = options;
  const userIsAdmin = isAdmin(userGroups);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, errors } = await client.models.Enquiry.list({
        authMode: 'userPool',
      });

      if (errors) {
        throw new Error(errors[0]?.message || 'Failed to fetch enquiries');
      }

      let filteredData = data || [];

      // For non-admin users, filter by email match
      // This is frontend filtering - the backend allows all authenticated users to read
      // but we only show enquiries matching their email
      // Skip filtering if groups are still loading (to avoid race condition)
      if (!groupsLoading && !userIsAdmin && userEmail) {
        filteredData = filteredData.filter(
          (e) => e.email.toLowerCase() === userEmail.toLowerCase()
        );
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filteredData = filteredData.filter((e) => (e.status || 'new') === statusFilter);
      }

      // Sort by creation date, newest first
      filteredData.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setEnquiries(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, userIsAdmin, userEmail, groupsLoading]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Calculate stats
  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => !e.status || e.status === 'new').length,
    inReview: enquiries.filter((e) => e.status === 'in_review').length,
    contacted: enquiries.filter((e) => e.status === 'contacted').length,
    quoted: enquiries.filter((e) => e.status === 'quoted').length,
    accepted: enquiries.filter((e) => e.status === 'accepted').length,
    declined: enquiries.filter((e) => e.status === 'declined').length,
    completed: enquiries.filter((e) => e.status === 'completed').length,
  };

  return {
    enquiries,
    isLoading,
    error,
    refetch: fetchEnquiries,
    stats,
    isAdmin: userIsAdmin,
  };
}
