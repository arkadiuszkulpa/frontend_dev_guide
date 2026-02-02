import { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Hook to fetch the current user's Cognito groups from their session
 */
export function useUserGroups() {
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const session = await fetchAuthSession();
        const payload = session.tokens?.accessToken?.payload;
        const userGroups = (payload?.['cognito:groups'] as string[]) || [];
        setGroups(userGroups);
      } catch {
        // User not authenticated or session expired
        setGroups([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroups();
  }, []);

  return { groups, isLoading };
}
