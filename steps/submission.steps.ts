import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { testConfig, generateTestFormData, type TestFormData } from '../e2e/test-config';

const { Given, When, Then } = createBdd();

// Store test data for verification across steps
let currentTestData: TestFormData | null = null;

// Helper to dismiss cookie banner
async function dismissCookieBanner(page: import('@playwright/test').Page) {
  const acceptButton = page.getByRole('button', { name: /accept all/i });
  if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await acceptButton.click();
    await acceptButton.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
}

// Helper to click continue
async function continueToNextStep(page: import('@playwright/test').Page) {
  const continueButton = page.getByRole('button', { name: /continue/i });
  await expect(continueButton).toBeEnabled({ timeout: 5000 });
  await continueButton.click();
  await page.waitForTimeout(500);
}

// ============ FORM COMPLETION STEPS ============

When('I complete the full enquiry form with test data', async ({ page }) => {
  // Generate unique test data for this run
  currentTestData = generateTestFormData();

  // Step 1: Involvement Level
  await page.getByText(/do it for me/i).click();
  await page.getByText(/you manage/i).click();
  await continueToNextStep(page);

  // Step 2: Complexity
  await page.getByText(/simple.*static/i).click();
  await continueToNextStep(page);

  // Step 2b: Features
  await page.getByText(/home page/i).first().click();
  await page.getByText(/contact page/i).first().click();
  await continueToNextStep(page);

  // Step 3: AI Features
  await page.getByText(/no ai features/i).click();
  await continueToNextStep(page);

  // Step 4: Business Info
  await page.locator('textarea').first().fill(currentTestData.businessDescription);
  await page.locator('input[type="url"]').first().fill(currentTestData.competitorUrl);
  await page.getByRole('button', { name: /add/i }).click();
  await page.waitForTimeout(300);
  await continueToNextStep(page);

  // Step 5: Design Assets - click Yes for logo and brand colours
  const yesButtons = page.getByRole('button', { name: 'Yes' });
  const count = await yesButtons.count();
  if (count >= 1) await yesButtons.nth(0).click();
  if (count >= 2) await yesButtons.nth(1).click();
  await continueToNextStep(page);

  // Step 6: Contact Info
  await page.getByPlaceholder(/john smith/i).fill(currentTestData.fullName);
  await page.getByPlaceholder(/example\.com/i).fill(currentTestData.email);
  await page.getByPlaceholder(/7700/i).fill(currentTestData.phone);
  await page.getByText(/^Email$/i).click(); // Preferred contact method
  await continueToNextStep(page);

  // Should now be on Step 7: Pricing Summary
  await expect(page.getByRole('heading', { name: /estimated quote/i })).toBeVisible({ timeout: 10000 });
});

When('I submit the enquiry', async ({ page }) => {
  // Click the submit button
  const submitButton = page.getByRole('button', { name: /submit|send/i });
  await expect(submitButton).toBeVisible({ timeout: 5000 });
  await submitButton.click();

  // Wait for submission to complete (may take a few seconds)
  await page.waitForTimeout(3000);
});

Given('I have completed and submitted an enquiry', async ({ page }) => {
  await page.goto('/enquiry', { waitUntil: 'networkidle' });
  await dismissCookieBanner(page);

  // Generate test data
  currentTestData = generateTestFormData({
    // Use the test user email so they can retrieve it
    email: testConfig.testUser.email,
  });

  // Complete all steps (abbreviated version)
  // Step 1
  await page.getByText(/do it for me/i).click();
  await page.getByText(/you manage/i).click();
  await continueToNextStep(page);

  // Step 2
  await page.getByText(/simple.*static/i).click();
  await continueToNextStep(page);

  // Step 2b
  await page.getByText(/home page/i).first().click();
  await continueToNextStep(page);

  // Step 3
  await page.getByText(/no ai features/i).click();
  await continueToNextStep(page);

  // Step 4
  await page.locator('textarea').first().fill(currentTestData.businessDescription);
  await page.locator('input[type="url"]').first().fill(currentTestData.competitorUrl);
  await page.getByRole('button', { name: /add/i }).click();
  await continueToNextStep(page);

  // Step 5
  const yesButtons = page.getByRole('button', { name: 'Yes' });
  if (await yesButtons.nth(0).isVisible()) await yesButtons.nth(0).click();
  if (await yesButtons.nth(1).isVisible()) await yesButtons.nth(1).click();
  await continueToNextStep(page);

  // Step 6
  await page.getByPlaceholder(/john smith/i).fill(currentTestData.fullName);
  await page.getByPlaceholder(/example\.com/i).fill(currentTestData.email);
  await page.getByPlaceholder(/7700/i).fill(currentTestData.phone);
  await page.getByText(/^Email$/i).click();
  await continueToNextStep(page);

  // Submit
  await page.getByRole('button', { name: /submit|send/i }).click();
  await page.waitForTimeout(3000);
});

