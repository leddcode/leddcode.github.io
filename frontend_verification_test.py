import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(record_video_dir="/home/jules/verification/videos")

        await page.goto("http://localhost:8000")

        # Click on AI Hub tab
        await page.click('.tab[data-target="ai-hub"]')
        await page.wait_for_timeout(1000)

        # Click on Terminal tab
        await page.click('.tab[data-target="terminal"]')
        await page.wait_for_timeout(500)

        # Focus command line
        await page.focus('#command-line')

        # Type "voice" and enter
        await page.fill('#command-line', 'voice')
        await page.keyboard.press('Enter')
        await page.wait_for_timeout(2000)

        # Type "docparse https://test.com" and enter
        await page.fill('#command-line', 'docparse https://test.com')
        await page.keyboard.press('Enter')
        await page.wait_for_timeout(1000)

        # Type "companion" and enter
        await page.fill('#command-line', 'companion')
        await page.keyboard.press('Enter')
        await page.wait_for_timeout(1000)

        # Type "longterm search" and enter
        await page.fill('#command-line', 'longterm search')
        await page.keyboard.press('Enter')
        await page.wait_for_timeout(1000)

        # Type "interact chat" and enter
        await page.fill('#command-line', 'interact chat')
        await page.keyboard.press('Enter')
        await page.wait_for_timeout(1000)

        # Type "triviaapi start" and enter
        await page.fill('#command-line', 'triviaapi start')
        await page.keyboard.press('Enter')
        await page.wait_for_timeout(1000)

        # Type "stocks TSLA" and enter
        await page.fill('#command-line', 'stocks TSLA')
        await page.keyboard.press('Enter')
        await page.wait_for_timeout(2000)

        # Take screenshot
        await page.screenshot(path="/home/jules/verification/screenshots/verification.png")

        await browser.close()

asyncio.run(run())
