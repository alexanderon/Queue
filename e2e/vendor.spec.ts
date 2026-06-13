import { test, expect } from '@playwright/test';
import { TEST_VENDOR } from './fixtures';

async function loginAsVendor(page: any) {
  await page.getByPlaceholder('Enter your email, phone or shop name').fill(TEST_VENDOR.shopName);
  await page.getByPlaceholder('Enter your password').fill(TEST_VENDOR.password);
  await page.evaluate(() => {
    const form = document.querySelector('form');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });
}

test.describe('Vendor Management', () => {
  test('vendor login page loads', async ({ page }) => {
    await page.goto('/vendor');
    await expect(page.getByText('Vendor Login')).toBeVisible();
    await expect(page.getByText('Sign up here')).toBeVisible();
  });

  test('vendor can login with seed account', async ({ page }) => {
    await page.request.get('/api/vendors');
    await page.goto('/vendor');
    await loginAsVendor(page);
    await expect(page.getByText(/Welcome/)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Manage Queue')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('vendor signup validation works', async ({ page }) => {
    await page.goto('/vendor');
    await page.getByText('Sign up here').click();
    await expect(page.getByText('Vendor Sign Up')).toBeVisible();

    // Dispatch submit event directly
    await page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      for (const form of forms) {
        if (form.querySelector('button[type="submit"]')) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          break;
        }
      }
    });
    await expect(page.getByText('Shop name must be at least 2 characters')).toBeVisible({ timeout: 5000 });
  });

  test('vendor can logout', async ({ page }) => {
    await page.request.get('/api/vendors');
    await page.goto('/vendor');
    await loginAsVendor(page);
    await expect(page.getByText(/Welcome/)).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByText('Vendor Login')).toBeVisible();
  });

  test('vendor services page loads', async ({ page }) => {
    await page.request.get('/api/vendors');
    await page.goto('/vendor');
    await loginAsVendor(page);
    await expect(page.getByText(/Welcome/)).toBeVisible({ timeout: 15000 });

    await page.getByRole('link', { name: /Services/ }).click();
    await expect(page.getByText('+ Add Service')).toBeVisible({ timeout: 15000 });
  });

  test('vendor settings page loads', async ({ page }) => {
    await page.request.get('/api/vendors');
    await page.goto('/vendor');
    await loginAsVendor(page);
    await expect(page.getByText(/Welcome/)).toBeVisible({ timeout: 15000 });

    await page.getByRole('link', { name: /Settings/ }).click();
    await expect(page.getByText('Shop Information')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Save Settings')).toBeVisible({ timeout: 10000 });
  });
});
