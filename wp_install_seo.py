#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("=== PHASE 1: Installing Rank Math SEO Plugin ===\n")
        
        # Login
        await page.goto('https://whitelabl.in/wp-login.php')
        await page.fill('input[name="log"]', 'openclaw')
        await page.fill('input[name="pwd"]', '9T3uu6W5rc*wl(ND5sf(jhkQ')
        await page.click('input[id="wp-submit"]')
        await page.wait_for_load_state('networkidle')
        print("✓ Logged in")
        
        # Go to Plugins -> Add New
        await page.goto('https://whitelabl.in/wp-admin/plugin-install.php')
        await page.wait_for_load_state('networkidle')
        print("✓ Navigated to plugin installer")
        
        # Search for Rank Math
        await page.fill('input[id="search-plugins"]', 'rank math seo')
        await page.press('input[id="search-plugins"]', 'Enter')
        await page.wait_for_load_state('networkidle')
        print("✓ Searched for Rank Math SEO")
        
        # Wait for results and click Install
        await page.wait_for_selector('a.install-now', timeout=10000)
        install_btn = await page.query_selector('a.install-now')
        if install_btn:
            await install_btn.click()
            await page.wait_for_load_state('networkidle')
            print("✓ Clicked Install")
            
            # Wait for install to complete and click Activate
            await page.wait_for_selector('a.activate-now', timeout=60000)
            activate_btn = await page.query_selector('a.activate-now')
            if activate_btn:
                await activate_btn.click()
                await page.wait_for_load_state('networkidle')
                print("✓ Rank Math SEO activated!")
            else:
                print("✗ Activate button not found")
        else:
            print("✗ Install button not found")
        
        print("\n=== Plugin installation complete ===")
        await browser.close()

asyncio.run(main())
