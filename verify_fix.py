from playwright.sync_api import Page, expect, sync_playwright
import os

def verify_auth_guard(page: Page):
    # Go to the app
    page.goto("http://localhost:4173")
    page.wait_for_timeout(1000)

    # Take a screenshot of the login page
    page.screenshot(path="verification_login.png")

    # Try to login with some random credentials
    # Since we added real Firebase config, it might actually try to reach Firebase.
    # But we want to see if our guard works if Firebase is NOT configured.
    # I will temporarily revert the config in app.js for a moment in the script if needed,
    # but let's see what happens with the current config.

    page.click("#showLoginForm")
    page.wait_for_timeout(500)
    page.fill("#emailInput", "test@gmail.com")
    page.fill("#passwordInput", "wrongpassword")
    page.click("#loginForm button[type='submit']")

    page.wait_for_timeout(2000)

    # Take a screenshot of the result
    page.screenshot(path="verification_login_attempt.png")

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    if not os.path.exists("verification/video"):
        os.makedirs("verification/video")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="verification/video")
        page = context.new_page()
        try:
            verify_auth_guard(page)
        finally:
            context.close()
            browser.close()
