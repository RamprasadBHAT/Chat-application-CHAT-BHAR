import { test, expect } from '@playwright/test';

test('Verify Messaging UI and Real-time Sync Fix', async ({ page }) => {
    // 1. Setup session and mock Firebase/Firestore in a way that lets us test the UI logic
    await page.goto('http://localhost:4173');

    await page.evaluate(() => {
        const user = { id: 'u1', name: 'Tester', email: 'tester@gmail.com', username: 'tester', usernames: [{id:'un1', value:'tester'}], activeUsernameId: 'un1' };
        const other = { id: 'u2', name: 'Other', email: 'other@gmail.com', username: 'other', usernames: [{id:'un2', value:'other'}], activeUsernameId: 'un2' };

        localStorage.setItem('chatbhar.users', JSON.stringify([user, other]));
        localStorage.setItem('chatbhar.session', JSON.stringify(user));

        // Setup chatMeta with unified ID format
        const chatId = 'dm:u1_u2';
        const chatMeta = {
            [chatId]: { id: chatId, name: 'other', participants: ['u1', 'u2'], isGroup: false, online: true }
        };
        localStorage.setItem('chatbhar.chatMeta', JSON.stringify(chatMeta));

        // Setup initial messages
        const initialMessages = [
            { id: 'm1', chatId: chatId, senderId: 'u2', senderName: 'other', text: 'Hi from other!', createdAt: Date.now() - 1000, dir: 'incoming' }
        ];
        localStorage.setItem('chatbhar.chatStore', JSON.stringify({ [chatId]: initialMessages }));
    });

    await page.reload();

    // 2. Navigate to Chat tab
    await page.click('.nav-btn[data-tab="chat"]');

    // 3. Select the user in the sidebar
    // We expect "other" to be in the chat list
    const otherChatBtn = page.locator('.chat-user:has-text("other")');
    await expect(otherChatBtn).toBeVisible();
    await otherChatBtn.click();

    // 4. Verify the message "Hi from other!" is visible in the main chat window
    const incomingMessage = page.locator('.bubble.incoming:has-text("Hi from other!")');
    await expect(incomingMessage).toBeVisible();

    // 5. Send a new message
    const myMessage = 'Test reply ' + Date.now();
    await page.fill('#messageInput', myMessage);
    await page.click('#chatForm button[type="submit"]');

    // 6. Verify our message appears in the main window
    const outgoingMessage = page.locator('.bubble.outgoing:has-text("' + myMessage + '")');
    await expect(outgoingMessage).toBeVisible();

    console.log('Verification successful: Main chat window displays messages and updates correctly.');
});
