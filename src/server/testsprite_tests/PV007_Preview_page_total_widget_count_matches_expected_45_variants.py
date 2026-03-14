import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:3000/preview
        await page.goto("http://localhost:3000/preview")
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        current_url = await frame.evaluate("() => window.location.href")
        assert '/preview' in current_url
        assert await frame.locator("xpath=//*[contains(., 'Contextual Hero (2×2)')]").nth(0).is_visible(), "Expected 'Contextual Hero (2×2)' to be visible"
        total_imgs = await frame.evaluate("() => Array.from(document.querySelectorAll('img')).filter(img => img.src && img.src.includes('/api/screenshot')).length")
        assert total_imgs >= 45, "Expected at least 45 widget preview images"
        broken = await frame.evaluate("() => Array.from(document.querySelectorAll('img')).filter(img => img.src && img.src.includes('/api/screenshot') && !(img.naturalWidth > 0 || img.complete === true)).length")
        assert broken == 0, "Expected no broken widget preview images"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    