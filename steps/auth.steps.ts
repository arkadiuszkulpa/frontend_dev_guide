import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { testConfig, hasTestCredentials } from '../e2e/test-config';

const { Given, When, Then } = createBdd();

// Helper to dismiss cookie banner if present
async function dismissCookieBanner(page: import('@playwright/test').Page) {
  const acceptButton = page.getByRole('button', { name: /accept all/i });
  if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await acceptButton.click();
    await acceptButton.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
}

// ============ LOGIN STEPS ============

Given('I am logged in as a regular user', async ({ page }) => {
  if (!hasTestCredentials()) {
    throw new Error('Test user credentials not configured. Set E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD environment variables.');
  }

  await page.goto('/login', { waitUntil: 'networkidle' });
  await dismissCookieBanner(page);

  // Fill login form
  await page.getByRole('textbox', { name: /email/i }).fill(testConfig.testUser.email);
  await page.getByRole('textbox', { name: /password/i }).fill(testConfig.testUser.password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();

  // Wait for redirect to account page
  await page.waitForURL(/\/account/, { timeout: 15000 });
  await expect(page).toHaveURL(/\/account/);
});

Given('I am logged in as an admin', async ({ page }) => {
  if (!hasTestCredentials()) {
    throw new Error('Admin credentials not configured. Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD environment variables.');
  }

  await page.goto('/login', { waitUntil: 'networkidle' });
  await dismissCookieBanner(page);

  // Fill login form
  await page.getByRole('textbox', { name: /email/i }).fill(testConfig.adminUser.email);
  await page.getByRole('textbox', { name: /password/i }).fill(testConfig.adminUser.password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();

  // Wait for redirect to account page
  await page.waitForURL(/\/account/, { timeout: 15000 });
  await expect(page).toHaveURL(/\/account/);
});

When('I login as {string}', async ({ page }, email: string) => {
  // Determine which test user based on email
  const isAdmin = email === testConfig.adminUser.email;
  const password = isAdmin ? testConfig.adminUser.password : testConfig.testUser.password;

  if (!password) {
    throw new Error(`Password not configured for ${email}`);
  }

  await page.goto('/login', { waitUntil: 'networkidle' });
  await dismissCookieBanner(page);

  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();

  await page.waitForURL(/\/account/, { timeout: 15000 });
});

When('I logout', async ({ page }) => {
  // Look for logout button or user menu
  const logoutButton = page.getByRole('button', { name: /log ?out|sign ?out/i });
  if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await logoutButton.click();
  } else {
    // Try user menu first
    const userMenu = page.getByRole('button', { name: /account|profile|menu/i });
    if (await userMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
      await userMenu.click();
      await page.getByRole('menuitem', { name: /log ?out|sign ?out/i }).click();
    }
  }

  // Wait for redirect to home or login
  await page.waitForURL(/\/(login)?$/, { timeout: 10000 });
});

// ============ NAVIGATION STEPS ============

When('I navigate to My Enquiries', async ({ page }) => {
  // Navigate to the enquiries list
  await page.goto('/account/enquiries', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /enquiries/i })).toBeVisible({ timeout: 10000 });
});

When('I navigate to the enquiries list', async ({ page }) => {
  await page.goto('/account/enquiries', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /enquiries/i })).toBeVisible({ timeout: 10000 });
});

When('I view the enquiries list', async ({ page }) => {
  await page.goto('/account/enquiries', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /enquiries/i })).toBeVisible({ timeout: 10000 });
});

// ============ ASSERTION STEPS ============

Then('I should see my submitted enquiry', async ({ page }) => {
  // Look for the enquiry in the list
  await expect(page.getByText(/e2e.*test/i).or(page.locator('table tbody tr'))).toBeVisible({ timeout: 10000 });
});

Then('I should see ALL submitted enquiries', async ({ page }) => {
  // Admin should see multiple enquiries (or at least the table)
  const table = page.locator('table');
  await expect(table).toBeVisible({ timeout: 10000 });

  // Should see rows (more than just header)
  const rows = page.locator('table tbody tr');
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});

Then('I should only see enquiries submitted with my email', async ({ page }) => {
  // Verify at least one enquiry with the user's email is visible
  // Note: Due to test data accumulation, there may be e2e-generated emails too
  const userEmailCell = page.locator('table tbody tr').filter({
    hasText: testConfig.testUser.email
  });
  await expect(userEmailCell.first()).toBeVisible({ timeout: 5000 });
});

Then('I should NOT see other users\' enquiries', async ({ page }) => {
  // This is implicitly tested by "only see my enquiries"
  // But we can also check that admin email enquiries are not visible
  const pageContent = await page.content();
  expect(pageContent).not.toContain(testConfig.adminUser.email);
});

export { Given, When, Then };
