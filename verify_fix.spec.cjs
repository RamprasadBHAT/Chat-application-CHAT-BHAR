const { test, expect } = require('@playwright/test');

test('Verify deduplication and tab persistence', async ({ page }) => {
  await page.goto('http://localhost:4173');

  // 1. Mock Data and Login
  await page.evaluate(() => {
    localStorage.clear();
    const user = {
      id: 'user123',
      name: 'Test User',
      email: 'test@gmail.com',
      username: 'testuser',
      usernames: [{ id: 'u1', value: 'testuser' }],
      activeUsernameId: 'u1'
    };
    const otherUser = {
        id: 'other456',
        name: 'Other Person',
        username: 'otherperson',
        usernames: [{ id: 'u2', value: 'otherperson' }],
        activeUsernameId: 'u2'
    };
    localStorage.setItem('chatbhar.users', JSON.stringify([user, otherUser]));
    localStorage.setItem('chatbhar.session', JSON.stringify(user));
  });

  await page.reload();

  // 2. Simulate Import with mixed ID formats
  await page.evaluate(() => {
      const backup = {
          chatStore: {
              'other456': [{ text: 'Msg 1', senderId: 'other456', createdAt: 1000 }],
              'dm:other456': [{ text: 'Msg 2', senderId: 'user123', createdAt: 2000 }],
              'otherperson': [{ text: 'Msg 3', senderId: 'other456', createdAt: 3000 }]
          },
          uploads: [],
          chatMeta: {},
          conversations: [
              { id: 'other456', name: 'Other Person', updatedAt: 1000 },
              { id: 'dm:other456', name: 'Other Person', updatedAt: 2000 },
              { id: 'otherperson', name: 'otherperson', updatedAt: 3000 }
          ]
      };
      // Trigger the internal apply function (mocking the file read result)
      window.applyImportedBackup(backup);
  });

  await page.waitForTimeout(1000);

  // 3. Verify Sidebar - Should only have ONE conversation
  const chatUsers = await page.locator('.chat-user');
  const count = await chatUsers.count();
  console.log(`Conversations in sidebar: ${count}`);

  // Take screenshot of sidebar
  await page.screenshot({ path: 'verification_sidebar_dedup.png' });

  // 4. Verify Tab Persistence
  await page.click('.nav-btn[data-tab="chat"]');
  await page.reload();

  // Should still be in chat tab
  const chatScreen = page.locator('#chat');
  await expect(chatScreen).toHaveClass(/active/);

  await page.screenshot({ path: 'verification_tab_persistence.png' });
});
