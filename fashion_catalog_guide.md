# Fashion Product Catalog for Shopper Agent

## Overview
This catalog contains **100 products** from **5 popular Shopify fashion stores** (20 products each).

## Store Profiles

### 1. Kith (kith.com)
- **Style**: Streetwear / Luxury Fashion
- **Price Range**: €81 - €3,700
- **Categories**: Jackets, Shirts, T-Shirts, Hoodies, Pants, Shorts, Accessories, Shoes
- **Target**: Fashion-forward, premium streetwear enthusiasts
- **Product IDs**: Alphanumeric codes (e.g., `gm003762uc001`, `khm011179-260`)

### 2. Gymshark (gymshark.com)
- **Style**: Activewear / Fitness
- **Price Range**: $28 - $66
- **Categories**: Leggings, Sports Bras, T-Shirts, Tanks, Hoodies, Pants, Shorts
- **Target**: Gym-goers, fitness enthusiasts
- **Product IDs**: SEO-friendly slugs (e.g., `gymshark-everyday-seamless-washed-legging-red-ss26`)

### 3. Fashion Nova (fashionnova.com)
- **Style**: Fast Fashion / Trendy
- **Price Range**: $9 - $64
- **Categories**: Dresses, Jumpsuits, Jeans, Sets, Tops, Lingerie
- **Target**: Trend-focused, budget-conscious fashionistas
- **Product IDs**: Descriptive slugs (e.g., `kacey-deep-v-neck-capri-jumpsuit-olive`)

### 4. Allbirds (allbirds.com)
- **Style**: Sustainable Footwear / Apparel
- **Price Range**: $50 - $150
- **Categories**: Running Shoes, Casual Shoes, Flats, Sandals
- **Target**: Eco-conscious consumers, comfort seekers
- **Product IDs**: Product slugs (e.g., `womens-dasher-nz`, `mens-tree-runner-nz-spice`)

### 5. Everlane (everlane.com)
- **Style**: Sustainable Basics / Minimalist
- **Price Range**: €32 - €257
- **Categories**: Sweaters, Tops, Pants, Jeans, Dresses, Outerwear, Shoes
- **Target**: Minimalist, quality-focused, eco-conscious shoppers
- **Product IDs**: Descriptive slugs (e.g., `womens-cashmere-slim-crew-sweater-hunter-green`)

---

## How to Use for Product Matching

### Matching by Category
```javascript
// Example: Find all dresses
const dresses = catalog.stores.flatMap(store => 
  store.products.filter(p => p.category === "Dresses")
);
```

### Matching by Price Range
```javascript
// Example: Find products under $50
const affordable = catalog.stores.flatMap(store => 
  store.products.filter(p => {
    const price = parseFloat(p.price.replace(/[^0-9.]/g, ''));
    return price < 50;
  })
);
```

### Matching by Style Preferences
- **Athleisure**: Gymshark leggings, Allbirds runners
- **Minimalist**: Everlane basics, Everlane cashmere
- **Streetwear**: Kith jackets, Kith graphic tees
- **Trendy/Fast Fashion**: Fashion Nova dresses, sets
- **Sustainable**: Allbirds shoes, Everlane organic cotton

### Matching by Occasion
- **Workout**: Gymshark seamless leggings, sports bras
- **Casual**: Everlane boxy tees, Allbirds casual shoes
- **Night Out**: Fashion Nova dresses, Kith premium jackets
- **Office**: Everlane silk shirts, Everlane trousers
- **Weekend**: Kith hoodies, Allbirds comfort shoes

---

## Product ID Formats by Store

| Store | ID Format | Example |
|-------|-----------|---------|
| Kith | Alphanumeric + hyphens | `gm003762uc001` |
| Gymshark | Descriptive slug | `gymshark-everyday-seamless-washed-legging-red-ss26` |
| Fashion Nova | Descriptive slug | `kacey-deep-v-neck-capri-jumpsuit-olive` |
| Allbirds | Short slug | `womens-dasher-nz` |
| Everlane | Full descriptive slug | `womens-cashmere-slim-crew-sweater-hunter-green` |

---

## API Integration Notes

### Shopify Product URLs
All Shopify products follow this URL pattern:
```
https://{store-domain}/products/{product-id}
```

### Direct Product Links
- Kith: `https://kith.com/products/{product-id}`
- Gymshark: `https://www.gymshark.com/products/{product-id}`
- Fashion Nova: `https://www.fashionnova.com/products/{product-id}`
- Allbirds: `https://www.allbirds.com/products/{product-id}`
- Everlane: `https://www.everlane.com/products/{product-id}`

### Adding to Cart (Shopify)
```
POST /cart/add.js
{
  "items": [{
    "id": {variant_id},
    "quantity": 1
  }]
}
```

Note: Each product in this catalog represents the parent product. To add to cart, you'll need the specific variant ID (size/color combination).

---

## Metadata for AI Matching

### Price Tiers
- **Budget**: Under $50 (Fashion Nova, Gymshark basics)
- **Mid-Range**: $50-$150 (Allbirds, Everlane, Gymshark premium)
- **Premium**: $150+ (Kith, Everlane cashmere)
- **Luxury**: $500+ (Kith Armani collaborations)

### Style Tags
- **Minimalist**: Everlane, Allbirds
- **Athletic**: Gymshark, Allbirds runners
- **Streetwear**: Kith
- **Trendy**: Fashion Nova
- **Sustainable**: Allbirds, Everlane
- **Luxury**: Kith premium items

### Season Tags
- **Spring/Summer**: Kith Spring collections, Everlane lightweight
- **Fall/Winter**: Kith outerwear, Everlane cashmere, Allbirds cozy
- **All Season**: Gymshark, Fashion Nova basics

---

## Sample User Preference Matching

### Example 1: "I need workout clothes"
```javascript
const workoutProducts = catalog.stores
  .filter(s => s.store_id === 'gymshark' || s.store_id === 'allbirds')
  .flatMap(s => s.products)
  .filter(p => ['Leggings', 'Sports Bras', 'T-Shirts', 'Running Shoes'].includes(p.category));
```

### Example 2: "I want sustainable fashion under $100"
```javascript
const sustainableAffordable = catalog.stores
  .filter(s => s.store_id === 'allbirds' || s.store_id === 'everlane')
  .flatMap(s => s.products)
  .filter(p => parseFloat(p.price.replace(/[^0-9.]/g, '')) < 100);
```

### Example 3: "I need a dress for date night"
```javascript
const dateNightDresses = catalog.stores
  .flatMap(s => s.products)
  .filter(p => p.category === 'Dresses')
  .sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
```

---

## File Location
- **Catalog**: `/data/.openclaw/workspace/fashion_catalog.json`
- **This Guide**: `/data/.openclaw/workspace/fashion_catalog_guide.md`

---

## Next Steps for Shopper Agent

1. **Load Catalog**: Parse the JSON file on startup
2. **User Profiling**: Track user preferences (style, budget, size)
3. **Matching Algorithm**: Score products based on user preferences
4. **Recommendation Engine**: Suggest similar items across stores
5. **Cart Integration**: Generate add-to-cart links for matched products
6. **Price Tracking**: Monitor price changes for favorited items

## API Keys Needed (for full functionality)
- Shopify Storefront API tokens for each store (for real-time inventory/pricing)
- Or use Shopify AJAX API for cart operations (no auth required for public stores)
