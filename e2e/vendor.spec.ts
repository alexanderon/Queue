import { test, expect } from '@playwright/test';
import { TEST_VENDOR } from './fixtures';

test.describe('Vendor Management', () => {
  test('vendor login page loads', async ({ page }) => {
    await page.goto('/vendor');
    await expect(page.getByText('Vendor Login')).toBeVisible();
    await expect(page.getByText('Sign up here')).toBeVisible();
  });

  test('vendor can login with seed account', async ({ page }) => {
    await page.goto('/vendor');

    await page.getByPlaceholder('Enter your email, phone or shop name').fill(TEST_VENDOR.shopName);
    await page.getByPlaceholder('Enter your password').fill(TEST_VENDOR.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText(`Welcome, ${TEST_VENDOR.shopName}!`)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Manage Queue')).toBeVisible();
    await expect(page.getByText('Services')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('vendor signup validation works', async ({ page }) => {
    await page.goto('/vendor');
    await page.getByText('Sign up here').click();

    await expect(page.getByText('Vendor Sign Up')).toBeVisible();
    await expect(page.getByText('Business Phone *')).toBeVisible();

    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText('Shop name must be at least 2 characters')).toBeVisible();
  });

  test('vendor can logout', async ({ page }) => {
    await page.goto('/vendor');
    await page.getByPlaceholder('Enter your email, phone or shop name').fill(TEST_VENDOR.shopName);
    await page.getByPlaceholder('Enter your password').fill(TEST_VENDOR.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText(`Welcome, ${TEST_VENDOR.shopName}!`)).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByText('Vendor Login')).toBeVisible();
  });

  test('vendor services page loads', async ({ page }) => {
    await page.goto('/vendor');
    await page.getByPlaceholder('Enter your email, phone or shop name').fill(TEST_VENDOR.shopName);
    await page.getByPlaceholder('Enter your password').fill(TEST_VENDOR.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByText('Services').click();
    await expect(page.getByText('+ Add Service')).toBeVisible();
  });

  test('vendor settings page loads', async ({ page }) => {
    await page.goto('/vendor');
    await page.getByPlaceholder('Enter your email, phone or shop name').fill(TEST_VENDOR.shopName);
    await page.getByPlaceholder('Enter your password').fill(TEST_VENDOR.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByText('Settings').click();
    await expect(page.getByText('Shop Information')).toBeVisible();
    await expect(page.getByText('Save Settings')).toBeVisible();
  });
});
