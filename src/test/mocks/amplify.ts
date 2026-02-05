import { vi } from 'vitest';

// Mock Amplify Data Client
export const mockAmplifyClient = {
  models: {
    Enquiry: {
      list: vi.fn().mockResolvedValue({ data: [], errors: null }),
      get: vi.fn().mockResolvedValue({ data: null, errors: null }),
      create: vi.fn().mockResolvedValue({ data: null, errors: null }),
      update: vi.fn().mockResolvedValue({ data: null, errors: null }),
      delete: vi.fn().mockResolvedValue({ data: null, errors: null }),
    },
    EnquiryNote: {
      list: vi.fn().mockResolvedValue({ data: [], errors: null }),
      create: vi.fn().mockResolvedValue({ data: null, errors: null }),
      delete: vi.fn().mockResolvedValue({ data: null, errors: null }),
    },
    EnquiryAsset: {
      listAssetsByEnquiry: vi.fn().mockResolvedValue({ data: [], errors: null }),
      create: vi.fn().mockResolvedValue({ data: null, errors: null }),
      update: vi.fn().mockResolvedValue({ data: null, errors: null }),
    },
    EnquiryAssetFile: {
      listFilesByEnquiry: vi.fn().mockResolvedValue({ data: [], errors: null }),
      create: vi.fn().mockResolvedValue({ data: null, errors: null }),
      delete: vi.fn().mockResolvedValue({ data: null, errors: null }),
    },
    EnquirySectionNote: {
      listSectionNotesByEnquiry: vi.fn().mockResolvedValue({ data: [], errors: null }),
      create: vi.fn().mockResolvedValue({ data: null, errors: null }),
      delete: vi.fn().mockResolvedValue({ data: null, errors: null }),
    },
  },
  mutations: {
    sendConfirmationEmail: vi.fn().mockResolvedValue({ data: null, errors: null }),
  },
};

// Mock Amplify Auth Session
export const mockAuthSession = {
  tokens: {
    accessToken: {
      payload: {
        'cognito:groups': ['Users'],
      },
    },
  },
};

export const mockAdminAuthSession = {
  tokens: {
    accessToken: {
      payload: {
        'cognito:groups': ['Admins'],
      },
    },
  },
};

// Mock Amplify Storage
export const mockStorage = {
  uploadData: vi.fn().mockImplementation(() => ({
    result: Promise.resolve({ path: 'test-path' }),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    state: 'SUCCESS',
  })),
  remove: vi.fn().mockResolvedValue({}),
  getUrl: vi.fn().mockResolvedValue({ url: new URL('https://example.com/file') }),
};

// Setup all mocks
export function setupAmplifyMocks() {
  vi.mock('aws-amplify/data', () => ({
    generateClient: () => mockAmplifyClient,
  }));

  vi.mock('aws-amplify/auth', () => ({
    fetchAuthSession: vi.fn().mockResolvedValue(mockAuthSession),
  }));

  vi.mock('aws-amplify/storage', () => mockStorage);
}

// Reset all mocks
export function resetAmplifyMocks() {
  Object.values(mockAmplifyClient.models).forEach((model) => {
    Object.values(model).forEach((method) => {
      if (typeof method === 'function' && 'mockClear' in method) {
        method.mockClear();
      }
    });
  });
  mockStorage.uploadData.mockClear();
  mockStorage.remove.mockClear();
  mockStorage.getUrl.mockClear();
}
