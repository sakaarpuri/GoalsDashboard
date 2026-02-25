#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("=== AUDITING FOUNDATION ITEMS ===\n")
        
        # Check homepage
        await page.goto('https://whitelabl.in/')
        await page.wait_for_load_state('networkidle')
        content = await page.content()
        text_content = await page.inner_text('body')
        
        print("1. CHECKING FOR LOREM IPSUM TESTIMONIALS:")
        if 'lorem ipsum' in text_content.lower() or 'lorem' in text_content.lower():
            print("   ✗ FOUND: Lorem ipsum text detected")
            # Find the specific text
            lines = text_content.split('\n')
            for line in lines:
                if 'lorem' in line.lower():
                    print(f"   - {line.strip()[:100]}")
        else:
            print("   ✓ No Lorem ipsum found on homepage")
        
        print("\n2. CHECKING 'ABOUT US' PAGE:")
        # Look for About Us link
        about_link = await page.query_selector('a[href*="about"], a[href*="about-us"]')
        if about_link:
            await about_link.click()
            await page.wait_for_load_state('networkidle')
            about_content = await page.inner_text('body')
            
            # Check if it's generic or has founder story
            if 'lorem' in about_content.lower() or len(about_content) < 500:
                print("   ✗ ISSUE: About page is too short or has placeholder text")
                print(f"   Length: {len(about_content)} characters")
            else:
                print("   ✓ About page has substantial content")
                print(f"   Length: {len(about_content)} characters")
        else:
            print("   ✗ NO 'About Us' link found on homepage")
        
        print("\n3. CHECKING FOR TRUST SIGNALS:")
        signals = {
            'ISO': 'iso' in content.lower(),
            'GMP': 'gmp' in content.lower(),
            'CDSCO': 'cdsco' in content.lower(),
            'Factory/Unit': any(word in content.lower() for word in ['factory', 'manufacturing unit', 'facility']),
            'Team Photos': 'team' in content.lower() or 'founder' in content.lower(),
            'Certifications': 'certificate' in content.lower() or 'certified' in content.lower()
        }
        
        for signal, found in signals.items():
            status = "✓" if found else "✗"
            print(f"   {status} {signal}: {'Found' if found else 'NOT FOUND'}")
        
        print("\n4. CHECKING STARTUP RESOURCES PAGE:")
        await page.goto('https://whitelabl.in/startup-resources/')
        await page.wait_for_load_state('networkidle')
        resources_content = await page.inner_text('body')
        
        if len(resources_content) > 1000:
            print(f"   ✓ Has substantial content ({len(resources_content)} chars)")
        else:
            print(f"   ✗ Too short ({len(resources_content)} chars) - needs expansion")
        
        # Check for useful resources
        resources_keywords = ['license', 'cdsco', 'moq', 'pricing', 'guide', 'checklist', 'startup']
        found_keywords = [kw for kw in resources_keywords if kw in resources_content.lower()]
        print(f"   Keywords found: {', '.join(found_keywords) if found_keywords else 'None'}")
        
        print("\n=== SUMMARY ===")
        print("Items that need attention:")
        if 'lorem ipsum' in text_content.lower():
            print("  - Remove Lorem ipsum testimonials")
        if not signals['ISO'] and not signals['GMP']:
            print("  - Add ISO/GMP certification badges")
        if not signals['Factory/Unit']:
            print("  - Add factory/manufacturing unit photos")
        if not signals['Team Photos']:
            print("  - Add founder/team photos")
        if len(resources_content) < 1000:
            print("  - Expand Startup Resources page")
        
        await browser.close()

asyncio.run(main())
