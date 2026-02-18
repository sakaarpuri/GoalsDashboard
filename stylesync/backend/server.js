const express = require('express');
const cors = require('cors');
const path = require('path');
const RetailerScraper = require('./scraper');
const clipService = require('../ai/clip');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/dashboard', express.static(path.join(__dirname, '../../mission-control')));

// Initialize scraper
const scraper = new RetailerScraper();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'ShopperAgent API is running',
    timestamp: new Date().toISOString()
  });
});

// Search products across all retailers
app.post('/api/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`Searching for: ${query}`);
    const results = await scraper.scrapeAll(query, limit);
    
    // Flatten and add AI reasoning
    const allProducts = results.flatMap(r => 
      r.products.map(p => ({
        ...p,
        reason: generateReason(p, query),
        aiPick: Math.random() > 0.5
      }))
    );

    res.json({
      query,
      results: allProducts,
      retailers: results.map(r => r.retailer),
      total: allProducts.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});

// Search specific retailer
app.post('/api/search/:retailer', async (req, res) => {
  try {
    const { retailer } = req.params;
    const { query, limit = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const products = await scraper.scrapeRetailer(retailer, query, limit);
    
    res.json({
      retailer,
      query,
      products: products.map(p => ({
        ...p,
        reason: generateReason(p, query),
        aiPick: Math.random() > 0.5
      }))
    });
  } catch (error) {
    console.error('Retailer search error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});

// Get curated carts
app.get('/api/carts', (req, res) => {
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

  const carts = [
    {
      id: 'minimalist',
      name: 'The Minimalist',
      desc: 'Clean lines, neutral palette, timeless pieces for the modern wardrobe.',
      price: 485,
      items: 4,
      featured: true,
      retailers: ['COS', 'Everlane'],
      products: [
        { name: 'Cashmere Blend Coat', brand: 'COS', price: 320, image: placeholderImages[0], reason: 'Perfect foundation piece for any wardrobe', aiPick: true },
        { name: 'Merino Wool Sweater', brand: 'Everlane', price: 98, image: placeholderImages[1], reason: 'Minimal elegance with premium feel', aiPick: true },
        { name: 'Tailored Wool Trousers', brand: 'COS', price: 145, image: placeholderImages[2], reason: 'Clean silhouette that works everywhere', aiPick: false },
        { name: 'Leather Loafers', brand: 'Everlane', price: 168, image: placeholderImages[3], reason: 'Timeless footwear investment', aiPick: false }
      ]
    },
    {
      id: 'streetwear',
      name: 'Street Style',
      desc: 'Urban edge with designer drops, sneakers, and statement pieces.',
      price: 620,
      items: 5,
      featured: false,
      retailers: ['ASOS', 'Nike', 'COS', 'Everlane'],
      products: [
        { name: 'Oversized Hoodie', brand: 'ASOS', price: 65, image: placeholderImages[4], reason: 'Street essential with premium cotton', aiPick: true },
        { name: 'Cargo Pants', brand: 'ASOS', price: 85, image: placeholderImages[5], reason: 'Urban utility with modern fit', aiPick: true },
        { name: 'Designer Sneakers', brand: 'Nike', price: 180, image: placeholderImages[6], reason: 'Hype approved, everyday comfort', aiPick: true },
        { name: 'Crossbody Bag', brand: 'COS', price: 145, image: placeholderImages[7], reason: 'Functional style for city life', aiPick: false },
        { name: 'Beanie', brand: 'Everlane', price: 35, image: placeholderImages[0], reason: 'Street vibes, ethical materials', aiPick: false }
      ]
    },
    {
      id: 'executive',
      name: 'Executive Power',
      desc: 'Boardroom-ready looks that command attention and respect.',
      price: 890,
      items: 6,
      featured: false,
      retailers: ['COS', 'Everlane', 'ASOS'],
      products: [
        { name: 'Wool Blazer', brand: 'COS', price: 295, image: placeholderImages[1], reason: 'Power silhouette that elevates any look', aiPick: true },
        { name: 'Pleated Trousers', brand: 'Everlane', price: 128, image: placeholderImages[2], reason: 'Sharp lines for confidence', aiPick: true },
        { name: 'Silk Shirt', brand: 'COS', price: 145, image: placeholderImages[3], reason: 'Executive polish with comfort', aiPick: true },
        { name: 'Leather Belt', brand: 'Everlane', price: 68, image: placeholderImages[4], reason: 'Details matter in business', aiPick: false },
        { name: 'Oxford Shoes', brand: 'ASOS', price: 165, image: placeholderImages[5], reason: 'Classic authority, modern comfort', aiPick: false },
        { name: 'Briefcase', brand: 'COS', price: 245, image: placeholderImages[6], reason: 'Executive carry with style', aiPick: false }
      ]
    }
  ];

  res.json(carts);
});

// Generate AI reasoning
function generateReason(product, query) {
  const reasons = [
    `Matches your ${query} style profile`,
    'High quality materials at great price',
    'Trending this season',
    'Perfect fit for your preferences',
    'Sustainable choice',
    'Similar to items you liked',
    'Top rated by our AI',
    'Best value in category'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

// Process order
app.post('/api/order', (req, res) => {
  const { cart, email } = req.body;

  // Mock order processing
  const orderId = 'SA-' + Date.now();

  res.json({
    success: true,
    orderId,
    message: 'Order received! Our agents will process your purchase.',
    estimatedDelivery: '3-5 business days',
    confirmationEmail: email || 'user@example.com'
  });
});

// CLIP Image Analysis Endpoint
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data required' });
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    console.log('Analyzing image with CLIP...');
    const analysis = await clipService.analyzeImage(imageBuffer);

    res.json({
      success: true,
      category: analysis.category,
      styles: analysis.styleTags,
      colors: analysis.dominantColors,
      embedding: analysis.embedding
    });
  } catch (error) {
    console.error('CLIP analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

// CLIP Status Check
app.get('/api/clip-status', async (req, res) => {
  try {
    await clipService.init();
    res.json({ status: 'ready', model: 'Xenova/clip-vit-base-patch32' });
  } catch (error) {
    res.json({ status: 'loading', error: error.message });
  }
});

// Moonshot Title Generation (proxy)
app.post('/api/moonshot/title', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const base = process.env.MOONSHOT_URL;
    const key = process.env.MOONSHOT_KEY;
    if (!base || !key) return res.status(500).json({ error: 'Moonshot not configured' });

    // call Moonshot API
    const resp = await axios.post(base.replace(/\/$/, '') + '/title', { prompt }, {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    return res.json({ ok: true, result: resp.data });
  } catch (err) {
    console.error('Moonshot error:', err.message || err);
    return res.status(502).json({ error: 'Moonshot request failed', detail: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     SHOPPERAGENT API SERVER v1.0       ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                            ║
║  Status: Running                       ║
║  Scrapers: ASOS, COS, Everlane, etc.   ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;