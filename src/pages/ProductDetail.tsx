import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Minus, Plus, Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/product/ProductCard';
import { getProductBySlug, products, formatPrice, testimonials } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const product = getProductBySlug(slug || '') || products[0];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success("Added to Shopping Bag");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[0]);
  }, [slug, product]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container-luxury mx-auto px-4 md:px-8">
          
          {/* Breadcrumb - Hidden on very small screens or made scrollable */}
          <div className="flex items-center gap-2 text-muted-foreground text-[10px] md:text-xs mb-6 uppercase tracking-widest overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link to="/" className="hover:text-black">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link to={`/category/${product.category}`} className="capitalize hover:text-black">{product.category}</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-black font-bold truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            {/* Images - Stacked on Mobile */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary shadow-sm">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={product.images[selectedImage]} 
                  className="w-full h-full object-cover" 
                  alt={product.name} 
                />
              </div>
              {/* Thumbnails - Scrollable horizontally on Mobile */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)} 
                    className={`shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </div>

            {/* Core Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-3 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-5">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'} />
                  ))}
                </div>
                <span className="text-xs md:text-sm text-muted-foreground font-medium">
                  ({product.reviewCount} Reviews)
                </span>
              </div>

              <div className="text-2xl md:text-3xl font-bold text-primary mb-6">
                {formatPrice(product.price)}
                {product.originalPrice && (
                  <span className="text-base md:text-lg text-muted-foreground line-through ml-3 opacity-50 font-normal">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Delivery Time Indicator */}
              <div className="flex items-center gap-2 text-green-700 bg-green-50 w-full sm:w-fit px-3 py-2 rounded-md mb-6 border border-green-100">
                <Clock size={16} className="shrink-0" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-left">
                  Estimated Delivery: 3-5 Business Days
                </span>
              </div>

              {/* Size Selection */}
              <div className="mb-6 md:mb-8">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Select Size</span>
                   <button className="text-[10px] font-bold uppercase text-primary underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {product.sizes.map((size) => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)} 
                      className={`min-w-[50px] md:min-w-[60px] h-10 px-4 flex items-center justify-center border rounded-md text-xs font-bold transition-all ${
                        selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 text-black hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions - Sticky on bottom Mobile option is possible but here integrated in flow */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
                <div className="flex items-center border border-gray-200 rounded-md h-12 md:h-14">
                  <Button variant="ghost" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 h-full"><Minus size={16}/></Button>
                  <span className="w-8 md:w-10 text-center font-bold text-sm">{quantity}</span>
                  <Button variant="ghost" onClick={() => setQuantity(quantity + 1)} className="px-3 h-full"><Plus size={16}/></Button>
                </div>
                <Button 
                  onClick={handleAdd} 
                  className="bg-primary hover:bg-primary/90 text-white flex-1 h-12 md:h-14 font-bold uppercase tracking-widest text-xs md:text-sm"
                >
                  Add to Shopping Bag
                </Button>
              </div>

              {/* USP Badges - Responsive Grid */}
              <div className="grid grid-cols-3 gap-2 p-4 md:p-6 bg-secondary/20 rounded-xl border border-border/50">
                <div className="text-center">
                  <Truck className="mx-auto mb-1.5 text-primary" size={18}/>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase leading-tight">Free Shipping</p>
                </div>
                <div className="text-center border-x border-border/50">
                  <RotateCcw className="mx-auto mb-1.5 text-primary" size={18}/>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase leading-tight">Easy Exchange</p>
                </div>
                <div className="text-center">
                  <ShieldCheck className="mx-auto mb-1.5 text-primary" size={18}/>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase leading-tight">100% Authentic</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Scrollable on Mobile */}
          <Tabs defaultValue="description" className="mt-12 md:mt-20">
            <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-12 p-0 gap-4 md:gap-8 overflow-x-auto scrollbar-hide flex-nowrap">
              <TabsTrigger value="description" className="shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent font-bold text-[10px] md:text-xs uppercase px-1">Description</TabsTrigger>
              <TabsTrigger value="fabric" className="shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent font-bold text-[10px] md:text-xs uppercase px-1">Fabric & Care</TabsTrigger>
              <TabsTrigger value="reviews" className="shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent font-bold text-[10px] md:text-xs uppercase px-1">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="py-6 md:py-8 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
              {product.description}
            </TabsContent>
            
            <TabsContent value="fabric" className="py-6 md:py-8">
              <p className="font-bold text-black text-sm md:text-base mb-4">Material: {product.fabric}</p>
              <ul className="space-y-2">
                {product.care.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span> {c}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="reviews" className="py-6 md:py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {testimonials.slice(0, 4).map((t) => (
                  <div key={t.id} className="p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex text-accent mb-2 md:mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < t.rating ? 'fill-current' : 'text-gray-200'} />)}
                    </div>
                    <p className="text-xs md:text-sm text-black font-medium mb-3 italic">"{t.comment}"</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] md:text-xs font-bold uppercase text-muted-foreground">{t.name}</span>
                      <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase">{t.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full md:w-auto mt-6 md:mt-8 border-black text-black hover:bg-black hover:text-white rounded-full text-[10px] md:text-xs font-bold uppercase px-8">
                Load More Reviews
              </Button>
            </TabsContent>
          </Tabs>

          {/* Related Products Section */}
          <div className="mt-16 md:mt-24 border-t border-gray-100 pt-12 md:pt-16">
            <div className="flex items-center justify-between mb-6 md:mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-black uppercase tracking-tight">You May Also Like</h2>
              <Link to={`/category/${product.category}`} className="hidden md:block text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                View All {product.category}
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))
              ) : (
                <p className="col-span-full text-muted-foreground italic text-center py-10 text-sm">Discover more in our {product.category} collection.</p>
              )}
            </div>

            <div className="mt-8 md:hidden">
              <Link to={`/category/${product.category}`}>
                <Button variant="outline" className="w-full border-black text-black font-bold uppercase text-[10px] tracking-widest">
                   Explore All {product.category}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;