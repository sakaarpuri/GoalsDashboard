#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("=== Updating Contact Information ===\n")
        
        # Login
        await page.goto('https://whitelabl.in/wp-login.php')
        await page.fill('input[name="log"]', 'openclaw')
        await page.fill('input[name="pwd"]', '9T3uu6W5rc*wl(ND5sf(jhkQ')
        await page.click('input[id="wp-submit"]')
        await page.wait_for_load_state('networkidle')
        print("✓ Logged in")
        
        # Navigate to homepage (Elementor editor)
        await page.goto('https://whitelabl.in/')
        await page.wait_for_load_state('networkidle')
        print("✓ Loaded homepage")
        
        # Look for Edit with Elementor button
        edit_btn = await page.query_selector('a[href*="elementor"], #wp-admin-bar-elementor-edit a')
        if edit_btn:
            await edit_btn.click()
            await page.wait_for_timeout(5000)
            print("✓ Opened Elementor editor")
            
            # Take screenshot to see current state
            await page.screenshot(path='/data/.openclaw/workspace/elementor_edit.png')
            
            # Look for phone number in the page and update it
            # This will depend on how the phone is stored (text widget, button, etc.)
            content = await page.content()
            if '+91' in content or 'phone' in content.lower():
                print("✓ Found phone reference in page")
                # The actual update would require interacting with Elementor widgets
                # This is complex via automation - may need manual guidance
            else:
                print("? Phone number not found in obvious location")
        else:
            print("✗ Elementor edit link not found")
        
        # Alternative: Check if there's a theme options or contact info section
        await page.goto('https://whitelabl.in/wp-admin/customize.php')
        await page.wait_for_load_state('networkidle')
        print("\n✓ Opened Customizer")
        
        # Look for contact info section
        await page.wait_for_timeout(3000)
        customizer_content = await page.content()
        await page.screenshot(path='/data/.openclaw/workspace/customizer.png')
        
        if 'contact' in customizer_content.lower() or 'phone' in customizer_content.lower():
            print("✓ Found contact settings in Customizer")
        else:
            print("? Contact settings location unclear")
        
        # Check Rank Math settings for contact info
        await page.goto('https://whitelabl.in/wp-admin/admin.php?page=rank-math')
        await page.wait_for_load_state('networkidle')
        await page.wait_for_timeout(3000)
        print("\n✓ Opened Rank Math dashboard")
        
        await browser.close()
        print("\n=== Contact update attempt complete ===")
        print("\nNOTE: Phone number may be embedded in Elementor widgets.")
        print("Easiest approach: Can you tell me where the phone number is displayed?")
        print("(Footer, Header, Contact page, or a specific section?)")

asyncio.run(main())
