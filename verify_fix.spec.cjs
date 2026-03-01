import { test, expect } from '@playwright/test';

test('Robust localStorage parsing and Local Signup Consistency', async ({ page }) => {
    // Block API calls to force fallback to localApiRequest
    await page.route('**/api/**', route => route.abort());

    await page.goto('http://localhost:4173');

    // Simulate broken/wrapped localStorage format that caused users.some is not a function
    await page.evaluate(() => {
        localStorage.setItem('chatbhar.users', JSON.stringify({
            users: [
                { id: '1', email: 'existing@gmail.com', password: 'password123', name: 'Existing User' }
            ]
        }));
        // Ensure we are logged out
        localStorage.removeItem('chatbhar.session');
    });

    await page.reload();

    // Verify we can still see signup form
    await expect(page.locator('#signupForm')).toBeVisible();

    // Try to signup with existing email (should trigger the users.some check in localApiRequest)
    await page.fill('#signupName', 'New User');
    await page.fill('#signupEmail', 'existing@gmail.com');
    await page.fill('#signupPassword', 'password123');
    await page.fill('#signupConfirmPassword', 'password123');
    await page.click('#signupForm button[type="submit"]');

    // Should show error message "Email already exists"
    // Note: It might take a moment for the async localApiRequest to complete and update the UI
    await expect(page.locator('#authMessage')).toContainText('Email already exists', { timeout: 10000 });

    // Try valid signup to verify newUser object consistency
    const uniqueEmail = `user_${Date.now()}@gmail.com`;
    await page.fill('#signupEmail', uniqueEmail);
    await page.click('#signupForm button[type="submit"]');

    // Should proceed to onboarding
    await expect(page.locator('#usernameForm')).toBeVisible();

    // Check localStorage to see if the new user has all fields
    const usersData = await page.evaluate(() => JSON.parse(localStorage.getItem('chatbhar.users')));
    // Since we fixed the parsing, it should still be an array now (because saveJson is called with the array)
    const users = Array.isArray(usersData) ? usersData : usersData.users;
    const newUser = users.find(u => u.email.includes('user_'));

    expect(newUser).toBeDefined();
    expect(newUser.usernameChangeLogs).toBeDefined();
    expect(newUser.profilePic).toBe('');
    expect(newUser.bio).toBe('');
    expect(newUser.profession).toBe('');
    expect(newUser.location).toBe('');
    expect(newUser.socialLinks).toBeDefined();
    expect(newUser.stats).toBeDefined();
    expect(newUser.isPrivate).toBe(false);

    console.log('Verification successful: Robust parsing and data consistency confirmed.');
});
