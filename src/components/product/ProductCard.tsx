import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Product, formatPrice } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group product-card bg-white"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.images[0]} // Always show the primary image
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Badges - Simplified and moved to top-left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge === 'new' && (
            <span className="bg-accent text-white text-[10px] px-2 py-0.5 font-bold uppercase rounded-sm">New</span>
          )}
          {product.badge === 'bestseller' && (
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 font-bold uppercase rounded-sm">Bestseller</span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 font-bold rounded-sm">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 text-center">
        {/* Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-body text-xs md:text-sm font-medium text-foreground line-clamp-1 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice!)}</span>
          )}
        </div>

        {/* Static Star Rating */}
        <div className="flex items-center justify-center gap-1">
          <Star className="w-3 h-3 text-accent fill-accent" />
          <span className="text-[10px] text-muted-foreground">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;