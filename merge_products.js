const fs = require('fs');

// Load existing catalog
const existingCatalog = JSON.parse(fs.readFileSync('fashion_catalog.json', 'utf8'));
const newProducts = JSON.parse(fs.readFileSync('/data/.openclaw/media/inbound/file_39---1bb8f7f8-ea6a-4a22-b2c1-424e727c86e3.json', 'utf8'));

// Group new products by brand
const brandGroups = {};
newProducts.forEach(p => {
  const brand = p.brand;
  if (!brandGroups[brand]) brandGroups[brand] = [];
  brandGroups[brand].push({
    id: p.image_url.split('/').pop().split('?')[0].replace(/\.(jpg|jpeg|png|webp)$/i, '').substring(0, 30),
    name: p.product_name,
    price: p.price,
    category: p.category,
    material: p.material || undefined,
    url: p.image_url
  });
});

// Store definitions with URLs
const storeDefs = {
  'Outdoor Voices': { url: 'https://www.outdoorvoices.com', category: 'Activewear / Athleisure' },
  'Chubbies': { url: 'https://www.chubbies.com', category: 'Men\'s Shorts / Casual' },
  'TomboyX': { url: 'https://www.tomboyx.com', category: 'Gender-neutral Underwear / Swim' },
  'Reformation': { url: 'https://www.thereformation.com', category: 'Sustainable Fashion' },
  'Alo Yoga': { url: 'https://www.aloyoga.com', category: 'Yoga / Activewear' },
  'Lululemon': { url: 'https://www.lululemon.com', category: 'Athletic / Athleisure' }
};

// Create new store entries
const newStores = Object.entries(brandGroups).map(([brand, products]) => ({
  store_id: brand.toLowerCase().replace(/\s+/g, '-'),
  store_name: brand,
  store_url: storeDefs[brand]?.url || '',
  category: storeDefs[brand]?.category || 'Fashion',
  products: products
}));

// Merge
existingCatalog.stores.push(...newStores);
existingCatalog.catalog_metadata.stores = existingCatalog.stores.length;
existingCatalog.catalog_metadata.total_products = existingCatalog.stores.reduce((sum, s) => sum + s.products.length, 0);
existingCatalog.catalog_metadata.updated_at = new Date().toISOString().split('T')[0];
existingCatalog.catalog_metadata.stores_list = existingCatalog.stores.map(s => s.store_name);

// Save
fs.writeFileSync('fashion_catalog.json', JSON.stringify(existingCatalog, null, 2));
console.log(`✅ Added ${newProducts.length} products from ${newStores.length} stores`);
console.log(`📊 Total: ${existingCatalog.catalog_metadata.total_products} products from ${existingCatalog.catalog_metadata.stores} stores`);
