
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
        Date_now = 1700000000000

        session = {
            "id": user_id,
            "uid": user_id,
            "username": "tester",
            "activeUsernameId": "tester_id",
            "stats": {"followerCount": 0, "followingCount": 0},
            "name": "Tester"
        }

        users = [
            {"id": user_id, "usernames": [{"id": "tester_id", "value": "tester"}], "activeUsernameId": "tester_id", "username": "tester", "name": "Tester"},
            {"id": other_id, "usernames": [{"id": "other_id", "value": "other_user"}], "activeUsernameId": "other_id", "username": "other_user", "name": "Other User", "profilePic": "https://via.placeholder.com/50"}
        ]

        conversations = [{
            "id": chat_id,
            "participants": [user_id, other_id],
            "lastMessage": "I am doing great, thanks for asking!",
            "updatedAt": Date_now,
            "type": "dm",
            "isGroup": False
        }]

        messages = [
            {
                "id": "msg1",
                "chatId": chat_id,
                "senderId": other_id,
                "text": "Hi! How are you?",
                "createdAt": Date_now - 10000,
                "dir": "incoming"
            },
            {
                "id": "msg2",
                "chatId": chat_id,
                "senderId": user_id,
                "text": "I am doing great, thanks for asking!",
                "createdAt": Date_now,
                "dir": "outgoing"
            }
        ]

        chat_store = {
            chat_id: messages
        }

        # Inject into localStorage BEFORE navigating - using CORRECT KEYS
        await page.add_init_script(f"""
            localStorage.setItem('chatbhar.session', JSON.stringify({json.dumps(session)}));
            localStorage.setItem('chatbhar.users', JSON.stringify({json.dumps(users)}));
            localStorage.setItem('chatbhar.conversations', JSON.stringify({json.dumps(conversations)}));
            localStorage.setItem('chatbhar.chatStore', JSON.stringify({json.dumps(chat_store)}));
        """)

        await page.goto("http://localhost:8080")

        # Wait for app to load
        await page.wait_for_selector(".nav-btn[data-tab='chat']", state="visible")
        await page.click(".nav-btn[data-tab='chat']")

        # Wait for conversation to appear and click it
        await page.wait_for_selector("text=other_user", state="visible")
        await page.click("text=other_user")

        # Wait for messages to render
        await page.wait_for_selector("text=I am doing great", state="visible")

        # Take screenshot of the chat space
        await page.screenshot(path="/home/jules/verification/chat_space_v4.png")
        print("Screenshot saved to /home/jules/verification/chat_space_v4.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_chat_ui())
