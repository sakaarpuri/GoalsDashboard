/**
 * CLIP Integration for StyleSync
 * Uses @xenova/transformers for zero-shot image classification and embeddings
 * CLIP runs locally - no API keys required
 */

const { pipeline, env } = require('@xenova/transformers');
const fs = require('fs');
const path = require('path');

// Configure transformers environment
env.cacheDir = path.join(__dirname, '.cache');
env.allowLocalModels = false;
env.allowRemoteModels = true;

class CLIPService {
    constructor() {
        this.imageEmbedder = null;
        this.classifier = null;
        this.isLoading = false;
        this.modelName = 'Xenova/clip-vit-base-patch32';
        
        // Fashion categories for classification
        this.fashionCategories = [
            't-shirt', 'shirt', 'blouse', 'sweater', 'hoodie', 'jacket', 'coat',
            'dress', 'skirt', 'pants', 'jeans', 'shorts', 'leggings',
            'sneakers', 'boots', 'sandals', 'heels', 'flats',
            'bag', 'backpack', 'handbag', 'wallet',
            'hat', 'scarf', 'gloves', 'sunglasses', 'jewelry', 'watch',
            'belt', 'tie', 'socks'
        ];
        
        // Style tags for analysis
        this.styleLabels = [
            'casual', 'formal', 'business casual', 'streetwear', 'minimalist',
            'vintage', 'bohemian', 'preppy', 'athleisure', 'elegant',
            'edgy', 'romantic', 'classic', 'trendy', 'sporty',
            'luxury', 'sustainable', 'oversized', 'fitted', 'layered'
        ];
        
        // Color descriptors
        this.colorLabels = [
            'black', 'white', 'gray', 'navy', 'blue', 'light blue',
            'red', 'burgundy', 'pink', 'blush', 'coral',
            'green', 'olive', 'sage', 'forest green',
            'yellow', 'mustard', 'gold', 'orange', 'peach',
            'purple', 'lavender', 'mauve', 'brown', 'tan', 'beige', 'cream',
            'silver', 'metallic', 'multicolor', 'patterned', 'striped', 'checkered'
        ];
    }

