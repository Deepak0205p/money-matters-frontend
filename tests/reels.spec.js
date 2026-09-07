import { test, expect } from '@playwright/test';

test('Reels Navigation and Player Loads Correctly', async ({ page }) => {
  // Navigate to Dashboard
  await page.goto('http://localhost:3000/home/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Check if Reels link exists in desktop sidebar / nav
  const reelsLink = page.locator('a[href="/home/reels"]');
  await expect(reelsLink.first()).toBeVisible();

  // Click on Finance Reels
  await reelsLink.first().click();
  await page.waitForURL('**/home/reels');
  await page.waitForTimeout(1500);

  // Verify Reels player UI elements
  await expect(page.locator('text=Paisa Shorts')).toBeVisible();
  await expect(page.locator('text=1 / 2')).toBeVisible();
  await expect(page.locator('iframe')).toBeVisible();

  console.log('✅ Reels navigation and player verified successfully with 2 shorts!');
});
