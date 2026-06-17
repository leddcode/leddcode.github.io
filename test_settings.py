import asyncio
from playwright.async_api import async_playwright
import time
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Start server
        import subprocess
        server = subprocess.Popen(["python3", "-m", "http.server", "3000"])
        time.sleep(2)

        try:
            await page.goto("http://localhost:3000")

            # Navigate to settings tab
            await page.locator('.tab[data-target="settings"]').click()

            # Check for Appearance section
            await page.wait_for_selector('text=Appearance')

            # Check for theme cards
            theme_cards = await page.locator('.theme-card').count()
            print(f"Found {theme_cards} theme cards.")

            # Check for Visual Effects section
            await page.wait_for_selector('text=Visual Effects')

            # Check for Toggle Matrix Effect button
            await page.wait_for_selector('text=Toggle Matrix Effect')

            # Check for Data Management section
            await page.wait_for_selector('text=Data Management')

            # Check for Reset All Data button
            await page.wait_for_selector('text=Reset All Data')

            # Test Toggle Matrix Effect
            await page.locator('text=Toggle Matrix Effect').click()
            # It should display Matrix effect canvas
            matrix_display = await page.evaluate("document.getElementById('matrix-canvas').style.display")
            print(f"Matrix canvas display: {matrix_display}")

            # Verification screenshots
            os.makedirs('/home/jules/verification/screenshots', exist_ok=True)
            await page.screenshot(path='/home/jules/verification/screenshots/settings_tab.png')
            print("Screenshot saved.")

        finally:
            server.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
