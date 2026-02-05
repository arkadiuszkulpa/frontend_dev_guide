/**
 * Form validation utilities
 *
 * These validators are extracted to enable comprehensive unit testing
 * while being reusable across form components.
 */

/**
 * Validates an email address using a standard regex pattern.
 * Accepts most common email formats.
 *
 * @param email - The email string to validate
 * @returns true if the email is valid, false otherwise
 *
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid') // false
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.trim() === '') return false;
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates a phone number in E.164 format.
 * E.164 format: + followed by country code and number, 1-15 digits total.
 * Allows spaces and dashes which are stripped before validation.
 *
 * @param phone - The phone string to validate
 * @returns true if the phone is valid E.164 format, false otherwise
 *
 * @example
 * isValidPhone('+447911123456') // true (UK)
 * isValidPhone('+1 555 123 4567') // true (US with spaces)
 * isValidPhone('07911123456') // false (no + prefix)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || phone.trim() === '') return false;
  // Remove spaces and dashes before validation
  const cleaned = phone.replace(/[\s-]/g, '');
  // E.164: + followed by 1-15 digits, first digit cannot be 0
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(cleaned);
}

/**
 * Validates a URL string.
 * Accepts http:// and https:// URLs.
 *
 * @param url - The URL string to validate
 * @returns true if the URL is valid, false otherwise
 *
 * @example
 * isValidUrl('https://example.com') // true
 * isValidUrl('not-a-url') // false
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates that a required string field is not empty.
 *
 * @param value - The string to validate
 * @returns true if the string is non-empty after trimming
 */
export function isRequired(value: string): boolean {
  return value !== undefined && value !== null && value.trim() !== '';
}

/**
 * Validates that an array has at least one item.
 *
 * @param arr - The array to validate
 * @returns true if the array has at least one item
 */
export function hasMinItems<T>(arr: T[], min: number = 1): boolean {
  return Array.isArray(arr) && arr.length >= min;
}
