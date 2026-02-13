import { test, expect } from '@playwright/test';

// Set shorter timeout for CI - fail fast if app doesn't load
test.setTimeout(30000);

test.describe('Enquiry Form Submission Journey', () => {
  test('home page loads', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBeLessThan(400);

    // Wait for React to hydrate - look for any content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('enquiry form page loads', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'domcontentloaded' });

    // Form should render - look for form-related content
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('form shows involvement level options', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'networkidle' });

    // Should show involvement level options (case insensitive)
    const doItForMe = page.getByText(/do it for me/i);
    await expect(doItForMe).toBeVisible({ timeout: 10000 });
  });

  test('can select involvement level', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'networkidle' });

    // Select "Do it for me"
    await page.getByText(/do it for me/i).click();

    // Should show account management options
    await expect(page.getByText(/you manage/i)).toBeVisible({ timeout: 5000 });
  });

  test('can progress to next step', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'networkidle' });

    // Complete step 1
    await page.getByText(/do it for me/i).click();
    await page.getByText(/you manage/i).click();

    // Click continue (the button text from translations)
    const continueButton = page.getByRole('button', { name: /continue/i });
    await expect(continueButton).toBeVisible({ timeout: 5000 });
    await continueButton.click();

    // Should advance - look for step 2 content
    await expect(page.getByText(/simple.*static/i)).toBeVisible({ timeout: 5000 });
  });

  test('can navigate back', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'networkidle' });

    // Complete step 1
    await page.getByText(/do it for me/i).click();
    await page.getByText(/you manage/i).click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Wait for step 2
    await expect(page.getByText(/simple.*static/i)).toBeVisible({ timeout: 5000 });

    // Go back
    const backButton = page.getByRole('button', { name: /back/i });
    await backButton.click();

    // Should be back on step 1
    await expect(page.getByText(/do it for me/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Responsive Design', () => {
  test('mobile viewport renders form', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/enquiry', { waitUntil: 'networkidle' });

    await expect(page.getByText(/do it for me/i)).toBeVisible({ timeout: 10000 });
  });
});
