import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// Use deployed URL if available, otherwise localhost
// Port 5177 matches vite.config.ts server.port
const baseURL = process.env.BASE_URL || 'http://localhost:5177';
const isDeployedEnv = baseURL !== 'http://localhost:5177';

// BDD configuration - generates test files from .feature files
const testDir = defineBddConfig({
  paths: ['features/**/*.feature'],
  require: ['steps/**/*.ts'],
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/e2e-results.xml' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: isDeployedEnv
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5177',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});
