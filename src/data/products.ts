export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  badge?: 'new' | 'bestseller' | 'lowstock';
  description: string;
  fabric: string;
  care: string[];
  inStock: boolean;
  isFeatured?: boolean;
  isInstagramPick?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Sarees', slug: 'sarees', image: '/placeholder.svg', subcategories: ['Silk Sarees', 'Cotton Sarees', 'Party Wear', 'With Blouse'] },
  { id: '2', name: 'Lehengas', slug: 'lehengas', image: '/placeholder.svg', subcategories: ['Bridal', 'Party Wear', 'Festive'] },
  { id: '3', name: 'Kurta Sets', slug: 'kurta-sets', image: '/placeholder.svg', subcategories: ['Anarkali', 'Straight Cut', 'A-Line'] },
  { id: '4', name: "Men's Ethnic", slug: 'mens-ethnic', image: '/placeholder.svg', subcategories: ['Kurtas', 'Sherwanis', 'Nehru Jackets'] },
  { id: '5', name: 'Kids', slug: 'kids', image: '/placeholder.svg', subcategories: ['Girls', 'Boys'] },
  { id: '6', name: 'Jewellery', slug: 'jewellery', image: '/placeholder.svg', subcategories: ['Traditional', 'Kundan', 'Temple'] },
];

