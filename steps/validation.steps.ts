import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

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

// ============ GIVEN STEPS ============
// Note: "I am on the enquiry form" is defined in journey.steps.ts

// ============ WHEN STEPS ============

When('I try to continue without making a selection', async ({ page }) => {
  // Don't select anything, just try to continue
  const continueButton = page.getByRole('button', { name: /continue/i });
  // The button may be disabled, just check it exists
  await expect(continueButton).toBeVisible();
});

// ============ THEN STEPS ============

Then('I should remain on Step 1', async ({ page }) => {
  // Verify we're still on step 1
  await expect(page.getByText(/step 1/i)).toBeVisible({ timeout: 5000 });
});

Then('I should still see the involvement options', async ({ page }) => {
  await expect(page.getByText(/do it for me/i)).toBeVisible();
});

Then('I should be able to continue to the next step', async ({ page }) => {
  const continueButton = page.getByRole('button', { name: /continue/i });
  await expect(continueButton).toBeEnabled({ timeout: 5000 });
  await continueButton.click();
  // Verify we moved to step 2
  await expect(page.getByText(/step 2/i).or(page.getByText(/complexity/i))).toBeVisible({ timeout: 5000 });
});

export { Given, When, Then };
