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
        await page.goto('https://whitelabl.in/wp-admin/plugin-install.php')
        await page.wait_for_load_state('networkidle')
        await page.wait_for_timeout(3000)
        print("✓ Plugin installer loaded")
        
        # Search for Rank Math - using the search box
        search_box = await page.query_selector('input[type="search"]#search-plugins, input#search-plugins')
        if search_box:
            await search_box.fill('rank math seo')
            await search_box.press('Enter')
            await page.wait_for_timeout(5000)
            print("✓ Searched for Rank Math")
        else:
            # Try direct URL with search parameter
            await page.goto('https://whitelabl.in/wp-admin/plugin-install.php?s=rank+math+seo&tab=search&type=term')
            await page.wait_for_timeout(5000)
            print("✓ Loaded search results via URL")
        
        # Look for Rank Math plugin
        content = await page.content()
        await page.screenshot(path='/data/.openclaw/workspace/rank_math_search.png')
        
        if 'rank-math' in content.lower() or 'rank math' in content.lower():
            print("✓ Rank Math found in results")
            
            # Find the install button for Rank Math SEO (usually first result)
            install_btn = await page.query_selector('a.install-now[data-slug*="rank-math"], a.install-now[href*="rank-math"]')
            if not install_btn:
                # Try more generic selector
                install_btn = await page.query_selector('a.install-now')
            
            if install_btn:
                # Check if it's already installed
                btn_text = await install_btn.text_content()
                if 'install' in btn_text.lower():
                    await install_btn.click()
                    await page.wait_for_timeout(8000)
                    print("✓ Clicked Install")
                    
                    # Wait for install and click Activate
                    await page.wait_for_timeout(3000)
                    activate_btn = await page.query_selector('a.activate-now[data-slug*="rank-math"], a.button.activate-now')
                    if activate_btn:
                        await activate_btn.click()
                        await page.wait_for_timeout(5000)
                        print("✓ Rank Math SEO activated!")
                    else:
                        # Check if already active
                        active_plugins = await page.query_selector('a[href*="rank-math"]')
                        if active_plugins:
                            print("✓ Rank Math appears to be active")
                        else:
                            print("? Check activation status manually")
                elif 'active' in btn_text.lower():
                    print("✓ Rank Math already installed and active")
                else:
                    print(f"? Button text: {btn_text}")
            else:
                print("✗ Install button not found")
                print("Page snippet:", content[:1000])
        else:
            print("✗ Rank Math not found - checking what plugins are available")
            print("Page snippet:", content[:1500])
        
        # Verify installation by checking plugins page
        await page.goto('https://whitelabl.in/wp-admin/plugins.php')
        await page.wait_for_load_state('networkidle')
        plugins_content = await page.content()
        
        if 'rank-math' in plugins_content.lower():
            print("\n✓✓✓ RANK MATH SEO IS INSTALLED ✓✓✓")
        else:
            print("\n? Rank Math status unclear - please verify in wp-admin")
        
        await browser.close()

asyncio.run(main())
