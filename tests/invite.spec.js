const { test, expect } = require('@playwright/test');

test('Invite flow verification', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  // Register User 1
  await page1.goto('http://localhost:4173');
  await page1.click('#showSignupForm');
  await page1.fill('#signupName', 'User One');
  await page1.fill('#signupEmail', 'user1@gmail.com');
  await page1.fill('#signupPassword', 'password123');
  await page1.fill('#signupConfirmPassword', 'password123');
  await page1.click('#signupForm button[type="submit"]');
  await page1.fill('#usernameInput', 'userone');
  await page1.click('#usernameForm button[type="submit"]');

  // Register User 2
  await page2.goto('http://localhost:4173');
  await page2.click('#showSignupForm');
  await page2.fill('#signupName', 'User Two');
  await page2.fill('#signupEmail', 'user2@gmail.com');
  await page2.fill('#signupPassword', 'password123');
  await page2.fill('#signupConfirmPassword', 'password123');
  await page2.click('#signupForm button[type="submit"]');
  await page2.fill('#usernameInput', 'usertwo');
  await page2.click('#usernameForm button[type="submit"]');

  // User 1 goes to Explore and messages User 2
  await page1.click('button[data-tab="explore"]');
  await page1.fill('#exploreSearchInput', 'usertwo');
  const msgBtn = page1.locator('.message-btn:has-text("Message")').first();
  await expect(msgBtn).toBeVisible();

  // Intercept confirm dialog
  page1.on('dialog', dialog => dialog.accept());
  await msgBtn.click();

  // User 2 goes to Chat and should see the request
  await page2.click('button[data-tab="chat"]');
  const requestItem = page2.locator('#inviteRequestsWrap .invite-item:has-text("userone wants to message you")');
  await expect(requestItem).toBeVisible();

  // Take screenshot of request
  await page2.screenshot({ path: '/home/jules/verification/invite_request.png' });

  // User 2 accepts
  await page2.click('#inviteRequestsWrap .accept-btn');

  // Verify DM is active
  await expect(page2.locator('#activeChatTitle')).toHaveText('userone');

  // Take screenshot of accepted chat
  await page2.screenshot({ path: '/home/jules/verification/invite_accepted.png' });
});
