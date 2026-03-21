
import asyncio
from playwright.async_api import async_playwright
import json
import os
import time

async def verify_final():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 900})
        page = await context.new_page()

        # Mock Data
        user_id = "user1"
        other_id = "user2"
        chat_id = "dm:user1_user2"

        session = {
            "id": user_id, "uid": user_id, "username": "tester", "name": "Tester",
            "activeUsernameId": "tester_id", "stats": {"followerCount": 0, "followingCount": 0}
        }
        users = [
            {"id": user_id, "username": "tester", "name": "Tester", "activeUsernameId": "tester_id", "usernames": [{"id": "tester_id", "value": "tester"}]},
            {"id": other_id, "username": "friend", "name": "Friend", "activeUsernameId": "friend_id", "usernames": [{"id": "friend_id", "value": "friend"}], "profilePic": "https://i.pravatar.cc/150?u=user2"}
        ]
        conversations = [{
            "id": chat_id, "participants": [user_id, other_id], "type": "dm", "lastMessage": "Check this out", "updatedAt": 1700000000000
        }]

        messages = [
            {
                "id": "m1", "chatId": chat_id, "senderId": other_id, "text": "Here is the doc",
                "files": [{"name": "Report.pdf", "type": "application/pdf", "size": 102456, "url": "#"}],
                "createdAt": 1700000000000
            },
            {
                "id": "m2", "chatId": chat_id, "senderId": user_id, "type": "poll",
                "poll": {"question": "Lunch?", "options": [{"text": "Pizza", "votes": []}, {"text": "Sushi", "votes": []}]},
                "createdAt": 1700000001000
            }
        ]

        await page.add_init_script(f"""
            localStorage.setItem('chatbhar.session', JSON.stringify({json.dumps(session)}));
            localStorage.setItem('chatbhar.users', JSON.stringify({json.dumps(users)}));
            localStorage.setItem('chatbhar.conversations', JSON.stringify({json.dumps(conversations)}));
            localStorage.setItem('chatbhar.chatStore', JSON.stringify({{ "{chat_id}": {json.dumps(messages)} }}));
            localStorage.setItem('chatbhar.activeTab', 'chat');
        """)

        print("Navigating...")
        await page.goto("http://localhost:8080")

        # Wait for app shell
        await page.wait_for_selector("#appShell", state="visible")
        print("App shell visible")

        # Explicitly click the chat tab to ensure it's active and triggered
        await page.click(".nav-btn[data-tab='chat']")

        # Wait for chat user to be visible
        await page.wait_for_selector(".chat-user", state="visible", timeout=10000)
        print("Chat user visible")

        # Click the chat user
        await page.click(".chat-user")

        # 1. Capture Main Chat with Poll and File
        await page.wait_for_selector(".poll-bubble", timeout=10000)
        await page.screenshot(path="verify_1_chat_content.png")
        print("S1 captured")

        # 2. Capture 3-dot menu
        await page.click("#chatMenuBtn")
        await page.wait_for_selector("#chatMenu", state="visible")
        await page.screenshot(path="verify_2_chat_menu.png")
        print("S2 captured")

        # 3. Capture More submenu
        # Using evaluate to show it since hover might be tricky in headless if it's CSS based
        await page.evaluate('document.getElementById("moreSubmenu").hidden = false')
        await page.screenshot(path="verify_3_more_menu.png")
        print("S3 captured")

        # Close menus
        await page.click("#activeChatTitle")

        # 4. Capture Attachment menu
        await page.click("#toggleAttachmentMenuBtn")
        await page.wait_for_selector("#attachmentMenu", state="visible")
        await page.screenshot(path="verify_4_attachment_menu.png")
        print("S4 captured")

        # 5. Capture Theme Modal
        await page.click("#chatMenuBtn")
        await page.click("#themeMenuBtn")
        await page.wait_for_selector("#themeModal", state="visible")
        await page.screenshot(path="verify_5_theme_modal.png")
        print("S5 captured")

        await browser.close()

if __name__ == "__main__":
    # Start a server in background
    os.system("python3 -m http.server 8080 > server.log 2>&1 &")
    time.sleep(3)
    try:
        asyncio.run(verify_final())
    finally:
        os.system("pkill -f http.server")
