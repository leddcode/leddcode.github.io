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

        # Test agent profile updates
        await page.fill('#command-line', 'todo add Build the ultimate app')
        await page.press('#command-line', 'Enter')
        await page.wait_for_timeout(500)

        # Switch to tasks tab
        await page.click('div[data-target="tasks"]')
        await page.wait_for_selector('#tasks-data', state='visible')
        await page.wait_for_timeout(500)

        # Add task via UI
        await page.fill('#new-task-input', 'Rule the world')
        await page.click('.add-task-form button')
        await page.wait_for_timeout(500)

        # Toggle a task via UI
        await page.click('.task-item input[type="checkbox"]')
        await page.wait_for_timeout(500)

        # Switch to settings tab
        await page.click('div[data-target="settings"]')
        await page.wait_for_selector('#settings-data', state='visible')
        await page.wait_for_timeout(500)

        # Change theme via UI
        await page.click('.theme-card:has(.theme-preview-dracula)')
        await page.wait_for_timeout(500)

        # Take a screenshot
        await page.screenshot(path="/home/jules/verification/screenshots/verification.png")

        await context.close()
        await browser.close()

asyncio.run(run())
