/**
 * Admin check using Cognito groups
 *
 * Admin users (in 'Admins' group) can see and edit all enquiries.
 * Regular users can only see enquiries they own.
 */

/**
 * Check if a user has admin privileges based on their Cognito groups
 */
export function isAdmin(groups: string[] | undefined): boolean {
  if (!groups || groups.length === 0) return false;
  return groups.includes('Admins');
}
