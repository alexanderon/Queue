import { test, expect } from '@playwright/test';

test.describe('Input Validation', () => {
  test('vendor signup validates email format', async ({ page }) => {
    await page.goto('/vendor');
    await page.getByText('Sign up here').click();

    const emailInput = page.getByPlaceholder('email@example.com');
    await emailInput.fill('invalid-email');
    await expect(page.getByText('Enter a valid email address')).toBeVisible();

    await emailInput.fill('valid@example.com');
    await expect(page.getByText('Enter a valid email address')).not.toBeVisible();
  });

  test('vendor signup validates password length', async ({ page }) => {
    await page.goto('/vendor');
    await page.getByText('Sign up here').click();

    const passInput = page.getByPlaceholder('Create a password (min 6 chars)');
    await passInput.fill('abc');
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();

    await passInput.fill('abcdef');
    await expect(page.getByText('Password must be at least 6 characters')).not.toBeVisible();
  });

  test('vendor signup validates phone format', async ({ page }) => {
    await page.goto('/vendor');
    await page.getByText('Sign up here').click();

    const phoneInput = page.getByPlaceholder('+91 9876543210');
    await phoneInput.fill('123');
    await expect(page.getByText('Enter a valid phone number')).toBeVisible();

    await phoneInput.fill('+919876543210');
    await expect(page.getByText('Enter a valid phone number')).not.toBeVisible();
  });

  test('vendor signup validates shop name', async ({ page }) => {
    await page.goto('/vendor');
    await page.getByText('Sign up here').click();

    const nameInput = page.getByPlaceholder('Your shop name');
    await nameInput.fill('A');
    await expect(page.getByText('Shop name must be at least 2 characters')).toBeVisible();

    await nameInput.fill('My Shop');
    await expect(page.getByText('Shop name must be at least 2 characters')).not.toBeVisible();
  });

  test('status page validates booking ID', async ({ page }) => {
    await page.goto('/status');
    await page.waitForSelector('input');

    // Type character by character to ensure Fluent UI catches the input
    await page.locator('input').first().click();
    await page.keyboard.type('invalid');

    // Click the button natively
    await page.locator('button:has-text("Check Status")').click();

    await expect(page.getByText('Invalid booking ID format')).toBeVisible({ timeout: 10000 });
  });

  test('service form validates inputs', async ({ page }) => {
    // Ensure seed data exists
    await page.request.get('/api/vendors');

    await page.goto('/vendor');

    // Login using form submit (bypass HTML5 validation with dispatchEvent)
    await page.getByPlaceholder('Enter your email, phone or shop name').fill('Elite Barber Shop');
    await page.getByPlaceholder('Enter your password').fill('demo');
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
    await expect(page.getByText('Manage Queue')).toBeVisible({ timeout: 10000 });

    // Go to services
    await page.getByRole('link', { name: /Services/ }).click();

    // Wait for page to load, then click + Add Service
    await expect(page.getByText('+ Add Service')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("+ Add Service")').click();

    // Wait for form to appear
    await expect(page.getByText('Service Name')).toBeVisible();

    // Submit the service form using dispatchEvent (bypasses HTML5 validation
    // which would block submission when required fields are empty)
    await page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      for (const form of forms) {
        if (form.textContent?.includes('Add Service')) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          break;
        }
      }
    });
    await expect(page.getByText('Service name must be at least 2 characters')).toBeVisible({ timeout: 5000 });
  });
});
