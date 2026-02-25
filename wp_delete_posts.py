#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Login
        await page.goto('https://whitelabl.in/wp-login.php')
        await page.fill('input[name="log"]', 'openclaw')
        await page.fill('input[name="pwd"]', '9T3uu6W5rc*wl(ND5sf(jhkQ')
        await page.click('input[id="wp-submit"]')
        await page.wait_for_load_state('networkidle')
        
        # Delete Hello World post (ID 1)
        print("Deleting Hello World post...")
        await page.goto('https://whitelabl.in/wp-admin/edit.php')
        await page.wait_for_load_state('networkidle')
        
        # Find and trash the Hello World post
        hello_world_checkbox = await page.query_selector('tr#post-1 input[type="checkbox"]')
        if hello_world_checkbox:
            await hello_world_checkbox.click()
            # Select Bulk Actions -> Move to Trash
            await page.select_option('select[name="action"]', 'trash')
            await page.click('input[id="doaction"]')
            await page.wait_for_load_state('networkidle')
            print("Hello World post moved to trash")
        else:
            print("Hello World post not found or already deleted")
        
        # Delete Whitelabl Mockup Maker post (ID 728)
        print("Deleting Whitelabl Mockup Maker post...")
        await page.goto('https://whitelabl.in/wp-admin/edit.php')
        await page.wait_for_load_state('networkidle')
        
        mockup_checkbox = await page.query_selector('tr#post-728 input[type="checkbox"]')
        if mockup_checkbox:
            await mockup_checkbox.click()
            await page.select_option('select[name="action"]', 'trash')
            await page.click('input[id="doaction"]')
            await page.wait_for_load_state('networkidle')
            print("Mockup Maker post moved to trash")
        else:
            print("Mockup Maker post not found or already deleted")
        
        # Empty trash
        print("Emptying trash...")
        await page.goto('https://whitelabl.in/wp-admin/edit.php?post_status=trash&post_type=post')
        await page.wait_for_load_state('networkidle')
        
        # Check if there are posts in trash
        empty_trash_btn = await page.query_selector('input[name="delete_all"]')
        if empty_trash_btn:
            await empty_trash_btn.click()
            await page.wait_for_load_state('networkidle')
            print("Trash emptied")
        
        print("\nPosts deleted successfully!")
        await browser.close()

asyncio.run(main())
