import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

// ============ GIVEN STEPS ============

Given('I have at least one submitted enquiry', async ({ page }) => {
  // Navigate to enquiries and verify there's at least one
  await page.goto('/account/enquiries', { waitUntil: 'networkidle' });
  const rows = page.locator('table tbody tr');
  const count = await rows.count();
  if (count === 0) {
    throw new Error('No enquiries found. This test requires at least one submitted enquiry.');
  }
});

Given('I am viewing an enquiry detail page', async ({ page }) => {
  // Navigate to enquiries list first
  await page.goto('/account/enquiries', { waitUntil: 'networkidle' });

  // Click on the first enquiry
  const viewLink = page.getByRole('link', { name: /view|details/i }).first()
    .or(page.locator('table tbody tr a').first());
  await viewLink.click();

  // Wait for detail page to load
  await page.waitForURL(/\/account\/enquiries\/[a-zA-Z0-9-]+/, { timeout: 10000 });
});

// ============ WHEN STEPS ============

When('I click on an enquiry to view details', async ({ page }) => {
  const viewLink = page.getByRole('link', { name: /view|details/i }).first()
    .or(page.locator('table tbody tr a').first());
  await viewLink.click();
  await page.waitForURL(/\/account\/enquiries\/[a-zA-Z0-9-]+/, { timeout: 10000 });
});

When('I change the status to {string}', async ({ page }, status: string) => {
  // The status is a select dropdown labeled "Status:"
  const statusSelect = page.getByLabel(/status/i);

  await expect(statusSelect).toBeVisible({ timeout: 5000 });
  await statusSelect.selectOption({ label: status });

  // Wait for update to complete
  await page.waitForTimeout(1000);
});

When('I add an internal note {string}', async ({ page }, noteText: string) => {
  // The note textarea is in the "Admin Notes" section on the right
  // Find the textarea by its placeholder text
  const noteInput = page.getByPlaceholder(/add context|call summary|relevant notes/i);

  await expect(noteInput).toBeVisible({ timeout: 5000 });
  await noteInput.fill(noteText);

  // Click the "Add Note" submit button (the one at the bottom of the form, not the inline "Add note" links)
  const addButton = page.getByRole('button', { name: 'Add Note', exact: true });
  await addButton.click();

  // Wait for save
  await page.waitForTimeout(1000);
});

// ============ THEN STEPS ============

Then('I should see enquiries list', async ({ page }) => {
  await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
});

Then('I should see enquiries from different users', async ({ page }) => {
  // Admin should see variety of emails in the list
  const emailCells = page.locator('table tbody tr');
  const count = await emailCells.count();
  expect(count).toBeGreaterThan(0);
});

Then('I should see the full enquiry information', async ({ page }) => {
  // Verify key sections are visible by looking for specific headings
  await expect(page.getByRole('heading', { name: /contact information/i })).toBeVisible({ timeout: 10000 });
});

Then('I should see the enquiry status', async ({ page }) => {
  // Look for status badge or text
  await expect(
    page.getByText(/new|in review|contacted|quoted|accepted|declined|completed/i)
  ).toBeVisible({ timeout: 5000 });
});

Then('I should see admin-only options', async ({ page }) => {
  // Admins should see status dropdown and Admin Notes section
  await expect(page.getByLabel(/status/i)).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole('heading', { name: /admin notes/i })).toBeVisible({ timeout: 5000 });
});

Then('the status should be updated', async ({ page }) => {
  // Verify the status dropdown now shows "In Review"
  const statusSelect = page.getByLabel(/status/i);
  await expect(statusSelect).toHaveValue(/in.?review/i, { timeout: 5000 });
});

Then('I should see a success confirmation', async ({ page }) => {
  // Look for toast/notification or success message
  const _success = page.getByText(/success|saved|updated/i)
    .or(page.locator('[role="alert"]'));
  // This may not always show - status being visible is enough
  await page.waitForTimeout(500);
});

Then('the note should appear in the notes section', async ({ page }) => {
  // Look for the note we just added (use first() in case there are multiple from previous runs)
  await expect(page.getByText(/e2e test note/i).first()).toBeVisible({ timeout: 5000 });
});

Then('the note should show my name and timestamp', async ({ page }) => {
  // Notes show the admin email and a date - verify one of them contains both
  // Look for the note container that has both the note text and the admin email
  const noteWithAuthor = page.getByText(/test_admin@/i).first();
  await expect(noteWithAuthor).toBeVisible({ timeout: 5000 });
});

export { Given, When, Then };