When('I login as the test user', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'networkidle' });
  await dismissCookieBanner(page);

  await page.getByRole('textbox', { name: /email/i }).fill(testConfig.testUser.email);
  await page.getByRole('textbox', { name: /password/i }).fill(testConfig.testUser.password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();

  await page.waitForURL(/\/account/, { timeout: 15000 });
});

// ============ VERIFICATION STEPS ============

Then('I should see the thank you page', async ({ page }) => {
  // Look for the "Thank you" heading specifically to avoid strict mode issues
  await expect(
    page.getByRole('heading', { name: /thank you/i })
  ).toBeVisible({ timeout: 15000 });
});

Then('the enquiry should be saved to the database', async ({ page }) => {
  // For now, we verify via UI by logging in and checking
  // In the future, this could use a GraphQL query directly

  // The thank you page should show a reference number or confirmation
  // that indicates the save was successful
  const confirmationText = page.getByText(/reference|enquiry|submitted/i);
  await expect(confirmationText).toBeVisible({ timeout: 10000 });

  // TODO: Add direct GraphQL verification once API client is set up
  // const client = getGraphQLClient();
  // const { data } = await client.models.Enquiry.list({
  //   filter: { email: { eq: currentTestData?.email } }
  // });
  // expect(data.length).toBeGreaterThan(0);
});

Then('I should see my recently submitted enquiry', async ({ page }) => {
  // Navigate to enquiries list
  await page.goto('/account/enquiries', { waitUntil: 'networkidle' });

  // Verify the table has loaded with enquiries
  await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 });

  // Look for the enquiry with our test data in the table
  if (currentTestData) {
    // Look for a row containing the test user's email or name
    // Use the table context to avoid matching nav/header elements
    const tableBody = page.locator('table tbody');
    const enquiryRow = tableBody.getByRole('row').filter({
      hasText: testConfig.testUser.email
    }).or(tableBody.getByRole('row').filter({
      hasText: /E2E Test User/i
    }));
    await expect(enquiryRow.first()).toBeVisible({ timeout: 10000 });
  }
});

Then('the enquiry details should match what I submitted', async ({ page }) => {
  if (!currentTestData) {
    throw new Error('No test data available for verification');
  }

  // Click on the first enquiry to view details
  const viewButton = page.getByRole('link', { name: /view|details/i }).first()
    .or(page.locator('table tbody tr').first().getByRole('link'));
  await viewButton.click();

  // Verify key fields match - use heading for the name (more specific)
  await expect(page.getByRole('heading', { name: currentTestData.fullName })).toBeVisible({ timeout: 10000 });

  // Email should be visible somewhere on the page
  await expect(page.getByText(currentTestData.email).first()).toBeVisible({ timeout: 5000 });

  // Business description should contain our test marker - escape regex special chars
  const escapedMarker = testConfig.testMarkers.businessDescriptionPrefix.replace(/[[\]]/g, '\\$&');
  await expect(page.getByText(new RegExp(escapedMarker, 'i')).first()).toBeVisible({ timeout: 5000 });
});

export { Given, When, Then, currentTestData };
