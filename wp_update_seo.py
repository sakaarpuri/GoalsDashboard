#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("=== Updating Whitelabl Homepage SEO for India ===\n")
        
        # Login
        await page.goto('https://whitelabl.in/wp-login.php')
        await page.fill('input[name="log"]', 'openclaw')
        await page.fill('input[name="pwd"]', '9T3uu6W5rc*wl(ND5sf(jhkQ')
        await page.click('input[id="wp-submit"]')
        await page.wait_for_load_state('networkidle')
        print("✓ Logged in as Administrator")
        
        # Navigate to Pages
        await page.goto('https://whitelabl.in/wp-admin/edit.php?post_type=page')
        await page.wait_for_load_state('networkidle')
        print("✓ Navigated to Pages")
        
        # Find and click Edit on the Startup Resources page (ID 522 - likely homepage)
        # Look for the page with empty title
        await page.wait_for_timeout(2000)
        
        # Take screenshot to see current state
        await page.screenshot(path='/data/.openclaw/workspace/pages_list.png')
        print("✓ Screenshot saved")
        
        # Look for Quick Edit link for page 522
        page_522_row = await page.query_selector('tr#post-522')
        if page_522_row:
            print("✓ Found Startup Resources page (ID 522)")
            
            # Click Quick Edit
            quick_edit = await page_522_row.query_selector('button.button-link.editinline')
            if quick_edit:
                await quick_edit.click()
                await page.wait_for_timeout(2000)
                print("✓ Opened Quick Edit")
                
                # Update the title
                title_input = await page.query_selector('input[name="post_title"]')
                if title_input:
                    await title_input.fill('')
                    await title_input.fill('White Label Cosmetics Manufacturer India | Launch Your Own Skincare Brand')
                    print("✓ Updated title for Indian market")
                
                # Save changes
                save_btn = await page.query_selector('button.button.button-primary.save')
                if save_btn:
                    await save_btn.click()
                    await page.wait_for_timeout(2000)
                    print("✓ Saved changes")
        else:
            print("✗ Page 522 not found")
        
        # Now let's also update the site title and tagline in Settings
        await page.goto('https://whitelabl.in/wp-admin/options-general.php')
        await page.wait_for_load_state('networkidle')
        print("\n✓ Navigated to General Settings")
        
        # Update site title
        site_title = await page.query_selector('input[name="blogname"]')
        if site_title:
            await site_title.fill('')
            await site_title.fill('Whitelabl - Private Label Cosmetics Manufacturer India')
            print("✓ Updated site title")
        
        # Update tagline (meta description)
        tagline = await page.query_selector('input[name="blogdescription"]')
        if tagline:
            await tagline.fill('')
            await tagline.fill('Launch your own skincare, haircare & personal care brand. Low MOQ, CDSCO-compliant manufacturing for Indian entrepreneurs. Start with just 100 units!')
            print("✓ Updated tagline (meta description)")
        
        # Save settings
        submit_btn = await page.query_selector('input[name="submit"]')
        if submit_btn:
            await submit_btn.click()
            await page.wait_for_load_state('networkidle')
            print("✓ Saved all settings")
        
        print("\n=== SEO Update Complete ===")
        print("\nChanges made:")
        print("• Site Title: 'Whitelabl - Private Label Cosmetics Manufacturer India'")
        print("• Tagline: 'Launch your own skincare, haircare & personal care brand...'")
        print("• Keywords targeted: private label cosmetics, India, low MOQ, CDSCO")
        
        await browser.close()

asyncio.run(main())
