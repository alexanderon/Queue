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

    const idInput = page.getByLabel('Booking ID');
    await idInput.fill('invalid');

    const button = page.getByRole('button', { name: 'Check Status' });
    await button.click();
    await expect(page.getByText('Invalid booking ID format')).toBeVisible();
  });

  test('service form validates inputs', async ({ page }) => {
    await page.goto('/vendor');
    const nameInput = page.getByPlaceholder('Enter your email, phone or shop name');
    const passInput = page.getByPlaceholder('Enter your password');

    await nameInput.fill('Elite Barber Shop');
    await passInput.fill('demo');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.goto('/vendor/services');

    await page.getByText('+ Add Service').click();
    await page.getByRole('button', { name: 'Add Service' }).click();
    await expect(page.getByText('Service name must be at least 2 characters')).toBeVisible();
  });
});
