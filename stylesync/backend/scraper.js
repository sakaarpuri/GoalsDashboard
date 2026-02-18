const axios = require('axios');
const cheerio = require('cheerio');

class RetailerScraper {
  constructor() {
    this.retailers = {
      asos: {
        name: 'ASOS',
        baseUrl: 'https://www.asos.com',
        searchUrl: (query) => `https://www.asos.com/search/?q=${encodeURIComponent(query)}`,
      },
      cos: {
        name: 'COS',
        baseUrl: 'https://www.cos.com',
        searchUrl: (query) => `https://www.cos.com/en_usd/search-results.html?q=${encodeURIComponent(query)}`,
      },
      everlane: {
        name: 'Everlane',
        baseUrl: 'https://www.everlane.com',
        searchUrl: (query) => `https://www.everlane.com/search?q=${encodeURIComponent(query)}`,
      },
      uniqlo: {
        name: 'Uniqlo',
        baseUrl: 'https://www.uniqlo.com',
        searchUrl: (query) => `https://www.uniqlo.com/us/en/search/?q=${encodeURIComponent(query)}`,
      },
      nike: {
        name: 'Nike',
        baseUrl: 'https://www.nike.com',
        searchUrl: (query) => `https://www.nike.com/w?q=${encodeURIComponent(query)}`,
      }
    };
  }

  async scrapeAll(query, limit = 5) {
    const results = [];
    
    for (const [key, retailer] of Object.entries(this.retailers)) {
      try {
        console.log(`Scraping ${retailer.name}...`);
        const products = await this.scrapeRetailer(key, query, limit);
        results.push({
          retailer: retailer.name,
          products: products
        });
      } catch (error) {
        console.error(`Error scraping ${retailer.name}:`, error.message);
        results.push({
          retailer: retailer.name,
          products: [],
          error: error.message
        });
      }
    }
    
    return results;
  }

  async scrapeRetailer(retailerKey, query, limit = 5) {
    const retailer = this.retailers[retailerKey];
    const url = retailer.searchUrl(query);
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const products = [];

      // Generic product selectors (will vary by site)
      const selectors = this.getSelectors(retailerKey);

      $(selectors.product).each((i, el) => {
        if (i >= limit) return false;

        // Extract image with multiple fallbacks
        let imageUrl = '';
        const $img = $(el).find(selectors.image).first();
        if ($img.length) {
          imageUrl = $img.attr('src') ||
                     $img.attr('data-src') ||
                     $img.attr('data-original') ||
                     $img.attr('data-lazy-src') ||
                     $img.attr('data-srcset')?.split(' ')[0] ||
                     $img.attr('srcset')?.split(' ')[0] || '';

          // Handle relative URLs
          if (imageUrl && imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (imageUrl && imageUrl.startsWith('/')) {
            imageUrl = retailer.baseUrl + imageUrl;
          }
        }

        // Extract product link
        let productLink = $(el).find(selectors.link).first().attr('href') || '';
        if (productLink && !productLink.startsWith('http')) {
          productLink = retailer.baseUrl + (productLink.startsWith('/') ? '' : '/') + productLink;
        }

        const product = {
          id: `${retailerKey}-${i}`,
          name: $(el).find(selectors.name).first().text().trim() || 'Product Name',
          brand: retailer.name,
          price: this.extractPrice($(el).find(selectors.price).first().text()),
          originalPrice: this.extractPrice($(el).find(selectors.originalPrice).first().text()),
          image: imageUrl,
          link: productLink,
          retailer: retailer.name,
          inStock: true
        };

        if (product.name && product.name !== 'Product Name') {
          products.push(product);
        }
      });

      return products;
    } catch (error) {
      console.error(`Scraping error for ${retailerKey}:`, error.message);
      return this.getMockProducts(retailer.name, query, limit);
    }
  }

  getSelectors(retailerKey) {
    const selectors = {
      asos: {
        product: '[data-auto-id="productList"] article, .product-item, [class*="productTile"]',
        name: 'h2, .product-name, [class*="productDescription"]',
        price: '[data-auto-id="productPrice"], .current-price, [class*="price"]',
        originalPrice: '.original-price, [class*="wasPrice"]',
        image: 'img',
        link: 'a'
      },
      cos: {
        product: '.product-item, [class*="product-tile"], article',
        name: '.product-name, h2, [class*="title"]',
        price: '.price, [class*="price"]',
        originalPrice: '.was-price, [class*="was"]',
        image: 'img',
        link: 'a'
      },
      everlane: {
        product: '.product-card, [class*="product-item"]',
        name: '.product-name, h2, [class*="title"]',
        price: '.price, [class*="price"]',
        originalPrice: '.compare-price',
        image: 'img',
        link: 'a'
      },
      uniqlo: {
        product: '.product-tile, [class*="product-item"], article',
        name: '.name, h2, [class*="title"]',
        price: '.price, [class*="price"]',
        originalPrice: '.was-price',
        image: 'img',
        link: 'a'
      },
      nike: {
        product: '.product-card, [class*="product-grid__item"]',
        name: '.product-name, h2, [class*="title"]',
        price: '.price, [class*="price"]',
        originalPrice: '.was-price',
        image: 'img',
        link: 'a'
      }
    };

    return selectors[retailerKey] || selectors.asos;
  }

  extractPrice(priceText) {
    if (!priceText) return null;
    const match = priceText.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(',', '')) : null;
  }

  getMockProducts(retailer, query, limit) {
    const mockProducts = [];
    const categories = ['Coat', 'Jacket', 'Sweater', 'Shirt', 'Pants', 'Shoes', 'Dress', 'Bag'];
    const placeholderImages = [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551028919-ac76c9028d1e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
    ];

    for (let i = 0; i < limit; i++) {
      const category = categories[i % categories.length];
      mockProducts.push({
        id: `${retailer.toLowerCase()}-${i}`,
        name: `${query.split(' ')[0]} ${category}`,
        brand: retailer,
        price: Math.floor(Math.random() * 200) + 50,
        originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 300) + 100 : null,
        image: placeholderImages[i % placeholderImages.length],
        link: '#',
        retailer: retailer,
        inStock: true,
        isMock: true
      });
    }

    return mockProducts;
  }
}

module.exports = RetailerScraper;