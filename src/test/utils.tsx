/* eslint-disable react-refresh/only-export-components */
import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

interface WrapperOptions {
  initialEntries?: string[];
}

// All providers wrapper for component tests
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </BrowserRouter>
  );
}

// Memory router wrapper for tests that need specific routes
function createMemoryRouterWrapper(initialEntries: string[] = ['/']) {
  return function MemoryRouterWrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </MemoryRouter>
    );
  };
}

// Custom render with providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & WrapperOptions
) {
  const { initialEntries, ...renderOptions } = options || {};

  const Wrapper = initialEntries
    ? createMemoryRouterWrapper(initialEntries)
    : AllProviders;

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render with our custom render
export { customRender as render };

// Utility to wait for loading states to resolve
export async function waitForLoadingToFinish() {
  // Add a small delay to let React finish rendering
  await new Promise((resolve) => setTimeout(resolve, 0));
}

// Create a mock enquiry for testing
export function createMockEnquiry(overrides = {}) {
  return {
    id: 'test-enquiry-id',
    involvementLevel: 'do-it-for-me',
    accountManagement: 'you-manage',
    websiteComplexity: 'simple-static',
    corePages: ['home', 'about', 'contact'],
    corePagesOther: '',
    dynamicFeatures: [],
    dynamicFeaturesOther: '',
    advancedFeatures: [],
    advancedFeaturesOther: '',
    aiFeatures: [],
    businessName: 'Test Business',
    businessDescription: 'A test business description',
    competitorWebsites: [],
    inspirationWebsite: '',
    inspirationReason: '',
    designAssets: '{}',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+447911123456',
    preferredContact: 'email',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}
