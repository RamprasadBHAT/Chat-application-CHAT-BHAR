const { test, expect } = require('@playwright/test');

test('verify chat sidebar and post viewer', async ({ page }) => {
  await page.goto('http://localhost:4173');

  // Inject a mock session to bypass Firebase login in this verification script
  await page.evaluate(() => {
    const mockUser = {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@gmail.com',
      username: 'testuser',
      activeUsernameId: 'u1',
      usernames: [{ id: 'u1', value: 'testuser' }],
      profilePic: '',
      stats: { posts: 1, followers: 10, following: 5 }
    };
    localStorage.setItem('chatbhar.session', JSON.stringify(mockUser));

    // Mock chat data
    const mockChatStore = {
      'dm:other-user': [
        { id: 'm1', dir: 'incoming', text: 'Hello!', ts: Date.now() - 10000 },
        { id: 'm2', dir: 'outgoing', text: 'Hi there!', ts: Date.now() - 5000 }
      ]
    };
    localStorage.setItem('chatbhar.chatStore', JSON.stringify(mockChatStore));

    const mockChatMeta = {
      'dm:other-user': { id: 'dm:other-user', name: 'Other User', participants: ['test-user-id', 'other-user'], online: true }
    };
    localStorage.setItem('chatbhar.chatMeta', JSON.stringify(mockChatMeta));

    // Mock uploads
    const mockUploads = [
      {
        id: 'post-1',
        userId: 'test-user-id',
        userName: 'testuser',
        type: 'short',
        caption: 'First Post',
        files: [{ dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', type: 'image/png', name: 'img1.png' }],
        createdAt: new Date().toISOString()
      },
      {
        id: 'post-2',
        userId: 'test-user-id',
        userName: 'testuser',
        type: 'short',
        caption: 'Second Post',
        files: [{ dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', type: 'image/png', name: 'img2.png' }],
        createdAt: new Date(Date.now() - 1000).toISOString()
      }
    ];
    localStorage.setItem('chatbhar.uploads', JSON.stringify(mockUploads));

    // Force show app shell for verification
    document.getElementById('authGate').hidden = true;
    document.getElementById('appShell').hidden = false;
  });

  // No reload needed if we force it in evaluate, but we might need to trigger renderers
  await page.evaluate(() => {
    // Manually trigger tab opening to ensure elements are rendered
    const chatBtn = document.querySelector('button[data-tab="chat"]');
    if (chatBtn) chatBtn.click();
  });

  // Verify Chat Screen
  await page.click('button[data-tab="chat"]');
  await expect(page.locator('#chat')).toBeVisible();

  // Take screenshot of chat layout
  await page.screenshot({ path: 'verification_chat.png' });

  // Open Post Viewer from Feed (or just trigger it)
  await page.click('button[data-tab="home"]');
  await page.waitForSelector('.feed-card');
  await page.click('.feed-card .media-16x9');

  await expect(page.locator('#postViewer')).toBeVisible();

  // Verify navigation arrows
  const prevBtn = page.locator('#prevPost');
  const nextBtn = page.locator('#nextPost');

  await expect(prevBtn).toBeVisible();
  await expect(nextBtn).toBeVisible();

  // Take screenshot of post viewer with arrows
  await page.screenshot({ path: 'verification_viewer.png' });
});
