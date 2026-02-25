#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("=== Installing Rank Math SEO Plugin ===\n")
        
        # Login
        await page.goto('https://whitelabl.in/wp-login.php')
        await page.fill('input[name="log"]', 'openclaw')
        await page.fill('input[name="pwd"]', '9T3uu6W5rc*wl(ND5sf(jhkQ')
        await page.click('input[id="wp-submit"]')
        await page.wait_for_load_state('networkidle')
        print("✓ Logged in")
        
        # Go to Plugins -> Add New
        await page.goto('https://whitelabl.in/wp-admin/plugin-install.php?s=rank+math+seo&tab=search&type=term')
        await page.wait_for_load_state('networkidle')
        print("✓ Navigated to plugin search")
        
        # Wait for results to load
        await page.wait_for_timeout(3000)
        
        # Take screenshot to debug
        await page.screenshot(path='/data/.openclaw/workspace/plugin_search.png')
        print("✓ Screenshot saved")
        
        # Look for Rank Math plugin card
        content = await page.content()
        if 'rank-math' in content.lower() or 'rank math' in content.lower():
            print("✓ Rank Math found in search results")
            
            # Try to find and click install button
            install_buttons = await page.query_selector_all('a.install-now')
            print(f"Found {len(install_buttons)} install buttons")
            
            if install_buttons:
                await install_buttons[0].click()
                await page.wait_for_timeout(5000)
                print("✓ Clicked Install")
                
                # Look for activate button
                activate_buttons = await page.query_selector_all('a.activate-now')
                if activate_buttons:
                    await activate_buttons[0].click()
                    await page.wait_for_timeout(3000)
                    print("✓ Rank Math SEO activated!")
                else:
                    print("? Activate button not found - may already be active")
            else:
                print("✗ No install buttons found")
        else:
            print("✗ Rank Math not found in results")
            print("Page content preview:", content[:500])
        
        print("\n=== Done ===")
        await browser.close()

asyncio.run(main())
