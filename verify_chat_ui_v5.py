
import asyncio
from playwright.async_api import async_playwright
import json
import os

async def verify_chat_ui():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Monitor console
        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        # Mock Data
        user_id = "user123"
        other_id = "user456"
        chat_id = f"dm:user123_user456"
        Date_now = 1700000000000

        session = {
            "id": user_id,
            "uid": user_id,
            "username": "tester",
            "activeUsernameId": "tester_id",
            "stats": {"followerCount": 0, "followingCount": 0},
            "name": "Tester",
            "email": "tester@gmail.com"
        }

        users = [
            {"id": user_id, "usernames": [{"id": "tester_id", "value": "tester"}], "activeUsernameId": "tester_id", "username": "tester", "name": "Tester", "email": "tester@gmail.com"},
            {"id": other_id, "usernames": [{"id": "other_id", "value": "other_user"}], "activeUsernameId": "other_id", "username": "other_user", "name": "Other User", "profilePic": "https://via.placeholder.com/50", "email": "other@gmail.com"}
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

        # Inject into localStorage BEFORE navigating
        await page.add_init_script(f"""
            localStorage.setItem('chatbhar.session', JSON.stringify({json.dumps(session)}));
            localStorage.setItem('chatbhar.users', JSON.stringify({json.dumps(users)}));
            localStorage.setItem('chatbhar.conversations', JSON.stringify({json.dumps(conversations)}));
            localStorage.setItem('chatbhar.chatStore', JSON.stringify({json.dumps(chat_store)}));
        """)

        print("Navigating to app...")
        await page.goto("http://localhost:8080")

        # Check if we are logged in
        print("Waiting for app shell...")
        await page.wait_for_selector("#appShell", state="visible", timeout=10000)

        print("Clicking Chat tab...")
        await page.click(".nav-btn[data-tab='chat']")

        # Wait for chat list to populate
        print("Waiting for conversation tile...")
        try:
            await page.wait_for_selector(".chat-user", state="visible", timeout=10000)
            print("Conversation tile found.")
        except:
            print("Conversation tile NOT found. Taking diagnostic screenshot.")
            await page.screenshot(path="/home/jules/verification/diagnostic_chat_tab.png")
            # Try to force a re-render or click Select Contact
            # Actually, let's just see what's on the screen
            return

        # Click the chat tile
        await page.click(".chat-user")

        # Wait for messages
        print("Waiting for messages in container...")
        await page.wait_for_selector(".bubble", state="visible", timeout=10000)

        # Final screenshot
        await page.screenshot(path="/home/jules/verification/chat_space_final.png")
        print("Final screenshot saved to /home/jules/verification/chat_space_final.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_chat_ui())
