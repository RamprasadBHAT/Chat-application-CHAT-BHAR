
import asyncio
from playwright.async_api import async_playwright
import json

async def verify_chat_ui():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Mock Data
        user_id = "user123"
        other_id = "user456"
        chat_id = f"dm:{min(user_id, other_id)}_{max(user_id, other_id)}"

        session = {
            "uid": user_id,
            "username": "tester",
            "activeUsernameId": "tester_id",
            "stats": {"followerCount": 0, "followingCount": 0}
        }

        users = [
            {"id": user_id, "usernames": [{"id": "tester_id", "username": "tester"}], "activeUsernameId": "tester_id"},
            {"id": other_id, "usernames": [{"id": "other_id", "username": "other_user"}], "activeUsernameId": "other_id", "profilePic": "https://via.placeholder.com/50"}
        ]

        conversations = [{
            "id": chat_id,
            "participants": [user_id, other_id],
            "lastMessage": "Hello there!",
            "updatedAt": "2023-10-27T10:00:00.000Z",
            "type": "dm"
        }]

        messages = [
            {
                "id": "msg1",
                "chatId": chat_id,
                "senderId": other_id,
                "text": "Hi! How are you?",
                "createdAt": "2023-10-27T09:55:00.000Z"
            },
            {
                "id": "msg2",
                "chatId": chat_id,
                "senderId": user_id,
                "text": "I am doing great, thanks for asking!",
                "createdAt": "2023-10-27T10:00:00.000Z"
            }
        ]

        # Inject into localStorage BEFORE navigating
        await page.add_init_script(f"""
            localStorage.setItem('activeSession', JSON.stringify({json.dumps(session)}));
            localStorage.setItem('authUsers', JSON.stringify({json.dumps(users)}));
            localStorage.setItem('conversations', JSON.stringify({json.dumps(conversations)}));
            localStorage.setItem('chatMessages', JSON.stringify({json.dumps(messages)}));
        """)

        await page.goto("http://localhost:8080")

        # Wait for app to load and show Chat tab
        await page.wait_for_selector("text=Chat", state="visible")
        await page.click("text=Chat")

        # Wait for conversation to appear and click it
        await page.wait_for_selector("text=other_user", state="visible")
        await page.click("text=other_user")

        # Wait for messages to render
        await page.wait_for_selector("text=I am doing great", state="visible")

        # Take screenshot of the chat space
        await page.screenshot(path="/home/jules/verification/chat_space.png")
        print("Screenshot saved to /home/jules/verification/chat_space.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_chat_ui())
