import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    os.makedirs("/home/jules/verification/videos/", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots/", exist_ok=True)

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

        # Test Gitlab
        await page.fill('#command-line', 'gitlab leddcode')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(2000)

        # Test Wikidata
        await page.fill('#command-line', 'wikidata Earth')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(2000)

        # Test Pexels
        await page.fill('#command-line', 'pexels cyberpunk')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(2000)

        # Test Workspace
        await page.fill('#command-line', 'workspace')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(1000)

        # Take a screenshot
        await page.screenshot(path="/home/jules/verification/screenshots/terminal.png")

        # Navigate to Ecosystem tab
        await page.click('.tab[data-target="ecosystem"]')
        await page.wait_for_timeout(2000)
        await page.screenshot(path="/home/jules/verification/screenshots/ecosystem.png")

        # Navigate to AI Hub tab
        await page.click('.tab[data-target="ai-hub"]')
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/home/jules/verification/screenshots/ai_hub.png")

        await context.close()
        await browser.close()

asyncio.run(run())
