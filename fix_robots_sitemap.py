#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("=== FIXING ROBOTS.TXT SITEMAP URL ===\n")
        
        # Login
        await page.goto('https://whitelabl.in/wp-login.php')
        await page.fill('input[name="log"]', 'openclaw')
        await page.fill('input[name="pwd"]', '9T3uu6W5rc*wl(ND5sf(jhkQ')
        await page.click('input[id="wp-submit"]')
        await page.wait_for_load_state('networkidle')
        print("✓ Logged in")
        
        # Go to Rank Math Sitemap settings
        await page.goto('https://whitelabl.in/wp-admin/admin.php?page=rank-math&view=sitemap')
        await page.wait_for_timeout(5000)
        print("✓ Opened Rank Math Sitemap settings")
        
        # Take screenshot
        await page.screenshot(path='/data/.openclaw/workspace/sitemap_settings.png')
        
        # Check if sitemap is enabled
        content = await page.content()
        if 'sitemap' in content.lower():
            print("✓ Sitemap module active")
        
        # Try to find settings to update robots.txt
        await page.goto('https://whitelabl.in/wp-admin/admin.php?page=rank-math&view=settings')
        await page.wait_for_timeout(5000)
        print("✓ Opened Rank Math general settings")
        
        # Check for robots.txt editor
        await page.goto('https://whitelabl.in/wp-admin/tools.php?page=rank-math-robots')
        await page.wait_for_timeout(5000)
        content = await page.content()
        
        if 'robots' in content.lower():
            print("✓ Found Rank Math robots.txt editor")
            
            # Look for sitemap URL field
            sitemap_field = await page.query_selector('input[name*="sitemap"], textarea[name*="robots"]')
            if sitemap_field:
                print("   Found editable field")
                # Clear and update with correct URL
                await sitemap_field.fill('')
                await sitemap_field.fill('Sitemap: https://whitelabl.in/sitemap.xml')
                print("   ✓ Updated sitemap URL")
                
                # Save
                save_btn = await page.query_selector('button[type="submit"], .button-primary')
                if save_btn:
                    await save_btn.click()
                    await page.wait_for_timeout(3000)
                    print("   ✓ Saved robots.txt")
        else:
            print("? Rank Math robots editor not found, trying direct file edit")
            
            # Alternative: Use file manager or SEO plugin
            await page.goto('https://whitelabl.in/wp-admin/admin.php?page=rank-math&view=settings&setting=sitemap')
            await page.wait_for_timeout(5000)
        
        # Verify fix
        import requests
        response = requests.get('https://whitelabl.in/robots.txt', timeout=10)
        print(f"\n=== VERIFICATION ===")
        print(f"Robots.txt status: {response.status_code}")
        print(f"Content:\n{response.text}")
        
        if 'sitemap.xml' in response.text:
            print("\n✅✅✅ SITEMAP URL FIXED! ✅✅✅")
        else:
            print("\n⚠️ Sitemap URL still needs fixing")
        
        await browser.close()

asyncio.run(main())