    /**
     * Initialize CLIP models (lazy loading)
     */
    async init() {
        if (this.imageEmbedder && this.classifier) {
            return true;
        }
        
        if (this.isLoading) {
            // Wait for existing load to complete
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return true;
        }
        
        this.isLoading = true;
        
        try {
            console.log('Loading CLIP model...');
            
            // Initialize image feature extractor for embeddings
            this.imageEmbedder = await pipeline(
                'image-feature-extraction',
                this.modelName,
                { quantized: true } // Use quantized model for faster loading
            );
            
            // Initialize zero-shot classifier
            this.classifier = await pipeline(
                'zero-shot-image-classification',
                this.modelName,
                { quantized: true }
            );
            
            console.log('CLIP model loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load CLIP model:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Extract image embedding from file path, URL, or buffer
     * @param {string|Buffer} imageSource - Image file path, URL, or buffer
     * @returns {Promise<Float32Array>} - Image embedding vector
     */
    async extractEmbedding(imageSource) {
        await this.init();
        
        try {
            const output = await this.imageEmbedder(imageSource, {
                pooling: 'mean',
                normalize: true
            });
            
            // Convert to regular array
            return Array.from(output.data);
        } catch (error) {
            console.error('Embedding extraction failed:', error);
            throw error;
        }
    }

    /**
     * Classify image into fashion categories
     * @param {string|Buffer} imageSource - Image file path, URL, or buffer
     * @returns {Promise<Array>} - Top categories with scores
     */
    async classifyCategory(imageSource) {
        await this.init();
        
        try {
            const results = await this.classifier(imageSource, this.fashionCategories, {
                top_k: 3
            });
            
            return results.map(r => ({
                label: r.label,
                score: Math.round(r.score * 100)
            }));
        } catch (error) {
            console.error('Category classification failed:', error);
            throw error;
        }
    }

    /**
     * Detect style tags for an image
     * @param {string|Buffer} imageSource - Image file path, URL, or buffer
     * @returns {Promise<Array>} - Style tags with scores
     */
    async detectStyles(imageSource) {
        await this.init();
        
        try {
            const results = await this.classifier(imageSource, this.styleLabels, {
                top_k: 5
            });
            
            return results.map(r => ({
                label: r.label,
                score: Math.round(r.score * 100)
            }));
        } catch (error) {
            console.error('Style detection failed:', error);
            throw error;
        }
    }

    /**
     * Detect dominant colors in an image
     * @param {string|Buffer} imageSource - Image file path, URL, or buffer
     * @returns {Promise<Array>} - Color predictions with scores
     */
    async detectColors(imageSource) {
        await this.init();
        
        try {
            const results = await this.classifier(imageSource, this.colorLabels, {
                top_k: 3
            });
            
            return results.map(r => ({
                label: r.label,
                score: Math.round(r.score * 100)
            }));
        } catch (error) {
            console.error('Color detection failed:', error);
            throw error;
        }
    }

    /**
     * Calculate cosine similarity between two embeddings
     * @param {Array} embedding1 - First embedding vector
     * @param {Array} embedding2 - Second embedding vector
     * @returns {number} - Similarity score (0-100)
     */
    calculateSimilarity(embedding1, embedding2) {
        if (embedding1.length !== embedding2.length) {
            throw new Error('Embeddings must have the same dimensions');
        }
        
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        
        for (let i = 0; i < embedding1.length; i++) {
            dotProduct += embedding1[i] * embedding2[i];
            norm1 += embedding1[i] * embedding1[i];
            norm2 += embedding2[i] * embedding2[i];
        }
        
        norm1 = Math.sqrt(norm1);
        norm2 = Math.sqrt(norm2);
        
        if (norm1 === 0 || norm2 === 0) {
            return 0;
        }
        
        // Cosine similarity ranges from -1 to 1, normalize to 0-100
        const similarity = dotProduct / (norm1 * norm2);
        return Math.round(((similarity + 1) / 2) * 100);
    }

    /**
     * Compare two images and return similarity score
     * @param {string|Buffer} image1 - First image
     * @param {string|Buffer} image2 - Second image
     * @returns {Promise<Object>} - Similarity result
     */
    async compareImages(image1, image2) {
        const [embedding1, embedding2] = await Promise.all([
            this.extractEmbedding(image1),
            this.extractEmbedding(image2)
        ]);
        
        const score = this.calculateSimilarity(embedding1, embedding2);
        
        return {
            similarity: score,
            match: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
            embedding1,
            embedding2
        };
    }

    /**
     * Full image analysis - category, styles, and colors
     * @param {string|Buffer} imageSource - Image file path, URL, or buffer
     * @returns {Promise<Object>} - Complete analysis
     */
    async analyzeImage(imageSource) {
        await this.init();
        
        const [embedding, categories, styles, colors] = await Promise.all([
            this.extractEmbedding(imageSource),
            this.classifyCategory(imageSource),
            this.detectStyles(imageSource),
            this.detectColors(imageSource)
        ]);
        
        return {
            embedding,
            category: categories[0],
            categories,
            styleTags: styles.filter(s => s.score >= 30),
            dominantColors: colors,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Find similar products from a database of products with embeddings
     * @param {Array} queryEmbedding - The embedding to search for
     * @param {Array} products - Array of products with embeddings
     * @param {number} topK - Number of results to return (default: 6)
     * @returns {Array} - Top matching products with similarity scores
     */
    findSimilarProducts(queryEmbedding, products, topK = 6) {
        const scoredProducts = products.map(product => {
            const score = this.calculateSimilarity(
                queryEmbedding,
                product.embedding
            );
            
            return {
                ...product,
                similarity: score,
                match: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'
            };
        });
        
        // Sort by similarity (highest first)
        scoredProducts.sort((a, b) => b.similarity - a.similarity);
        
        return scoredProducts.slice(0, topK);
    }
}

// Export singleton instance
const clipService = new CLIPService();
module.exports = clipService;