import asyncio
from playwright.async_api import async_playwright
import time
import os

async def run_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(record_video_dir="verification/videos")
        page = await context.new_page()

        await page.goto("http://localhost:3000")
        await page.wait_for_selector("#command-line")

        # Test 'games' command
        await page.fill("#command-line", "games")
        await page.press("#command-line", "Enter")
        await page.wait_for_timeout(500)

        # Test selecting snake
        await page.fill("#command-line", "snake")
        await page.press("#command-line", "Enter")
        await page.wait_for_timeout(500)

        # Move snake
        await page.fill("#command-line", "d")
        await page.press("#command-line", "Enter")
        await page.wait_for_timeout(500)

        # Quit snake
        await page.fill("#command-line", "quit")
        await page.press("#command-line", "Enter")
        await page.wait_for_timeout(200)

        # Test 'scramble' command
        await page.fill("#command-line", "scramble")
        await page.press("#command-line", "Enter")
        await page.wait_for_timeout(500)

        # Test 'binary' command
        await page.fill("#command-line", "binary")
        await page.press("#command-line", "Enter")
        await page.wait_for_timeout(500)

        # Test 'trivia' command
        await page.fill("#command-line", "trivia")
        await page.press("#command-line", "Enter")
        await page.wait_for_timeout(2000)

        await page.screenshot(path="verification/screenshots/games_final_complete.png")
        await context.close()
        await browser.close()

if __name__ == "__main__":
    if not os.path.exists("verification/screenshots"):
        os.makedirs("verification/screenshots")
    if not os.path.exists("verification/videos"):
        os.makedirs("verification/videos")

    import subprocess
    server = subprocess.Popen(["python3", "-m", "http.server", "3000"])
    try:
        asyncio.run(run_test())
        print("Verification complete.")
    finally:
        server.terminate()
