const { test, expect } = require('@playwright/test');

test('verify UI elements', async ({ page }) => {
  await page.goto('http://localhost:4173');

  await page.evaluate(() => {
    // Force App Shell visible
    document.getElementById('authGate').hidden = true;
    document.getElementById('appShell').hidden = false;

    // Create dummy chat data
    const mockUser = { id: 'u1', name: 'Test User', username: 'testuser' };
    localStorage.setItem('chatbhar.session', JSON.stringify(mockUser));

    const mockChatMeta = {
      'dm:other': { id: 'dm:other', name: 'Other User', online: true, participants: ['u1', 'other'] }
    };
    localStorage.setItem('chatbhar.chatMeta', JSON.stringify(mockChatMeta));

    const mockChatStore = {
      'dm:other': [{ id: 'm1', dir: 'incoming', text: 'Hello', ts: Date.now() }]
    };
    localStorage.setItem('chatbhar.chatStore', JSON.stringify(mockChatStore));

    // Force Chat Tab
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById('chat').classList.add('active');

    // Force Dark Mode on chat for verification
    document.querySelector('.chat-layout').classList.add('chat-dark');
  });

  // Wait for rendering
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'verification_chat_dark.png' });

  await page.evaluate(() => {
    // Open Post Viewer with mock content
    const postViewer = document.getElementById('postViewer');
    postViewer.hidden = false;
    document.getElementById('postViewerTitle').textContent = 'SHORT · testuser';
    document.getElementById('postViewerMedia').innerHTML = '<div class="media-9x16"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="></div>';

    // Ensure nav buttons are visible (not disabled)
    document.getElementById('prevPost').disabled = false;
    document.getElementById('nextPost').disabled = false;
  });

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification_viewer_nav.png' });
});
