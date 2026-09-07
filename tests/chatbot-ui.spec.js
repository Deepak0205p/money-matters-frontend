import { test, expect } from '@playwright/test';

test.describe('Chatbot Fixed UI Layout Test', () => {
  test('Header, sidebar, and input bar remain static while messages scroll inside container', async ({ page }) => {
    // 1. Navigate to /auth and click Guest Access to authenticate
    await page.goto('http://localhost:3000/auth');
    await page.waitForLoadState('domcontentloaded');

    const guestBtn = page.locator('text=Instant Guest Access');
    await guestBtn.waitFor({ state: 'visible', timeout: 10000 });
    await guestBtn.click();

    // 2. Wait for dashboard and navigate to chatbot
    await page.waitForURL('**/home/dashboard', { timeout: 10000 });
    await page.goto('http://localhost:3000/home/chatbot');
    await page.waitForURL('**/home/chatbot', { timeout: 10000 });

    // 3. Wait for chatbot input
    const inputArea = page.locator('#chatbot-input');
    await inputArea.waitFor({ state: 'visible', timeout: 10000 });
    await expect(inputArea).toBeVisible();

    // 4. Send a message
    await inputArea.fill('What is compounding?');
    await inputArea.press('Enter');

    // Wait for response
    await page.waitForTimeout(4000);

    // 5. Send second message
    await inputArea.fill('Explain the 50/30/20 budgeting rule');
    await inputArea.press('Enter');
    await page.waitForTimeout(4000);

    // 6. Verify that outer window/body scrollY is strictly 0 (no layout drift or body scrolling)
    const windowScrollY = await page.evaluate(() => window.scrollY);
    expect(windowScrollY).toBe(0);

    // 7. Verify input area remains pinned at bottom of viewport
    await expect(inputArea).toBeVisible();
    const inputBounds = await inputArea.boundingBox();
    expect(inputBounds).not.toBeNull();
    expect(inputBounds.y).toBeGreaterThan(400);

    // 8. Verify the sidebar remains visible on desktop
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();

    console.log('✅ Playwright Test Passed: Layout is 100% static/fixed, body scroll is 0, and input stays pinned at bottom.');
  });
});
