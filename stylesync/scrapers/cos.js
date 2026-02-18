const puppeteer = require('puppeteer');

class COSScraper {
    constructor() {
        this.baseUrl = 'https://www.cos.com';
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
                const name = document.querySelector('h1')?.textContent?.trim() ||
                            document.querySelector('[data-testid="product-name"]')?.textContent?.trim();
                
                const priceText = document.querySelector('.price')?.textContent ||
                                 document.querySelector('[data-testid="price"]')?.textContent ||
                                 document.querySelector('.m-price')?.textContent;
                
                const image = document.querySelector('img[alt*="product" i]')?.src ||
                             document.querySelector('.product-image img')?.src ||
                             document.querySelector('[data-testid="product-image"] img')?.src ||
                             document.querySelector('img.o-product-gallery__image')?.src;
                
                const description = document.querySelector('.description')?.textContent?.trim() ||
                                   document.querySelector('[data-testid="product-description"]')?.textContent?.trim() ||
                                   document.querySelector('.m-product-description')?.textContent?.trim();
                
                // Extract numeric price
                const priceMatch = priceText?.match(/[\d,]+\.?\d*/);
                const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : null;
                
                return {
                    name,
                    brand: 'COS',
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
            console.error('COS scrape error:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    async searchSimilar(attributes) {
        // Search COS with extracted attributes
        const { category, color, style, maxPrice } = attributes;
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            
            // Build search URL
            const searchQuery = `${color} ${style} ${category}`.trim();
            const searchUrl = `https://www.cos.com/en_usd/search.html?q=${encodeURIComponent(searchQuery)}`;
            
            await page.goto(searchUrl, { waitUntil: 'networkidle2' });
            
            // Try different selectors for COS product grid
            await page.waitForSelector('.product-item, .o-product-list__item, [data-testid="product-list"] article, .m-product-listing__item', { timeout: 10000 });
            
            const products = await page.evaluate((maxPrice) => {
                // Try multiple possible selectors
                const items = document.querySelectorAll('.product-item, .o-product-list__item, [data-testid="product-list"] article, .m-product-listing__item');
                
                return Array.from(items).slice(0, 6).map(item => {
                    const name = item.querySelector('h2, h3, .product-name, .m-product-name')?.textContent?.trim();
                    const priceText = item.querySelector('.price, .m-price, [data-testid="price"]')?.textContent;
                    const image = item.querySelector('img')?.src;
                    const link = item.querySelector('a')?.href;
                    
                    const priceMatch = priceText?.match(/[\d,]+\.?\d*/);
                    const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : null;
                    
                    return { name, price, priceText, image, link, retailer: 'cos.com' };
                }).filter(p => !maxPrice || !p.price || p.price <= maxPrice);
            }, maxPrice);

            return products;
        } catch (error) {
            console.error('COS search error:', error);
            return [];
        } finally {
            await browser.close();
        }
    }
}

module.exports = COSScraper;
