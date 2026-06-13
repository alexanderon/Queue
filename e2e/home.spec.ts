import { test, expect } from '@playwright/test';
import { TEST_USER } from './fixtures';

test.describe('Home Page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Queue/ })).toBeVisible();
    await expect(page.getByText('Skip the wait')).toBeVisible();
    await expect(page.getByText('Book an Appointment')).toBeVisible();
  });

  test('shows phone input when no phone in session', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByPlaceholder('Enter phone number')).toBeVisible();
  });

  test('validates phone input in real-time', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder('Enter phone number');

    await input.fill('abc');
    await expect(page.getByText('Enter a valid phone number')).toBeVisible();

    await input.fill('+919876543210');
    await expect(page.getByText('Enter a valid phone number')).not.toBeVisible();
  });

  test('disables submit button for invalid phone', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder('Enter phone number');
    const button = page.getByRole('button', { name: 'Look Up' });

    await input.fill('123');
    await expect(button).toBeDisabled();

    await input.fill('+919876543210');
    await expect(button).not.toBeDisabled();
  });

  test('shows upcoming booking after phone lookup', async ({ page }) => {
    // Trigger seed data
    const seedRes = await page.request.get('/api/vendors');
    let vendors;
    await expect(async () => {
      const res = await page.request.get('/api/vendors');
      const data = await res.json();
      expect(data.success).toBeTruthy();
      expect(data.data.length).toBeGreaterThan(0);
      vendors = data.data;
    }).toPass({ timeout: 15000 });

    const shop = vendors![0];
    const svcRes = await page.request.get(`/api/vendors/${shop.id}/services`);
    const services = await svcRes.json();
    const service = services.data[0];

    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + 1);

    const bookRes = await page.request.post('/api/bookings', {
      data: {
        shopId: shop.id,
        shopName: shop.shopName,
        serviceId: service.id,
        service: service.name,
        customerName: TEST_USER.name,
        customerPhone: TEST_USER.phone,
        date: bookingDate.toISOString().split('T')[0],
        time: '14:30',
      },
    });
    expect(bookRes.ok()).toBeTruthy();

    await page.goto('/');
    await page.evaluate((phone) => {
      sessionStorage.setItem('customerPhone', phone);
    }, TEST_USER.phone);
    await page.reload();

    await expect(page.getByText('Next Appointment')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Elite Barber Shop')).toBeVisible();
  });

  test('shows no bookings message for new number', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder('Enter phone number');
    await input.fill('+919999999999');
    await page.getByRole('button', { name: 'Look Up' }).click();
    await expect(page.getByText('No upcoming bookings')).toBeVisible({ timeout: 10000 });
  });
});
