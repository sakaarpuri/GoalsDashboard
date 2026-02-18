/**
 * AI Routes for StyleSync
 * CLIP-powered image analysis and similarity search
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const clipService = require('../../ai/clip');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
        }
    }
});

// In-memory product database (replace with real DB in production)
let productDatabase = [];

/**
 * POST /api/analyze-image
 * Analyze an image and return: dominant colors, style tags, category
 * Accepts: file upload or image URL
 */
router.post('/analyze-image', upload.single('image'), async (req, res) => {
    try {
        let imageSource;
        
        // Handle file upload
        if (req.file) {
            imageSource = req.file.path;
        }
        // Handle URL
        else if (req.body.imageUrl) {
            imageSource = req.body.imageUrl;
        }
        else {
            return res.status(400).json({
                success: false,
                error: 'Please provide an image file or imageUrl'
            });
        }
        
        console.log('Analyzing image:', imageSource);
        
        // Perform CLIP analysis
        const analysis = await clipService.analyzeImage(imageSource);
        
        // Clean up uploaded file
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.json({
            success: true,
            analysis: {
                category: analysis.category,
                categories: analysis.categories,
                dominantColors: analysis.dominantColors,
                styleTags: analysis.styleTags,
                embedding: analysis.embedding // Include embedding for similarity search
            }
        });
        
    } catch (error) {
        console.error('Image analysis error:', error);
        
        // Clean up on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to analyze image',
            message: error.message
        });
    }
});

/**
 * POST /api/find-similar
 * Find similar products based on image embedding
 * Input: image embedding or product ID
 * Returns: top 6 matches with similarity scores
 */
router.post('/find-similar', async (req, res) => {
    try {
        const { embedding, productId, imageUrl, topK = 6 } = req.body;
        
        let queryEmbedding;
        
        // Get embedding from various sources
        if (embedding) {
            queryEmbedding = embedding;
        }
        else if (productId) {
            const product = productDatabase.find(p => p.id === productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            queryEmbedding = product.embedding;
        }
        else if (imageUrl) {
            const analysis = await clipService.analyzeImage(imageUrl);
            queryEmbedding = analysis.embedding;
        }
        else {
            return res.status(400).json({
                success: false,
                error: 'Please provide embedding, productId, or imageUrl'
            });
        }
        
        // Search for similar products
        const matches = clipService.findSimilarProducts(queryEmbedding, productDatabase, topK);
        
        res.json({
            success: true,
            count: matches.length,
            matches: matches.map(m => ({
                id: m.id,
                name: m.name,
                brand: m.brand,
                price: m.price,
                category: m.category,
                image: m.image,
                similarity: m.similarity,
                match: m.match
            }))
        });
        
    } catch (error) {
        console.error('Find similar error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to find similar products',
            message: error.message
        });
    }
});

/**
 * POST /api/compare-images
 * Compare two images and return similarity score
 */
router.post('/compare-images', upload.array('images', 2), async (req, res) => {
    try {
        let image1, image2;
        
        // Handle file uploads
        if (req.files && req.files.length === 2) {
            image1 = req.files[0].path;
            image2 = req.files[1].path;
        }
        // Handle URLs
        else if (req.body.imageUrl1 && req.body.imageUrl2) {
            image1 = req.body.imageUrl1;
            image2 = req.body.imageUrl2;
        }
        else {
            return res.status(400).json({
                success: false,
                error: 'Please provide 2 images (files or URLs)'
            });
        }
        
        const result = await clipService.compareImages(image1, image2);
        
        // Clean up uploaded files
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        
        res.json({
            success: true,
            similarity: result.similarity,
            match: result.match
        });
        
    } catch (error) {
        console.error('Compare images error:', error);
        
        // Clean up on error
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to compare images',
            message: error.message
        });
    }
});

/**
 * POST /api/products/index
 * Add a product to the searchable database
 */
router.post('/products/index', async (req, res) => {
    try {
        const { id, name, brand, price, category, imageUrl, retailer } = req.body;
        
        if (!id || !name || !imageUrl) {
            return res.status(400).json({
                success: false,
                error: 'id, name, and imageUrl are required'
            });
        }
        
        // Extract embedding for the product image
        console.log('Indexing product:', name);
        const analysis = await clipService.analyzeImage(imageUrl);
        
        const product = {
            id,
            name,
            brand: brand || 'Unknown',
            price: price || 0,
            category: category || analysis.category.label,
            image: imageUrl,
            retailer: retailer || '',
            embedding: analysis.embedding,
            indexedAt: new Date().toISOString()
        };
        
        // Add or update product in database
        const existingIndex = productDatabase.findIndex(p => p.id === id);
        if (existingIndex >= 0) {
            productDatabase[existingIndex] = product;
        } else {
            productDatabase.push(product);
        }
        
        res.json({
            success: true,
            product: {
                id: product.id,
                name: product.name,
                category: product.category,
                embeddingSize: product.embedding.length
            }
        });
        
    } catch (error) {
        console.error('Product indexing error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to index product',
            message: error.message
        });
    }
});

/**
 * GET /api/products
 * List all indexed products
 */
router.get('/products', (req, res) => {
    res.json({
        success: true,
        count: productDatabase.length,
        products: productDatabase.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            price: p.price,
            category: p.category,
            image: p.image,
            retailer: p.retailer
        }))
    });
});

/**
 * DELETE /api/products/:id
 * Remove a product from the database
 */
router.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const index = productDatabase.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Product not found'
        });
    }
    
    productDatabase.splice(index, 1);
    
    res.json({
        success: true,
        message: 'Product removed'
    });
});

/**
 * GET /api/clip/status
 * Check CLIP model status
 */
router.get('/clip/status', (req, res) => {
    res.json({
        success: true,
        status: clipService.imageEmbedder ? 'loaded' : 'not_loaded',
        model: clipService.modelName,
        productsIndexed: productDatabase.length
    });
});

module.exports = router;