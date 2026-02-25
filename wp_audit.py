#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright
import re

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
        
        # Navigate to posts
        await page.goto('https://whitelabl.in/wp-admin/edit.php')
        await page.wait_for_load_state('networkidle')
        
        # Extract post titles and SEO status
        posts = await page.query_selector_all('tr.type-post')
        print(f"Found {len(posts)} posts:\n")
        print("-" * 60)
        
        for post in posts[:10]:  # Check first 10 posts
            title_elem = await post.query_selector('.row-title')
            if title_elem:
                title = await title_elem.text_content()
                href = await title_elem.get_attribute('href')
                
                # Check if there's an SEO indicator (Yoast/RankMath)
                seo_elem = await post.query_selector('.wpseo-score, .rank-math-seo-score, .seo-score')
                seo_status = await seo_elem.text_content() if seo_elem else "No SEO plugin detected"
                
                print(f"Title: {title.strip()}")
                print(f"Link: {href}")
                print(f"SEO Status: {seo_status}")
                print("-" * 60)
        
        # Check for SEO plugins
        await page.goto('https://whitelabl.in/wp-admin/plugins.php')
        await page.wait_for_load_state('networkidle')
        
        content = await page.content()
        seo_plugins = []
        if 'yoast' in content.lower():
            seo_plugins.append("Yoast SEO")
        if 'rank math' in content.lower():
            seo_plugins.append("Rank Math")
        if 'all-in-one-seo' in content.lower():
            seo_plugins.append("All in One SEO")
        if 'seopress' in content.lower():
            seo_plugins.append("SEOPress")
            
        print(f"\nDetected SEO Plugins: {', '.join(seo_plugins) if seo_plugins else 'None detected'}")
        
        # Check homepage meta
        await page.goto('https://whitelabl.in/')
        await page.wait_for_load_state('networkidle')
        
        title = await page.title()
        description = await page.eval_on_selector('meta[name="description"]', 'el => el.content') if await page.query_selector('meta[name="description"]') else "No meta description"
        
        print(f"\nHomepage Analysis:")
        print(f"Title: {title}")
        print(f"Meta Description: {description}")
        
        await browser.close()

asyncio.run(main())
