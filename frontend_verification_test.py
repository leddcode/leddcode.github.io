import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            record_video_dir="/home/jules/verification/videos/",
            viewport={'width': 1280, 'height': 720}
        )
        page = await context.new_page()

        await page.goto("http://localhost:8000")

        # Wait for the terminal to be ready
        await page.wait_for_selector('#command-line', state='visible')

        # Test remember
        await page.fill('#command-line', 'remember goal Become the ultimate hacker')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(500)

        # Test recall
        await page.fill('#command-line', 'recall goal')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(500)

        # Test geo
        await page.fill('#command-line', 'geo me')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(1000)

        # Test leaderboard
        await page.fill('#command-line', 'leaderboard')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(1000)

        # Test challenge
        await page.fill('#command-line', 'challenge')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(1000)

        # Take a screenshot
        await page.screenshot(path="/home/jules/verification/screenshots/verification.png")

        await context.close()
        await browser.close()

asyncio.run(run())
