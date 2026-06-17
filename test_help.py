import asyncio
from playwright.async_api import async_playwright
import time
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        import subprocess
        server = subprocess.Popen(["python3", "-m", "http.server", "3000"])
        time.sleep(2)

        try:
            await page.goto("http://localhost:3000")

            # Type 'help games'
            await page.fill('#command-line', 'help games')
            await page.press('#command-line', 'Enter')

            # Check for Games Manual
            await page.wait_for_selector('text=MINI-GAMES MANUAL')
            print("Help games works.")

            # Type 'help music'
            await page.fill('#command-line', 'help music')
            await page.press('#command-line', 'Enter')

            # Check for Music Player Help
            await page.wait_for_selector('text=MUSIC PLAYER HELP')
            print("Help music works.")

            # Type 'help'
            await page.fill('#command-line', 'help')
            await page.press('#command-line', 'Enter')

            # Check if music is in the list
            help_output = await page.locator('.output').last.inner_text()
            if 'music' in help_output:
                print("Music is in help list.")
            else:
                print("Music NOT in help list.")

            os.makedirs('/home/jules/verification/screenshots', exist_ok=True)
            await page.screenshot(path='/home/jules/verification/screenshots/help_commands.png')

        finally:
            server.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
