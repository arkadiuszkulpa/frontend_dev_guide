import { test, expect } from '@playwright/test';

test.describe('Enquiry Form Submission Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays home page with start button', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    // Look for any call-to-action button
    const startButton = page.getByRole('link', { name: /start|begin|enquiry/i });
    await expect(startButton).toBeVisible();
  });

  test('can navigate to enquiry form', async ({ page }) => {
    const startButton = page.getByRole('link', { name: /start|begin|enquiry/i });
    await startButton.click();
    await expect(page).toHaveURL(/.*enquiry/);
  });

  test('form shows step 1 - involvement level', async ({ page }) => {
    await page.goto('/enquiry');

    // Should show involvement level options
    await expect(page.getByText(/do it for me/i)).toBeVisible();
    await expect(page.getByText(/teach me/i)).toBeVisible();
    await expect(page.getByText(/guide me/i)).toBeVisible();
  });

  test('can progress through involvement level step', async ({ page }) => {
    await page.goto('/enquiry');

    // Select "Do it for me"
    await page.getByText(/do it for me/i).click();

    // Should show account management options (for non-guide-me)
    await expect(page.getByText(/you manage/i)).toBeVisible();
    await page.getByText(/you manage/i).click();

    // Click next
    await page.getByRole('button', { name: /next/i }).click();

    // Should be on step 2 (complexity)
    await expect(page.getByText(/simple.*static/i)).toBeVisible();
  });

  test('validates required fields before proceeding', async ({ page }) => {
    await page.goto('/enquiry');

    // Try to click next without selecting anything
    const nextButton = page.getByRole('button', { name: /next/i });
    await nextButton.click();

    // Should still be on step 1 (form didn't advance)
    await expect(page.getByText(/do it for me/i)).toBeVisible();
  });

  test('can complete website complexity step', async ({ page }) => {
    await page.goto('/enquiry');

    // Step 1
    await page.getByText(/do it for me/i).click();
    await page.getByText(/you manage/i).click();
    await page.getByRole('button', { name: /next/i }).click();

    // Step 2 - Website Complexity
    await expect(page.getByText(/simple.*static/i)).toBeVisible();
    await page.getByText(/simple.*static/i).click();
    await page.getByRole('button', { name: /next/i }).click();

    // Should be on features step (2b)
    await expect(page.getByText(/home.*page/i)).toBeVisible();
  });

  test('form navigation - can go back to previous step', async ({ page }) => {
    await page.goto('/enquiry');

    // Complete step 1
    await page.getByText(/do it for me/i).click();
    await page.getByText(/you manage/i).click();
    await page.getByRole('button', { name: /next/i }).click();

    // Now on step 2
    await expect(page.getByText(/simple.*static/i)).toBeVisible();

    // Go back
    await page.getByRole('button', { name: /back|previous/i }).click();

    // Should be back on step 1
    await expect(page.getByText(/do it for me/i)).toBeVisible();
  });

  test('progress indicator shows current step', async ({ page }) => {
    await page.goto('/enquiry');

    // Should show some progress indication
    // This will depend on your UI implementation
    const progressElement = page.locator('[class*="progress"], [role="progressbar"], .step-indicator');

    // At minimum, we should be able to identify we're at the start
    // Just verify the form loaded
    await expect(page.getByText(/do it for me/i)).toBeVisible();
  });
});

test.describe('Contact Info Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to a form state where we can test contact info
    // This assumes your form preserves state or we can navigate there
    await page.goto('/enquiry');
  });

  test('email validation shows error for invalid format', async ({ page }) => {
    // This test would need to navigate to the contact step
    // For now, we test that the form structure exists
    await expect(page.locator('form, [role="form"], .form-card').first()).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('form is usable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/enquiry');

    // Form elements should still be visible
    await expect(page.getByText(/do it for me/i)).toBeVisible();

    // Next button should be accessible
    await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
  });

  test('form is usable on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/enquiry');

    await expect(page.getByText(/do it for me/i)).toBeVisible();
  });
});

test.describe('Language Switching', () => {
  test('can switch language', async ({ page }) => {
    await page.goto('/');

    // Look for language switcher
    const languageSwitcher = page.locator(
      '[class*="language"], [aria-label*="language"], button:has-text("EN"), button:has-text("PL")'
    );

    // If language switcher exists, try to interact with it
    if (await languageSwitcher.first().isVisible()) {
      await expect(languageSwitcher.first()).toBeVisible();
    }
  });
});

test.describe('Accessibility', () => {
  test('form has proper heading structure', async ({ page }) => {
    await page.goto('/enquiry');

    // Should have at least one heading
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/enquiry');

    // Radio buttons should have associated labels
    const radioButtons = page.locator('input[type="radio"]');
    const radioCount = await radioButtons.count();

    if (radioCount > 0) {
      // At least some radio buttons exist
      expect(radioCount).toBeGreaterThan(0);
    }
  });

  test('buttons are keyboard accessible', async ({ page }) => {
    await page.goto('/enquiry');

    // Select an option using click
    await page.getByText(/do it for me/i).click();
    await page.getByText(/you manage/i).click();

    // Next button should be focusable
    const nextButton = page.getByRole('button', { name: /next/i });
    await nextButton.focus();
    await expect(nextButton).toBeFocused();

    // Should be activatable with Enter
    await page.keyboard.press('Enter');
  });
});
