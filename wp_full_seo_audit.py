#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright
import re

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("=" * 70)
        print("COMPREHENSIVE SEO AUDIT - whitelabl.in")
        print("=" * 70)
        
        # Login
        await page.goto('https://whitelabl.in/wp-login.php')
        await page.fill('input[name="log"]', 'openclaw')
        await page.fill('input[name="pwd"]', '9T3uu6W5rc*wl(ND5sf(jhkQ')
        await page.click('input[id="wp-submit"]')
        await page.wait_for_load_state('networkidle')
        
        # Get all pages
        await page.goto('https://whitelabl.in/wp-json/wp/v2/pages?per_page=100')
        await page.wait_for_load_state('networkidle')
        pages_json = await page.evaluate('() => document.body.innerText')
        
        import json
        pages = json.loads(pages_json)
        
        print(f"\n📄 FOUND {len(pages)} PAGES:\n")
        
        audit_results = []
        
        for page_data in pages:
            page_id = page_data['id']
            title = page_data['title']['rendered']
            slug = page_data['slug']
            link = page_data['link']
            
            print(f"\n{'='*70}")
            print(f"📄 {title} (/{slug}/)")
            print(f"{'='*70}")
            
            # Visit the actual page to check SEO
            await page.goto(link)
            await page.wait_for_load_state('networkidle')
            await page.wait_for_timeout(2000)
            
            # Get page title
            page_title = await page.title()
            print(f"📝 Page Title: {page_title}")
            
            # Check title length (should be 50-60 chars)
            title_length = len(page_title)
            if title_length < 30:
                print(f"   ⚠️  Title too short ({title_length} chars)")
            elif title_length > 60:
                print(f"   ⚠️  Title too long ({title_length} chars)")
            else:
                print(f"   ✅ Title length good ({title_length} chars)")
            
            # Get meta description
            meta_desc = await page.eval_on_selector('meta[name="description"]', 'el => el.content') if await page.query_selector('meta[name="description"]') else None
            
            if meta_desc:
                desc_length = len(meta_desc)
                print(f"📝 Meta Description: {meta_desc[:100]}...")
                if desc_length < 120:
                    print(f"   ⚠️  Description too short ({desc_length} chars)")
                elif desc_length > 160:
                    print(f"   ⚠️  Description too long ({desc_length} chars)")
                else:
                    print(f"   ✅ Description length good ({desc_length} chars)")
            else:
                print(f"   ❌ NO META DESCRIPTION FOUND")
            
            # Check for H1
            h1 = await page.query_selector('h1')
            if h1:
                h1_text = await h1.text_content()
                print(f"📝 H1: {h1_text.strip()[:80]}")
            else:
                print(f"   ❌ NO H1 TAG FOUND")
            
            # Check for H2s
            h2s = await page.query_selector_all('h2')
            print(f"📝 H2 Tags: {len(h2s)} found")
            
            # Check for images without alt text
            images = await page.query_selector_all('img')
            images_without_alt = 0
            for img in images:
                alt = await img.get_attribute('alt')
                if not alt:
                    images_without_alt += 1
            if images_without_alt > 0:
                print(f"   ⚠️  {images_without_alt} images without alt text")
            else:
                print(f"   ✅ All images have alt text")
            
            # Check content length
            body_text = await page.inner_text('body')
            word_count = len(body_text.split())
            print(f"📝 Content: ~{word_count} words")
            if word_count < 300:
                print(f"   ⚠️  Content too thin (needs 300+ words)")
            else:
                print(f"   ✅ Content length good")
            
            # Check for target keywords
            content_lower = body_text.lower()
            keywords_found = []
            keywords_to_check = ['private label', 'white label', 'cosmetics', 'manufacturing', 'skincare', 'haircare', 'cdsco', 'third party']
            for kw in keywords_to_check:
                if kw in content_lower:
                    keywords_found.append(kw)
            print(f"📝 Keywords: {', '.join(keywords_found) if keywords_found else 'None found'}")
            
            # Check for internal links
            internal_links = await page.query_selector_all(f'a[href*="whitelabl.in"]')
            print(f"📝 Internal Links: {len(internal_links)}")
            
            # Check for canonical URL
            canonical = await page.query_selector('link[rel="canonical"]')
            if canonical:
                print(f"   ✅ Canonical URL present")
            else:
                print(f"   ⚠️  No canonical URL")
            
            # Check for Open Graph tags
            og_title = await page.query_selector('meta[property="og:title"]')
            if og_title:
                print(f"   ✅ Open Graph tags present")
            else:
                print(f"   ⚠️  No Open Graph tags")
            
            audit_results.append({
                'id': page_id,
                'title': title,
                'slug': slug,
                'issues': []
            })
        
        print(f"\n{'='*70}")
        print("SUMMARY OF ISSUES")
        print(f"{'='*70}")
        
        await browser.close()

asyncio.run(main())
