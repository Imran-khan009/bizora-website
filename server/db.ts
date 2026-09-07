import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'bizora_db.json');

// Interface for DB state
export interface DatabaseState {
  users: any[];
  categories: any[];
  products: any[];
  orders: any[];
  contacts: any[];
  settings: any;
  media: any[];
}

export const defaultContent = {
  hero: {
    eyebrow: "The Atelier Collection • Summer 2026",
    heading: "The Pinnacle of Premium Craft.",
    description: "Discover our curated selection of high-performance timepieces, pure extrait parfums, handcrafted leather footwear, and tailored menswear. Engineered with uncompromising standards and nationwide Cash on Delivery across Pakistan.",
    buttonText: "Shop Now",
    buttonLink: "shop",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "about",
    heroImage: "/uploads/regenerated_image_1788787466475.png",
    featuredBadgeTitle: "Featured Timepiece",
    featuredBadgeName: "BIZORA Chrono Master Automatic",
    featuredBadgePrice: "Rs. 29,900"
  },
  about: {
    heading: "BIZORA Atelier & Modern Distinction",
    description: "Founded on the philosophy that true luxury resides in meticulous attention to detail, BIZORA brings together heritage artisan shoemaking, master horology, and exotic botanical perfumery for discerning clients.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
  },
  promo: {
    badge: "Exclusive Privilege",
    heading: "The Sovereign Collection.",
    description: "Order handcrafted royal footwear, rare pure agarwood perfumes, or executive chronographs today and receive complimentary express shipping plus an extra 10% off with invitation code.",
    code: "BIZORA10",
    buttonText: "Apply In Bag & Shop",
    buttonLink: "shop",
    bannerImage: "/uploads/regenerated_image_1788787466475.png"
  },
  whyChooseUs: [
    { id: "1", title: "Quality Products", description: "100% genuine full-grain leather, Swiss-standard movements, and certified natural fragrance oils.", icon: "Award", color: "amber" },
    { id: "2", title: "Trusted Service", description: "Transparent order tracking, authenticated guarantees, and direct communication.", icon: "ShieldCheck", color: "indigo" },
    { id: "3", title: "Fast Delivery", description: "Express 2-4 day delivery across Lahore, Karachi, Islamabad, and all Pakistan regions.", icon: "Truck", color: "emerald" },
    { id: "4", title: "Secure Shopping", description: "Pay upon safe delivery with Cash on Delivery or verified direct banking transfer.", icon: "CheckCircle", color: "purple" },
    { id: "5", title: "24/7 Concierge", description: "Dedicated styling consultations, sizing guidance, and post-purchase care.", icon: "Clock", color: "rose" }
  ]
};

// Initial default settings
const defaultSettings = {
  siteName: "BIZORA",
  tagline: "Modern Business & Luxury E-Commerce",
  logoText: "BIZORA",
  logoUrl: "",
  content: defaultContent,
  currency: "PKR",
  currencySymbol: "Rs.",
  deliveryFee: 250,
  freeDeliveryThreshold: 3500,
  contactEmail: "support@bizora.com",
  contactPhone: "+92 (300) 123-4567",
  address: "BIZORA Flagship Atelier, MM Alam Road, Gulberg III, Lahore, Pakistan",
  announcementText: "✨ Flash Offer: Enjoy FREE express delivery on orders over Rs. 3,500 across Pakistan! Use code BIZORA10 for 10% off.",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  twitterUrl: "https://twitter.com",
  whatsappNumber: "+923001234567"
};

export const seedMedia = [
  {
    id: "med_hero_watch",
    name: "Hero Chrono Master Automatic",
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
    category: "banners",
    mimeType: "image/jpeg",
    size: 245000,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "med_shoe_oxford",
    name: "Royal Oxford Calfskin",
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
    category: "products",
    mimeType: "image/jpeg",
    size: 320000,
    createdAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "med_perfume_oud",
    name: "Oud Royale Extrait de Parfum",
    url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
    category: "products",
    mimeType: "image/jpeg",
    size: 198000,
    createdAt: "2026-01-03T00:00:00.000Z"
  },
  {
    id: "med_cat_watches",
    name: "Category Watches Cover",
    url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop",
    category: "categories",
    mimeType: "image/jpeg",
    size: 184000,
    createdAt: "2026-01-04T00:00:00.000Z"
  },
  {
    id: "med_about_atelier",
    name: "BIZORA Workshop Heritage",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
    category: "banners",
    mimeType: "image/jpeg",
    size: 412000,
    createdAt: "2026-01-05T00:00:00.000Z"
  }
];

