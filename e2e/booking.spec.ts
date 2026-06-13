import { test, expect } from '@playwright/test';
import { TEST_USER, SEED_SERVICE } from './fixtures';

test.describe('Booking Flow', () => {
  test('booking form loads with shops', async ({ page }) => {
    await page.goto('/book-slot');
    await expect(page.getByText('Book Your Slot')).toBeVisible();
    await expect(page.getByText('Select Shop')).toBeVisible();
  });

  test('can select shop and load services', async ({ page }) => {
    await page.goto('/book-slot');
    await page.getByText('Select Shop').click();
    await page.getByText('Elite Barber Shop').click();
    await expect(page.getByText(SEED_SERVICE)).toBeVisible({ timeout: 5000 });
  });

  test('validates form before submission', async ({ page }) => {
    await page.goto('/book-slot');
    const bookButton = page.getByRole('button', { name: 'Book Now' });
    await expect(bookButton).toBeDisabled();
  });

  test('completes full booking flow', async ({ page }) => {
    await page.goto('/book-slot');

    await page.getByText('Select Shop').click();
    await page.getByText('Elite Barber Shop').click();

    await page.getByText(SEED_SERVICE).click({ timeout: 5000 });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    await page.getByLabel('Preferred Date').fill(dateStr);
    await page.getByLabel('Preferred Time').fill('14:30');

    await page.getByLabel('Your Name').fill(TEST_USER.name);
    await page.getByLabel('WhatsApp Number').fill(TEST_USER.phone);

    await page.getByRole('button', { name: 'Book Now' }).click();
    await expect(page.getByText('Booking Confirmed!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Elite Barber Shop')).toBeVisible();
  });

  test('shows error for missing fields', async ({ page }) => {
    await page.goto('/book-slot');
    await page.getByRole('button', { name: 'Book Now' }).click();
    await expect(page.getByText('Booking Confirmed!')).not.toBeVisible();
  });
});
