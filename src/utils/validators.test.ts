import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isRequired,
  hasMinItems,
} from './validators';

describe('isValidEmail', () => {
  describe('invalid emails', () => {
    it.each([
      ['', 'empty string'],
      ['   ', 'whitespace only'],
      ['notanemail', 'no @ symbol'],
      ['missing@domain', 'no TLD'],
      ['@nodomain.com', 'no local part'],
      ['spaces in@email.com', 'spaces in local part'],
      ['double@@email.com', 'double @'],
      ['email@', 'nothing after @'],
      ['email@.com', 'dot immediately after @'],
    ])('rejects "%s" (%s)', (email) => {
      expect(isValidEmail(email)).toBe(false);
    });

    it('returns false for null/undefined (as string)', () => {
      expect(isValidEmail(null as unknown as string)).toBe(false);
      expect(isValidEmail(undefined as unknown as string)).toBe(false);
    });
  });

  describe('valid emails', () => {
    it.each([
      ['user@example.com', 'standard email'],
      ['user.name@example.com', 'with dot in local'],
      ['user+tag@example.com', 'with plus sign'],
      ['user@subdomain.example.com', 'with subdomain'],
      ['USER@EXAMPLE.COM', 'uppercase'],
      ['user@example.co.uk', 'multi-part TLD'],
      ['123@example.com', 'numeric local part'],
      ['user@123.com', 'numeric domain'],
      ['a@b.co', 'minimal valid email'],
      ['  user@example.com  ', 'with surrounding whitespace (trimmed)'],
    ])('accepts "%s" (%s)', (email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });
});

describe('isValidPhone', () => {
  describe('invalid phones', () => {
    it.each([
      ['', 'empty string'],
      ['   ', 'whitespace only'],
      ['123456789', 'no + prefix'],
      ['07911123456', 'UK format without +44'],
      ['+0123456789', 'starts with 0 after +'],
      ['+1', 'too short (only country code)'],
      ['+12345678901234567', 'too long (>15 digits)'],
      ['++44123456789', 'double +'],
      ['+44abc123456', 'contains letters'],
      ['44123456789', 'missing +'],
    ])('rejects "%s" (%s)', (phone) => {
      expect(isValidPhone(phone)).toBe(false);
    });

    it('returns false for null/undefined (as string)', () => {
      expect(isValidPhone(null as unknown as string)).toBe(false);
      expect(isValidPhone(undefined as unknown as string)).toBe(false);
    });
  });

  describe('valid phones', () => {
    it.each([
      ['+447911123456', 'UK mobile'],
      ['+44 7911 123456', 'UK with spaces'],
      ['+44-7911-123456', 'UK with dashes'],
      ['+1 555 123 4567', 'US with spaces'],
      ['+15551234567', 'US clean'],
      ['+1-555-123-4567', 'US with dashes'],
      ['+33123456789', 'France'],
      ['+49123456789', 'Germany'],
      ['+861012345678', 'China'],
      ['+81312345678', 'Japan'],
      ['+61412345678', 'Australia'],
      ['+91 98765 43210', 'India with spaces'],
      ['+12', 'minimum valid (country code + 1 digit)'],
      ['+123456789012345', 'maximum valid (15 digits)'],
    ])('accepts "%s" (%s)', (phone) => {
      expect(isValidPhone(phone)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('strips spaces before validation', () => {
      expect(isValidPhone('+44 7911 123 456')).toBe(true);
    });

    it('strips dashes before validation', () => {
      expect(isValidPhone('+1-555-123-4567')).toBe(true);
    });

    it('handles mixed spaces and dashes', () => {
      expect(isValidPhone('+44 7911-123 456')).toBe(true);
    });
  });
});

describe('isValidUrl', () => {
  describe('invalid URLs', () => {
    it.each([
      ['', 'empty string'],
      ['   ', 'whitespace only'],
      ['not-a-url', 'no protocol'],
      ['example.com', 'missing protocol'],
      ['ftp://example.com', 'ftp protocol'],
      ['mailto:user@example.com', 'mailto protocol'],
      ['javascript:alert(1)', 'javascript protocol'],
      ['file:///path/to/file', 'file protocol'],
    ])('rejects "%s" (%s)', (url) => {
      expect(isValidUrl(url)).toBe(false);
    });

    it('returns false for null/undefined (as string)', () => {
      expect(isValidUrl(null as unknown as string)).toBe(false);
      expect(isValidUrl(undefined as unknown as string)).toBe(false);
    });
  });

  describe('valid URLs', () => {
    it.each([
      ['https://example.com', 'basic https'],
      ['http://example.com', 'basic http'],
      ['https://www.example.com', 'with www'],
      ['https://example.com/path', 'with path'],
      ['https://example.com/path?query=1', 'with query string'],
      ['https://example.com:8080', 'with port'],
      ['https://subdomain.example.co.uk/path', 'complex URL'],
      ['  https://example.com  ', 'with surrounding whitespace'],
    ])('accepts "%s" (%s)', (url) => {
      expect(isValidUrl(url)).toBe(true);
    });
  });
});

describe('isRequired', () => {
  describe('invalid (empty) values', () => {
    it.each([
      ['', 'empty string'],
      ['   ', 'whitespace only'],
      ['\t\n', 'tabs and newlines'],
    ])('rejects "%s" (%s)', (value) => {
      expect(isRequired(value)).toBe(false);
    });
  });

  describe('valid (non-empty) values', () => {
    it.each([
      ['hello', 'simple string'],
      ['  hello  ', 'string with surrounding whitespace'],
      ['0', 'zero as string'],
      ['false', 'false as string'],
    ])('accepts "%s" (%s)', (value) => {
      expect(isRequired(value)).toBe(true);
    });
  });
});

describe('hasMinItems', () => {
  describe('with default min (1)', () => {
    it('returns false for empty array', () => {
      expect(hasMinItems([])).toBe(false);
    });

    it('returns true for array with one item', () => {
      expect(hasMinItems(['item'])).toBe(true);
    });

    it('returns true for array with multiple items', () => {
      expect(hasMinItems(['a', 'b', 'c'])).toBe(true);
    });
  });

  describe('with custom min', () => {
    it('returns true when array meets minimum', () => {
      expect(hasMinItems(['a', 'b'], 2)).toBe(true);
    });

    it('returns false when array is below minimum', () => {
      expect(hasMinItems(['a'], 2)).toBe(false);
    });

    it('returns true when array exceeds minimum', () => {
      expect(hasMinItems(['a', 'b', 'c'], 2)).toBe(true);
    });

    it('handles min of 0', () => {
      expect(hasMinItems([], 0)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles arrays of different types', () => {
      expect(hasMinItems([1, 2, 3])).toBe(true);
      expect(hasMinItems([{ a: 1 }])).toBe(true);
      expect(hasMinItems([null])).toBe(true);
    });

    it('returns false for non-array values', () => {
      expect(hasMinItems(null as unknown as unknown[])).toBe(false);
      expect(hasMinItems(undefined as unknown as unknown[])).toBe(false);
      expect(hasMinItems('string' as unknown as unknown[])).toBe(false);
    });
  });
});