// Seed Categories
const seedCategories = [
  {
    id: "cat_shoes",
    name: "Shoes",
    slug: "shoes",
    image: "/uploads/regenerated_image_1788787471690.png",
    description: "Handcrafted leather oxfords, artisan boots, and premium sneakers engineered for timeless elegance.",
    featured: true
  },
  {
    id: "cat_perfumes",
    name: "Perfumes",
    slug: "perfumes",
    image: "/uploads/regenerated_image_1788787478718.jpg",
    description: "Opulent Eau De Parfums enriched with pure royal oud, damascene rose, and radiant amber accords.",
    featured: true
  },
  {
    id: "cat_watches",
    name: "Watches",
    slug: "watches",
    image: "/uploads/regenerated_image_1788787497825.png",
    description: "Precision-engineered chronographs, sapphire crystal automatics, and minimalist luxury timepieces.",
    featured: true
  },
  {
    id: "cat_caps",
    name: "Caps",
    slug: "caps",
    image: "/uploads/regenerated_image_1788787484237.png",
    description: "Structured wool caps, monogram embroidered snapbacks, and tailored street luxury headwear.",
    featured: true
  },
  {
    id: "cat_cosmetics",
    name: "Cosmetics",
    slug: "cosmetics",
    image: "/uploads/regenerated_image_1788787488028.jpg",
    description: "Dermatologist-formulated 24K gold serums, satin matte lip colors, and velvet skin nourishment.",
    featured: true
  },
  {
    id: "cat_fashion",
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    description: "Tailored Italian wool suits, merino knitwear, and modern silhouettes crafted for discerning taste.",
    featured: true
  },
  {
    id: "cat_accessories",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    description: "Full-grain leather wallets, handcrafted brass cufflinks, titanium eyewear, and leather belts.",
    featured: true
  }
];

