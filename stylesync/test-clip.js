/**
 * CLIP Integration Test Script
 * Tests the CLIP service and API endpoints
 */

const clipService = require('./ai/clip');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001/api';

// Test image URLs (public fashion images)
const testImages = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', // t-shirt
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', // jacket
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', // dress
];

async function testCLIPService() {
    console.log('=== Testing CLIP Service ===\n');
    
    try {
        // Test 1: Model initialization
        console.log('1. Testing model initialization...');
        await clipService.init();
        console.log('✓ CLIP model loaded successfully\n');
        
        // Test 2: Image analysis
        console.log('2. Testing image analysis...');
        const analysis = await clipService.analyzeImage(testImages[0]);
        console.log('✓ Analysis complete:');
        console.log('   Category:', analysis.category);
        console.log('   All Categories:', analysis.categories.map(c => `${c.label} (${c.score}%)`).join(', '));
        console.log('   Style Tags:', analysis.styleTags.map(s => `${s.label} (${s.score}%)`).join(', '));
        console.log('   Colors:', analysis.dominantColors.map(c => `${c.label} (${c.score}%)`).join(', '));
        console.log('   Embedding size:', analysis.embedding.length, '\n');
        
        // Test 3: Image comparison
        console.log('3. Testing image comparison...');
        const comparison = await clipService.compareImages(testImages[0], testImages[1]);
        console.log('✓ Comparison complete:');
        console.log('   Similarity:', comparison.similarity + '%');
        console.log('   Match level:', comparison.match, '\n');
        
        // Test 4: Similarity search
        console.log('4. Testing similarity search...');
        const mockProducts = [
            { id: '1', name: 'White T-Shirt', embedding: analysis.embedding },
            { id: '2', name: 'Blue Jeans', embedding: await clipService.extractEmbedding(testImages[1]) },
            { id: '3', name: 'Summer Dress', embedding: await clipService.extractEmbedding(testImages[2]) },
        ];
        
        const similar = clipService.findSimilarProducts(analysis.embedding, mockProducts, 3);
        console.log('✓ Similarity search complete:');
        similar.forEach(p => {
            console.log(`   ${p.name}: ${p.similarity}% match (${p.match})`);
        });
        console.log();
        
        return true;
    } catch (error) {
        console.error('✗ CLIP service test failed:', error.message);
        console.error(error.stack);
        return false;
    }
}

async function testAPIEndpoints() {
    console.log('=== Testing API Endpoints ===\n');
    
    // Wait for server to be ready
    console.log('Checking server status...');
    try {
        const health = await axios.get(`${API_BASE}/health`);
        console.log('✓ Server is running\n');
    } catch (error) {
        console.error('✗ Server not available. Please start it with: npm start');
        return false;
    }
    
    try {
        // Test 1: CLIP status
        console.log('1. Testing CLIP status endpoint...');
        const status = await axios.get(`${API_BASE}/clip/status`);
        console.log('✓ Status:', status.data.status);
        console.log('   Products indexed:', status.data.productsIndexed, '\n');
        
        // Test 2: Analyze image via URL
        console.log('2. Testing /analyze-image with URL...');
        const analysis = await axios.post(`${API_BASE}/analyze-image`, {
            imageUrl: testImages[0]
        });
        console.log('✓ Analysis complete:');
        console.log('   Category:', analysis.data.analysis.category);
        console.log('   Styles:', analysis.data.analysis.styleTags.map(s => s.label).join(', '));
        console.log('   Colors:', analysis.data.analysis.dominantColors.map(c => c.label).join(', '), '\n');
        
        // Save embedding for later tests
        const testEmbedding = analysis.data.analysis.embedding;
        
        // Test 3: Index products
        console.log('3. Testing /products/index...');
        const products = [
            {
                id: 'prod-1',
                name: 'Classic White Tee',
                brand: 'Everlane',
                price: 35,
                imageUrl: testImages[0]
            },
            {
                id: 'prod-2',
                name: 'Leather Jacket',
                brand: 'ASOS',
                price: 120,
                imageUrl: testImages[1]
            },
            {
                id: 'prod-3',
                name: 'Floral Dress',
                brand: 'COS',
                price: 150,
                imageUrl: testImages[2]
            }
        ];
        
        for (const product of products) {
            const result = await axios.post(`${API_BASE}/products/index`, product);
            console.log(`   ✓ Indexed: ${result.data.product.name} (${result.data.product.category})`);
        }
        console.log();
        
        // Test 4: Find similar products
        console.log('4. Testing /find-similar...');
        const similar = await axios.post(`${API_BASE}/find-similar`, {
            embedding: testEmbedding,
            topK: 3
        });
        console.log('✓ Similar products found:', similar.data.count);
        similar.data.matches.forEach(m => {
            console.log(`   ${m.name}: ${m.similarity}% match`);
        });
        console.log();
        
        // Test 5: Compare images
        console.log('5. Testing /compare-images...');
        const comparison = await axios.post(`${API_BASE}/compare-images`, {
            imageUrl1: testImages[0],
            imageUrl2: testImages[0] // Same image should be 100%
        });
        console.log('✓ Comparison complete:');
        console.log('   Similarity:', comparison.data.similarity + '%');
        console.log('   Match:', comparison.data.match, '\n');
        
        // Test 6: List products
        console.log('6. Testing /products list...');
        const list = await axios.get(`${API_BASE}/products`);
        console.log('✓ Products in database:', list.data.count);
        list.data.products.forEach(p => {
            console.log(`   - ${p.name} (${p.brand})`);
        });
        console.log();
        
        return true;
    } catch (error) {
        console.error('✗ API test failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        return false;
    }
}

async function runTests() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         StyleSync CLIP Integration Tests               ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    const serviceOk = await testCLIPService();
    
    if (serviceOk) {
        await testAPIEndpoints();
    }
    
    console.log('=== Test Summary ===');
    console.log('All tests completed!');
    console.log('\nNote: First run downloads CLIP model (~300MB) which may take a few minutes.');
    console.log('The model is cached for subsequent runs.\n');
    
    process.exit(0);
}

runTests().catch(err => {
    console.error('Test runner failed:', err);
    process.exit(1);
});