export const products: Product[] = [
  // --- SAREES (Main Category) ---
  {
    id: '1',
    name: 'Banarasi Silk Saree in Royal Magenta',
    slug: 'banarasi-silk-saree-royal-magenta',
    category: 'sarees',
    subcategory: 'Silk Sarees',
    price: 8999,
    originalPrice: 12999,
    images: ['/images/products/saree-magenta-1.jpg', '/images/products/saree-magenta-2.jpg'],
    colors: [{ name: 'Magenta', hex: '#8B008B' }, { name: 'Gold', hex: '#D4AF37' }],
    sizes: ['Free Size'],
    rating: 4.8,
    reviewCount: 124,
    badge: 'bestseller',
    description: 'Exquisite Banarasi silk saree featuring intricate zari work and traditional motifs.',
    fabric: '100% Pure Banarasi Silk with Real Zari',
    care: ['Dry clean only', 'Store in muslin cloth'],
    inStock: true,
    isFeatured: true,
    isInstagramPick: true,
  },
  {
    id: '4',
    name: 'Cotton Chanderi Saree - Mint Green',
    slug: 'cotton-chanderi-saree-mint-green',
    category: 'sarees',
    subcategory: 'Cotton Sarees',
    price: 2499,
    originalPrice: 3499,
    images: ['/images/products/saree-mint-1.jpg'],
    colors: [{ name: 'Mint Green', hex: '#98FF98' }],
    sizes: ['Free Size'],
    rating: 4.6,
    reviewCount: 156,
    badge: 'new',
    description: 'Light and airy Chanderi cotton saree with subtle silver zari border.',
    fabric: 'Pure Chanderi Cotton',
    care: ['Machine wash cold'],
    inStock: true,
    isInstagramPick: true,
  },
  {
    id: '14',
    name: 'Kanjivaram Silk Saree - Emerald',
    slug: 'kanjivaram-silk-saree-emerald',
    category: 'sarees',
    subcategory: 'Silk Sarees',
    price: 1499,
    originalPrice:2999,
    images: ['/images/products/saree-emerald-1.jpg'],
    colors: [{ name: 'Emerald', hex: '#50C878' }],
    sizes: ['Free Size'],
    rating: 5.0,
    reviewCount: 67,
    badge: 'bestseller',
    description: 'Authentic Kanjivaram silk saree with real gold zari.',
    fabric: 'Pure Kanjivaram Silk',
    care: ['Dry clean only'],
    inStock: true,
    isFeatured: true,
  },

  // --- LEHENGAS (Main Category) ---
  {
    id: '3',
    name: 'Bridal Lehenga - Midnight Blue with Gold',
    slug: 'bridal-lehenga-midnight-blue-gold',
    category: 'lehengas',
    subcategory: 'Bridal',
    price: 2499,
    originalPrice:3999,
    images: ['/images/products/lehenga-blue-1.jpg'],
    colors: [{ name: 'Midnight Blue', hex: '#191970' }],
    sizes: ['S', 'M', 'L'],
    rating: 5.0,
    reviewCount: 47,
    badge: 'bestseller',
    description: 'Stunning bridal lehenga with heavy zardozi and sequin work.',
    fabric: 'Premium Velvet with Net Dupatta',
    care: ['Professional dry clean only'],
    inStock: true,
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Festive Lehenga - Coral Sunset',
    slug: 'festive-lehenga-coral-sunset',
    category: 'lehengas',
    subcategory: 'Festive',
    price: 12999,
    originalPrice: 16999,
    images: ['/images/products/lehenga-coral-1.jpg'],
    colors: [{ name: 'Coral', hex: '#FF7F50' }],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.7,
    reviewCount: 78,
    description: 'Beautiful festive lehenga with gradient effect and mirror work.',
    fabric: 'Organza with Silk blend',
    care: ['Dry clean only'],
    inStock: true,
    isFeatured: true,
  },

  // --- OTHERS (Supporting Categories - 2 per type) ---
  {
    id: '2',
    name: 'Designer Anarkali Kurta Set - Blush Pink',
    slug: 'designer-anarkali-kurta-blush-pink',
    category: 'kurta-sets',
    subcategory: 'Anarkali',
    price: 4599,
    originalPrice:5999,
    images: ['/images/products/kurta-pink-1.jpg'],
    colors: [{ name: 'Blush Pink', hex: '#FFB6C1' }],
    sizes: ['S', 'M', 'L'],
    rating: 4.9,
    reviewCount: 89,
    badge: 'new',
    description: 'Elegant floor-length Anarkali suit with delicate thread embroidery.',
    fabric: 'Georgette',
    care: ['Dry clean recommended'],
    inStock: true,
    isFeatured: true,
  },
  {
    id: '8',
    name: 'Kundan Bridal Jewellery Set',
    slug: 'kundan-bridal-jewellery-set',
    category: 'jewellery',
    subcategory: 'Kundan',
    price: 4999,
    originalPrice:5999,
    images: ['/images/products/jewel-kundan-1.jpg'],
    colors: [{ name: 'Gold', hex: '#D4AF37' }],
    sizes: ['One Size'],
    rating: 4.8,
    reviewCount: 67,
    badge: 'new',
    description: 'Stunning 5-piece Kundan jewellery set.',
    fabric: 'Gold-plated brass',
    care: ['Store in jewellery box'],
    inStock: true,
    isInstagramPick: true,
  },
  {
    id: '7',
    name: 'Girls Lehenga Set - Princess Pink',
    slug: 'girls-lehenga-princess-pink',
    category: 'kids',
    subcategory: 'Girls',
    price: 1999,
    originalPrice:2999,
    images: ['/images/products/kids-pink-1.jpg'],
    colors: [{ name: 'Pink', hex: '#FF69B4' }],
    sizes: ['4-5Y', '5-6Y'],
    rating: 4.9,
    reviewCount: 234,
    badge: 'bestseller',
    description: 'Adorable lehenga set for little princesses.',
    fabric: 'Net with Satin lining',
    care: ['Hand wash cold'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Men\'s Silk Kurta - Classic Ivory',
    slug: 'mens-silk-kurta-classic-ivory',
    category: 'mens-ethnic',
    subcategory: 'Kurtas',
    price: 3499,
    originalPrice:5999,
    images: ['/images/products/men-ivory-1.jpg'],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }],
    sizes: ['M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 92,
    badge: 'new',
    description: 'Premium silk kurta with subtle self-work pattern.',
    fabric: 'Art Silk',
    care: ['Dry clean only'],
    inStock: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: 'Absolutely stunning saree! The quality exceeded my expectations. The fabric feels luxurious and the color is exactly as shown. Will definitely order again!',
    product: 'Banarasi Silk Saree',
    date: '2 weeks ago',
  },
  {
    id: '2',
    name: 'Anjali Patel',
    location: 'Delhi',
    rating: 5,
    comment: 'The bridal lehenga is a dream come true! Every detail is perfect. Divya ji personally helped me with customizations. Truly a boutique experience!',
    product: 'Bridal Lehenga',
    date: '1 month ago',
  },
  {
    id: '3',
    name: 'Meera Reddy',
    location: 'Bangalore',
    rating: 5,
    comment: 'Fast shipping and beautiful packaging. The kurta set fits perfectly. Love how they include care instructions and a handwritten thank you note!',
    product: 'Anarkali Kurta Set',
    date: '3 weeks ago',
  },
  {
    id: '4',
    name: 'Kavitha Nair',
    location: 'Chennai',
    rating: 4,
    comment: 'Great collection of South Indian jewellery. The temple necklace is exactly what I was looking for. Highly recommend GTD for authentic ethnic wear.',
    product: 'Temple Jewellery',
    date: '1 week ago',
  },
  {
    id: '5',
    name: 'Ritu Gupta',
    location: 'Jaipur',
    rating: 5,
    comment: 'My daughter looked like a princess in the kids lehenga! The quality is amazing and it arrived beautifully packed. Thank you GTD!',
    product: 'Kids Lehenga Set',
    date: '2 months ago',
  },
  {
    id: '6',
    name: 'Sneha Kulkarni',
    location: 'Pune',
    rating: 5,
    comment: 'Been following GTD on Instagram for years. Finally ordered and the experience was amazing. The Kanjivaram saree is pure perfection!',
    product: 'Kanjivaram Silk Saree',
    date: '1 month ago',
  },
];

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter(p => p.category === categorySlug);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.isFeatured);
};

export const getNewArrivals = (): Product[] => {
  return products.filter(p => p.badge === 'new').slice(0, 10);
};

export const getBestSellers = (): Product[] => {
  return products.filter(p => p.badge === 'bestseller');
};

export const getInstagramPicks = (): Product[] => {
  return products.filter(p => p.isInstagramPick);
};

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};
