const puppeteer = require('puppeteer');

class ASOSScraper {
    constructor() {
        this.baseUrl = 'https://www.asos.com';
    }

    async scrapeProduct(url) {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            await page.setViewport({ width: 1920, height: 1080 });
            
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Wait for product details to load
            await page.waitForSelector('h1', { timeout: 5000 });
            
            const product = await page.evaluate(() => {
                const name = document.querySelector('h1')?.textContent?.trim();
                const priceText = document.querySelector('[data-testid="current-price"]')?.textContent || 
                                 document.querySelector('.current-price')?.textContent;
                const image = document.querySelector('img[alt*="product"]')?.src ||
                             document.querySelector('img[data-testid="product-image"]')?.src;
                const description = document.querySelector('[data-testid="product-description"]')?.textContent;
                
                // Extract numeric price
                const priceMatch = priceText?.match(/[\d,]+\.?\d*/);
                const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : null;
                
                return {
                    name,
                    brand: 'ASOS',
                    price,
                    priceText,
                    image,
                    description,
                    url: window.location.href,
                    category: 'fashion'
                };
            });

            return product;
        } catch (error) {
            console.error('ASOS scrape error:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    async searchSimilar(attributes) {
        // Search ASOS with extracted attributes
        const { category, color, style, maxPrice } = attributes;
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            
            // Build search URL
            const searchQuery = `${color} ${style} ${category}`.trim();
            const searchUrl = `https://www.asos.com/search/?q=${encodeURIComponent(searchQuery)}`;
            
            await page.goto(searchUrl, { waitUntil: 'networkidle2' });
            await page.waitForSelector('[data-testid="product-list"] article', { timeout: 10000 });
            
            const products = await page.evaluate((maxPrice) => {
                const items = document.querySelectorAll('[data-testid="product-list"] article');
                return Array.from(items).slice(0, 6).map(item => {
                    const name = item.querySelector('h2, h3')?.textContent?.trim();
                    const priceText = item.querySelector('[data-testid="current-price"]')?.textContent;
                    const image = item.querySelector('img')?.src;
                    const link = item.querySelector('a')?.href;
                    
                    const priceMatch = priceText?.match(/[\d,]+\.?\d*/);
                    const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : null;
                    
                    return { name, price, priceText, image, link, retailer: 'asos.com' };
                }).filter(p => !maxPrice || p.price <= maxPrice);
            }, maxPrice);

            return products;
        } catch (error) {
            console.error('ASOS search error:', error);
            return [];
        } finally {
            await browser.close();
        }
    }
}

module.exports = ASOSScraper;
