/**
 * Admin whitelist for role-based access control
 *
 * Admin users can see and edit all enquiries.
 * Regular users can only see enquiries matching their email.
 */

/**
 * Parse admin whitelist from environment variable
 */
function getAdminEmails(): string[] {
  const whitelist = import.meta.env.VITE_ADMIN_EMAILS || '';
  return whitelist
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

/**
 * Check if a user email has admin privileges
 */
export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;

  const adminEmails = getAdminEmails();

  // If no admin list configured, no one is admin (fail-safe)
  if (adminEmails.length === 0) {
    return false;
  }

  return adminEmails.includes(email.toLowerCase().trim());
}