// Seed Products
const seedProducts = [
  {
    id: "prod_shoes_1",
    name: "BIZORA Royal Oxford Handcrafted Leather Shoes",
    slug: "bizora-royal-oxford-handcrafted-leather-shoes",
    description: "Forged from full-grain calfskin leather, the Royal Oxford features a classic cap-toe silhouette, hand-burnished deep cognac finish, and Blake-stitched Italian leather soles with anti-slip rubber taps for supreme comfort and enduring distinction.",
    price: 18500,
    discountPrice: 15999,
    images: [
      "/uploads/regenerated_image_1788787471690.png"
    ],
    category: "shoes",
    stock: 24,
    rating: 4.9,
    reviewsCount: 38,
    featured: true,
    sale: true,
    specifications: [
      { key: "Material", value: "100% Full-grain Italian Calfskin" },
      { key: "Construction", value: "Hand-welted Blake Stitch" },
      { key: "Lining", value: "Soft Breathable Sheepskin" },
      { key: "Origin", value: "Handcrafted in Atelier" }
    ],
    reviews: [
      {
        id: "rev_1",
        userName: "Farhan Malik",
        rating: 5,
        comment: "Impeccable craft. The leather is supple and the hand-burnish cognac looks ten times richer in person.",
        createdAt: "2026-02-15T10:20:00.000Z"
      },
      {
        id: "rev_2",
        userName: "Usman Tariq",
        rating: 5,
        comment: "Arrived in 2 days in Lahore via Cash on Delivery. Fits true to European size 42.",
        createdAt: "2026-02-28T14:15:00.000Z"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_shoes_2",
    name: "BIZORA AirGlide Minimalist Cloud Sneakers",
    slug: "bizora-airglide-minimalist-cloud-sneakers",
    description: "Designed for urban momentum. Clean monochrome Italian nappa leather upper combined with an ultra-lightweight EVA midsole and cushioned memory foam insole.",
    price: 11900,
    discountPrice: 9999,
    images: [
      "/uploads/regenerated_image_1788787471690.png"
    ],
    category: "shoes",
    stock: 35,
    rating: 4.8,
    reviewsCount: 52,
    featured: true,
    sale: true,
    specifications: [
      { key: "Upper", value: "Nappa Leather" },
      { key: "Sole", value: "Custom Ultralight EVA Foam" },
      { key: "Weight", value: "290g per shoe" }
    ],
    reviews: [
      {
        id: "rev_3",
        userName: "Hamza Riaz",
        rating: 5,
        comment: "The most comfortable pair of clean white sneakers I have ever owned. Exceptional quality.",
        createdAt: "2026-03-01T12:00:00.000Z"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_perfume_1",
    name: "BIZORA Oud Royale Eau De Parfum (100ml)",
    slug: "bizora-oud-royale-eau-de-parfum",
    description: "A majestic oriental scent opening with spicy saffron and nutmeg, unfurling into rich agarwood (oud), smoked frankincense, and a warm trail of dark amber and patchouli. Exceptional 14-hour longevity.",
    price: 14500,
    discountPrice: 12499,
    images: [
      "/uploads/regenerated_image_1788787494636.png",
      "/uploads/regenerated_image_1788787478718.jpg"
    ],
    category: "perfumes",
    stock: 40,
    rating: 5.0,
    reviewsCount: 74,
    featured: true,
    sale: true,
    specifications: [
      { key: "Volume", value: "100ml / 3.4 fl oz" },
      { key: "Concentration", value: "Eau De Parfum (25% Oil Essence)" },
      { key: "Top Notes", value: "Persian Saffron, Nutmeg, Lavender" },
      { key: "Heart Notes", value: "Cambodian Agarwood, Smoked Oud" },
      { key: "Base Notes", value: "Amber, Patchouli, Velvet Musk" }
    ],
    reviews: [
      {
        id: "rev_4",
        userName: "Ahmed Sheikh",
        rating: 5,
        comment: "Sublime oud fragrance! The sillage and projection are incredible without being overpowering.",
        createdAt: "2026-02-18T18:30:00.000Z"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_perfume_2",
    name: "BIZORA Velvet Rose Noir Parfum (100ml)",
    slug: "bizora-velvet-rose-noir-parfum",
    description: "Sensual Damascena rose steeped in dark chocolate, black pepper, and Tahitian vanilla bean. A magnetic fragrance created for glamorous evenings.",
    price: 13200,
    discountPrice: 11500,
    images: [
      "/uploads/regenerated_image_1788787478718.jpg",
      "/uploads/regenerated_image_1788787494636.png"
    ],
    category: "perfumes",
    stock: 28,
    rating: 4.8,
    reviewsCount: 41,
    featured: false,
    sale: true,
    specifications: [
      { key: "Volume", value: "100ml" },
      { key: "Concentration", value: "Parfum Extrait" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_watch_1",
    name: "BIZORA Chrono Master Automatic Watch",
    slug: "bizora-chrono-master-automatic-watch",
    description: "Exquisite horology meets contemporary executive design. 41mm 316L stainless steel case, anti-reflective domed sapphire crystal, 42-hour power reserve Japanese mechanical movement, and quick-release genuine alligator-grain leather strap.",
    price: 34500,
    discountPrice: 29900,
    images: [
      "/uploads/regenerated_image_1788787497825.png"
    ],
    category: "watches",
    stock: 15,
    rating: 4.9,
    reviewsCount: 65,
    featured: true,
    sale: true,
    specifications: [
      { key: "Case Diameter", value: "41mm" },
      { key: "Movement", value: "Miyota 9015 Automatic Mechanical" },
      { key: "Glass", value: "Anti-Scratch Sapphire Crystal" },
      { key: "Water Resistance", value: "10 ATM (100 Meters)" },
      { key: "Warranty", value: "2-Year International BIZORA Guarantee" }
    ],
    reviews: [
      {
        id: "rev_5",
        userName: "Bilal Hashmi",
        rating: 5,
        comment: "Remarkable timepiece. Weighty, perfectly balanced on the wrist, and keeps razor-sharp time.",
        createdAt: "2026-02-10T11:45:00.000Z"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_watch_2",
    name: "BIZORA Sapphire Eclipse Minimalist Watch",
    slug: "bizora-sapphire-eclipse-minimalist-watch",
    description: "Ultra-slim 7mm profile with matte sunray obsidian black dial, polished indices, and Milanese stainless steel mesh band with magnetic clasp.",
    price: 19500,
    discountPrice: 16800,
    images: [
      "/uploads/regenerated_image_1788787497825.png"
    ],
    category: "watches",
    stock: 22,
    rating: 4.7,
    reviewsCount: 33,
    featured: false,
    sale: false,
    specifications: [
      { key: "Case Thickness", value: "7.2mm Ultra-thin" },
      { key: "Dial", value: "Sunburst Obsidian" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_cap_1",
    name: "BIZORA Signature Monogram Snapback Cap",
    slug: "bizora-signature-monogram-snapback-cap",
    description: "Crafted from premium structured heavyweight cotton twill with an embossed gold-thread BIZORA crest, moisture-wicking satin sweatband, and adjustable metallic rear closure.",
    price: 3400,
    discountPrice: 2899,
    images: [
      "/uploads/regenerated_image_1788787504402.png",
      "/uploads/regenerated_image_1788787484237.png"
    ],
    category: "caps",
    stock: 50,
    rating: 4.9,
    reviewsCount: 88,
    featured: true,
    sale: true,
    specifications: [
      { key: "Material", value: "100% Organic Heavyweight Cotton" },
      { key: "Closure", value: "Matte Metal Clasp" },
      { key: "Fit", value: "Universal Adjustable (54-61cm)" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_cap_2",
    name: "BIZORA Heritage Wool Tweed Flat Cap",
    slug: "bizora-heritage-wool-tweed-flat-cap",
    description: "Classic British sartorial tradition. Woven from 100% pure Shetland wool with quilted silk lining for cool weather warmth and understated sophistication.",
    price: 4500,
    discountPrice: 3800,
    images: [
      "/uploads/regenerated_image_1788787484237.png"
    ],
    category: "caps",
    stock: 30,
    rating: 4.8,
    reviewsCount: 29,
    featured: false,
    sale: false,
    specifications: [
      { key: "Material", value: "Pure Shetland Wool" },
      { key: "Lining", value: "Quilted Thermal Satin" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_cosmetics_1",
    name: "BIZORA 24K Gold Radiant Youth Elixir (50ml)",
    slug: "bizora-24k-gold-radiant-youth-elixir",
    description: "Infused with pure 24K micro-gold flakes, multi-molecular hyaluronic acid, and botanical bakuchiol to stimulate cellular renewal, brighten complexion, and deliver deep non-comedogenic moisture.",
    price: 8900,
    discountPrice: 7499,
    images: [
      "/uploads/regenerated_image_1788787488028.jpg"
    ],
    category: "cosmetics",
    stock: 45,
    rating: 5.0,
    reviewsCount: 92,
    featured: true,
    sale: true,
    specifications: [
      { key: "Volume", value: "50ml Pipette Bottle" },
      { key: "Skin Type", value: "All Skin Types, Sensitive Safe" },
      { key: "Formula", value: "Clean, Paraben-Free, Cruelty-Free" }
    ],
    reviews: [
      {
        id: "rev_6",
        userName: "Ayesha Khan",
        rating: 5,
        comment: "Visible radiance within 3 days. Light texture, absorbs immediately without grease.",
        createdAt: "2026-03-02T16:00:00.000Z"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_cosmetics_2",
    name: "BIZORA Satin Velvet Matte Lipstick Trio",
    slug: "bizora-satin-velvet-matte-lipstick-trio",
    description: "Curated collection of three essential shades: Crimson Noir, Nude Cashmere, and Dusky Plum. Formulated with shea butter and vitamin E for 12-hour comfortable wear.",
    price: 4900,
    discountPrice: 4200,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "cosmetics",
    stock: 60,
    rating: 4.7,
    reviewsCount: 45,
    featured: false,
    sale: true,
    specifications: [
      { key: "Finish", value: "Velvet Hydrating Matte" },
      { key: "Shades", value: "3 Full Size Lipsticks" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_fashion_1",
    name: "BIZORA Tailored Italian Wool Double-Breasted Blazer",
    slug: "bizora-tailored-italian-wool-double-breasted-blazer",
    description: "Exemplary tailoring in fine Super 130s Italian virgin wool. Structured roped shoulders, hand-stitched peak lapels, horn buttons, and cupro silk lining.",
    price: 38900,
    discountPrice: 33500,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "fashion",
    stock: 18,
    rating: 4.9,
    reviewsCount: 37,
    featured: true,
    sale: false,
    specifications: [
      { key: "Fabric", value: "100% Italian Super 130s Wool" },
      { key: "Cut", value: "Modern Tailored Fit" },
      { key: "Care", value: "Dry Clean Only" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_fashion_2",
    name: "BIZORA Mongolian Cashmere Knit Polo",
    slug: "bizora-mongolian-cashmere-knit-polo",
    description: "Spun from 2-ply grade-A Mongolian cashmere. Exceptionally soft, temperature-regulating, and tailored with genuine mother-of-pearl buttons.",
    price: 16500,
    discountPrice: 13900,
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "fashion",
    stock: 25,
    rating: 4.8,
    reviewsCount: 22,
    featured: false,
    sale: true,
    specifications: [
      { key: "Material", value: "100% Grade A Cashmere" },
      { key: "Gauge", value: "12GG Fine Knit" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_acc_1",
    name: "BIZORA Full-Grain Leather Bi-Fold Executive Wallet",
    slug: "bizora-full-grain-leather-bi-fold-executive-wallet",
    description: "Constructed from vegetable-tanned full-grain bridle leather with RFID-blocking protection, 8 card slots, dual cash compartments, and hand-burnished edges.",
    price: 4800,
    discountPrice: 3999,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "accessories",
    stock: 50,
    rating: 4.9,
    reviewsCount: 68,
    featured: true,
    sale: true,
    specifications: [
      { key: "Leather", value: "Vegetable-tanned full-grain cowhide" },
      { key: "Features", value: "RFID Shielding Layer" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_acc_2",
    name: "BIZORA Titanium Polarized Aviator Sunglasses",
    slug: "bizora-titanium-polarized-aviator-sunglasses",
    description: "Ultra-lightweight aerospace grade titanium frame weighing only 18 grams. Equipped with Carl Zeiss polarized lenses providing 100% UVA/UVB protection and crystal visual clarity.",
    price: 12500,
    discountPrice: 10500,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "accessories",
    stock: 20,
    rating: 4.9,
    reviewsCount: 42,
    featured: true,
    sale: false,
    specifications: [
      { key: "Frame", value: "Aerospace Beta Titanium" },
      { key: "Lenses", value: "Category 3 Polarized, Scratch-Resistant" }
    ],
    createdAt: new Date().toISOString()
  }
];

// Seed Users
const seedUsers = [
  {
    id: "user_admin",
    name: "BIZORA Admin",
    email: "admin@bizora.com",
    phone: "+92 300 1234567",
    passwordHash: bcrypt.hashSync("Admin@12345", 10),
    role: "admin",
    address: {
      street: "MM Alam Road",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
      country: "Pakistan"
    },
    createdAt: new Date("2026-01-01").toISOString()
  },
  {
    id: "user_customer",
    name: "Taimoor Shah",
    email: "customer@bizora.com",
    phone: "+92 321 9876543",
    passwordHash: bcrypt.hashSync("Customer@12345", 10),
    role: "customer",
    address: {
      street: "House 45, Sector F-7/2",
      city: "Islamabad",
      province: "Islamabad Capital",
      postalCode: "44000",
      country: "Pakistan"
    },
    createdAt: new Date("2026-01-15").toISOString()
  }
];

// Seed sample orders
const seedOrders = [
  {
    id: "ord_1001",
    userId: "user_customer",
    items: [
      {
        productId: "prod_perfume_1",
        productName: "BIZORA Oud Royale Eau De Parfum (100ml)",
        productImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
        price: 12499,
        quantity: 1,
        subtotal: 12499
      },
      {
        productId: "prod_acc_1",
        productName: "BIZORA Full-Grain Leather Bi-Fold Executive Wallet",
        productImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop",
        price: 3999,
        quantity: 1,
        subtotal: 3999
      }
    ],
    customerInfo: {
      fullName: "Taimoor Shah",
      email: "customer@bizora.com",
      phone: "+92 321 9876543",
      address: "House 45, Sector F-7/2",
      city: "Islamabad",
      province: "Islamabad Capital",
      postalCode: "44000",
      notes: "Please call before arrival."
    },
    subtotal: 16498,
    deliveryFee: 0,
    discountAmount: 1649,
    total: 14849,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Paid",
    status: "Delivered",
    createdAt: new Date("2026-02-12T14:30:00.000Z").toISOString()
  },
  {
    id: "ord_1002",
    userId: "user_customer",
    items: [
      {
        productId: "prod_shoes_1",
        productName: "BIZORA Royal Oxford Handcrafted Leather Shoes",
        productImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
        price: 15999,
        quantity: 1,
        subtotal: 15999
      }
    ],
    customerInfo: {
      fullName: "Zainab Tariq",
      email: "zainab.tariq@example.com",
      phone: "+92 333 4455667",
      address: "Clifton Block 4, Sea View Road",
      city: "Karachi",
      province: "Sindh",
      postalCode: "75600",
      notes: "Ring bell 4B"
    },
    subtotal: 15999,
    deliveryFee: 0,
    total: 15999,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    status: "Shipped",
    createdAt: new Date("2026-03-04T09:15:00.000Z").toISOString()
  },
  {
    id: "ord_1003",
    items: [
      {
        productId: "prod_cap_1",
        productName: "BIZORA Signature Monogram Snapback Cap",
        productImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
        price: 2899,
        quantity: 2,
        subtotal: 5798
      }
    ],
    customerInfo: {
      fullName: "Danish Ali",
      email: "danish.ali@gmail.com",
      phone: "+92 301 5566778",
      address: "DHA Phase 5, Street 12",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54792",
      notes: ""
    },
    subtotal: 5798,
    deliveryFee: 0,
    total: 5798,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    status: "Pending",
    createdAt: new Date().toISOString()
  }
];

// Seed contacts
const seedContacts = [
  {
    id: "cnt_1",
    name: "Kamran Siddiqui",
    email: "kamran@corporate.pk",
    phone: "+92 300 9988776",
    subject: "Corporate Gifting Inquiries for Eid Collection",
    message: "Hello BIZORA Team, we are interested in ordering 50 units of the BIZORA Leather Bi-fold wallets with custom corporate embossing for our executive team. Kindly share catalog and bulk pricing.",
    read: false,
    createdAt: new Date("2026-03-01T15:00:00.000Z").toISOString()
  },
  {
    id: "cnt_2",
    name: "Sana Mir",
    email: "sana.mir@yahoo.com",
    phone: "+92 321 1122334",
    subject: "Perfume Sample Kit Availability",
    message: "Do you offer a discovery mini discovery set for the Oud Royale and Velvet Rose fragrances before purchasing the 100ml bottles?",
    read: true,
    createdAt: new Date("2026-02-25T11:20:00.000Z").toISOString()
  }
];

class DatabaseManager {
  private data: DatabaseState;

  constructor() {
    this.data = {
      users: [...seedUsers],
      categories: [...seedCategories],
      products: [...seedProducts],
      orders: [...seedOrders],
      contacts: [...seedContacts],
      settings: { ...defaultSettings },
      media: [...seedMedia]
    };

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && parsed.products.length > 0) {
          this.data = {
            users: parsed.users || [...seedUsers],
            categories: parsed.categories || [...seedCategories],
            products: parsed.products || [...seedProducts],
            orders: parsed.orders || [...seedOrders],
            contacts: parsed.contacts || [...seedContacts],
            settings: {
              ...defaultSettings,
              ...(parsed.settings || {}),
              content: {
                ...defaultContent,
                ...((parsed.settings && parsed.settings.content) || {})
              }
            },
            media: parsed.media && parsed.media.length > 0 ? parsed.media : [...seedMedia]
          };

          // Backfill any missing fields in categories
          this.data.categories.forEach(c => {
            if (!c.status) c.status = 'active';
          });

          // Backfill any missing fields in products
          this.data.products.forEach(p => {
            if (!p.status) p.status = 'active';
            if (!p.sku) {
              const catPrefix = (p.category || 'GEN').substring(0, 3).toUpperCase();
              p.sku = `BZ-${catPrefix}-${p.id.substring(p.id.length - 4).toUpperCase()}`;
            }
            if (!p.shortDescription) {
              p.shortDescription = (p.description || '').substring(0, 140);
            }
            if (!p.createdAt) {
              p.createdAt = new Date().toISOString();
            }
          });

          this.saveToDisk();
          return;
        }
      }
    } catch (err) {
      console.warn('Could not read saved data file, using default seed data:', err);
    }
    this.saveToDisk();
  }

  public saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving data to disk:', err);
    }
  }

  // Users
  get users() {
    return {
      find: (predicate?: (u: any) => boolean) => predicate ? this.data.users.filter(predicate) : [...this.data.users],
      findOne: (predicate: (u: any) => boolean) => this.data.users.find(predicate),
      findById: (id: string) => this.data.users.find(u => u.id === id || u._id === id),
      create: (userData: any) => {
        const user = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          role: 'customer',
          createdAt: new Date().toISOString(),
          ...userData
        };
        this.data.users.push(user);
        this.saveToDisk();
        return user;
      },
      findByIdAndUpdate: (id: string, updates: any) => {
        const idx = this.data.users.findIndex(u => u.id === id || u._id === id);
        if (idx === -1) return null;
        this.data.users[idx] = { ...this.data.users[idx], ...updates };
        this.saveToDisk();
        return this.data.users[idx];
      },
      countDocuments: () => this.data.users.length
    };
  }

  // Categories
  get categories() {
    return {
      find: () => [...this.data.categories],
      findOne: (predicate: (c: any) => boolean) => this.data.categories.find(predicate),
      findById: (id: string) => this.data.categories.find(c => c.id === id),
      create: (categoryData: any) => {
        const category = {
          id: `cat_${categoryData.slug || Date.now()}`,
          status: categoryData.status || 'active',
          ...categoryData
        };
        this.data.categories.push(category);
        this.saveToDisk();
        return category;
      },
      findByIdAndUpdate: (id: string, updates: any) => {
        const idx = this.data.categories.findIndex(c => c.id === id);
        if (idx === -1) return null;
        this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
        this.saveToDisk();
        return this.data.categories[idx];
      },
      findByIdAndDelete: (id: string) => {
        const idx = this.data.categories.findIndex(c => c.id === id);
        if (idx === -1) return null;
        const deleted = this.data.categories.splice(idx, 1)[0];
        this.saveToDisk();
        return deleted;
      }
    };
  }

  // Products
  get products() {
    return {
      find: (filter?: {
        category?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        featured?: boolean;
        sale?: boolean;
        status?: string;
        stockStatus?: string;
        sort?: string;
      }) => {
        let list = [...this.data.products];
        if (filter) {
          if (filter.category && filter.category !== 'all') {
            list = list.filter(p => p.category.toLowerCase() === filter.category?.toLowerCase());
          }
          if (filter.search) {
            const q = filter.search.toLowerCase();
            list = list.filter(p =>
              p.name.toLowerCase().includes(q) ||
              (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
              (p.description && p.description.toLowerCase().includes(q)) ||
              (p.sku && p.sku.toLowerCase().includes(q)) ||
              p.category.toLowerCase().includes(q)
            );
          }
          if (filter.status && filter.status !== 'all') {
            list = list.filter(p => (p.status || 'active').toLowerCase() === filter.status?.toLowerCase());
          }
          if (filter.stockStatus) {
            if (filter.stockStatus === 'in_stock') {
              list = list.filter(p => (p.stock || 0) > 0);
            } else if (filter.stockStatus === 'low_stock') {
              list = list.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5);
            } else if (filter.stockStatus === 'out_of_stock') {
              list = list.filter(p => (p.stock || 0) <= 0);
            }
          }
          if (filter.minPrice !== undefined && !isNaN(filter.minPrice)) {
            list = list.filter(p => (p.discountPrice || p.price) >= (filter.minPrice || 0));
          }
          if (filter.maxPrice !== undefined && !isNaN(filter.maxPrice)) {
            list = list.filter(p => (p.discountPrice || p.price) <= (filter.maxPrice || Infinity));
          }
          if (filter.featured !== undefined) {
            list = list.filter(p => p.featured === filter.featured);
          }
          if (filter.sale !== undefined) {
            list = list.filter(p => p.sale === filter.sale);
          }
          if (filter.sort) {
            if (filter.sort === 'price-asc') {
              list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
            } else if (filter.sort === 'price-desc') {
              list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
            } else if (filter.sort === 'rating') {
              list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else if (filter.sort === 'newest' || filter.sort === 'date-desc') {
              list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            } else if (filter.sort === 'date-asc') {
              list.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
            }
          }
        }
        return list;
      },
      findById: (idOrSlug: string) => {
        return this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      },
      create: (prodData: any) => {
        const slug = prodData.slug || prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const sku = prodData.sku || `BZ-${(prodData.category || 'GEN').substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const product = {
          id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          slug,
          sku,
          shortDescription: prodData.shortDescription || (prodData.description || '').substring(0, 140),
          rating: 5.0,
          reviewsCount: 0,
          reviews: [],
          status: prodData.status || 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...prodData
        };
        this.data.products.push(product);
        this.saveToDisk();
        return product;
      },
      findByIdAndUpdate: (id: string, updates: any) => {
        const idx = this.data.products.findIndex(p => p.id === id || p.slug === id);
        if (idx === -1) return null;
        this.data.products[idx] = {
          ...this.data.products[idx],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.saveToDisk();
        return this.data.products[idx];
      },
      findByIdAndDelete: (id: string) => {
        const idx = this.data.products.findIndex(p => p.id === id || p.slug === id);
        if (idx === -1) return null;
        const deleted = this.data.products.splice(idx, 1)[0];
        this.saveToDisk();
        return deleted;
      },
      countDocuments: () => this.data.products.length
    };
  }

  // Media Library
  get media() {
    return {
      find: (filter?: { search?: string; category?: string }) => {
        let list = [...(this.data.media || [])];
        if (filter) {
          if (filter.category && filter.category !== 'all') {
            list = list.filter(m => m.category === filter.category);
          }
          if (filter.search) {
            const q = filter.search.toLowerCase();
            list = list.filter(m => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q));
          }
        }
        return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      },
      findById: (id: string) => (this.data.media || []).find(m => m.id === id),
      create: (mediaData: any) => {
        const item = {
          id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: mediaData.category || 'general',
          createdAt: new Date().toISOString(),
          ...mediaData
        };
        if (!this.data.media) this.data.media = [];
        this.data.media.unshift(item);
        this.saveToDisk();
        return item;
      },
      findByIdAndDelete: (id: string) => {
        if (!this.data.media) return null;
        const idx = this.data.media.findIndex(m => m.id === id);
        if (idx === -1) return null;
        const deleted = this.data.media.splice(idx, 1)[0];
        this.saveToDisk();
        return deleted;
      }
    };
  }

  // Orders
  get orders() {
    return {
      find: (predicate?: (o: any) => boolean) => {
        const list = predicate ? this.data.orders.filter(predicate) : [...this.data.orders];
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      findById: (id: string) => this.data.orders.find(o => o.id === id),
      create: (orderData: any) => {
        const order = {
          id: `ord_${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Pending',
          paymentStatus: 'Unpaid',
          createdAt: new Date().toISOString(),
          ...orderData
        };
        this.data.orders.push(order);

        // Decrement stock for purchased items
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            const p = this.data.products.find(prod => prod.id === item.productId);
            if (p) {
              p.stock = Math.max(0, p.stock - item.quantity);
            }
          }
        }

        this.saveToDisk();
        return order;
      },
      findByIdAndUpdate: (id: string, updates: any) => {
        const idx = this.data.orders.findIndex(o => o.id === id);
        if (idx === -1) return null;
        this.data.orders[idx] = { ...this.data.orders[idx], ...updates };
        this.saveToDisk();
        return this.data.orders[idx];
      },
      countDocuments: () => this.data.orders.length
    };
  }

  // Contacts
  get contacts() {
    return {
      find: () => [...this.data.contacts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      findById: (id: string) => this.data.contacts.find(c => c.id === id),
      create: (contactData: any) => {
        const contact = {
          id: `cnt_${Date.now()}`,
          read: false,
          createdAt: new Date().toISOString(),
          ...contactData
        };
        this.data.contacts.push(contact);
        this.saveToDisk();
        return contact;
      },
      findByIdAndUpdate: (id: string, updates: any) => {
        const idx = this.data.contacts.findIndex(c => c.id === id);
        if (idx === -1) return null;
        this.data.contacts[idx] = { ...this.data.contacts[idx], ...updates };
        this.saveToDisk();
        return this.data.contacts[idx];
      }
    };
  }

  // Settings
  get settings() {
    return {
      get: () => ({ ...this.data.settings }),
      getContent: () => ({ ...(this.data.settings.content || defaultContent) }),
      updateContent: (contentUpdates: any) => {
        this.data.settings.content = {
          ...(this.data.settings.content || defaultContent),
          ...contentUpdates
        };
        this.saveToDisk();
        return this.data.settings.content;
      },
      update: (newSettings: any) => {
        this.data.settings = { ...this.data.settings, ...newSettings };
        this.saveToDisk();
        return this.data.settings;
      }
    };
  }
}

export const db = new DatabaseManager();
