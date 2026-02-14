/**
 * E2E Test Configuration
 *
 * This file contains test user credentials and API setup for E2E tests.
 * Credentials are loaded from environment variables (GitHub Secrets in CI).
 */

export const testConfig = {
  // Test user (regular member)
  testUser: {
    email: process.env.E2E_TEST_USER_EMAIL || 'test_user@arkadiuszkulpa.co.uk',
    password: process.env.E2E_TEST_USER_PASSWORD || 'London1234$$',
  },

  // Admin test user (in Cognito "Admins" group)
  adminUser: {
    email: process.env.E2E_ADMIN_EMAIL || 'test_admin@arkadiuszkulpa.co.uk',
    password: process.env.E2E_ADMIN_PASSWORD || 'London1234$$',
  },

  // Base URL for the application
  baseUrl: process.env.BASE_URL || 'http://localhost:5177',

  // AWS region for API calls
  awsRegion: process.env.AWS_REGION || 'eu-west-2',

  // Test data markers (for cleanup)
  testMarkers: {
    businessDescriptionPrefix: '[E2E-TEST]',
    testEmailDomain: 'e2e-test.example.com',
  },
};

/**
 * Generate a unique test email for this test run
 * Format: e2e-{timestamp}@e2e-test.example.com
 */
export function generateTestEmail(): string {
  return `e2e-${Date.now()}@${testConfig.testMarkers.testEmailDomain}`;
}

/**
 * Generate test form data with unique identifiers
 */
export function generateTestFormData(overrides: Partial<TestFormData> = {}): TestFormData {
  const timestamp = Date.now();
  return {
    fullName: `E2E Test User ${timestamp}`,
    email: generateTestEmail(),
    phone: '+44 7911 123456',
    businessDescription: `${testConfig.testMarkers.businessDescriptionPrefix} Automated test submission at ${new Date().toISOString()}`,
    competitorUrl: 'https://example.com',
    ...overrides,
  };
}

export interface TestFormData {
  fullName: string;
  email: string;
  phone: string;
  businessDescription: string;
  competitorUrl: string;
}

/**
 * Check if we have valid test credentials configured
 */
export function hasTestCredentials(): boolean {
  return !!(testConfig.testUser.password && testConfig.adminUser.password);
}

/**
 * Check if we're running in CI environment
 */
export function isCI(): boolean {
  return !!process.env.CI;
}
