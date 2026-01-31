import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { getProductsByCategory } from '@/data/products';

const KidsCollection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const kidsProducts = getProductsByCategory('kids');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="section-padding bg-[#FFF9F0] overflow-hidden relative border-t border-pink-50">
      {/* Matte Decorative Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container-luxury mx-auto relative z-10">
        {/* Section Header - Matched to New Arrivals Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-8"
        >
          <div>
            <span className="tagline-gold flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              For Your Little Ones
            </span>
            <h2 className="heading-section mt-1 text-black">Little Royalty</h2>
            <p className="text-muted-foreground mt-2 max-w-md italic">
              Adorable ethnic wear for your little princes and princesses. Make every occasion magical.
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border hover:border-accent hover:text-accent"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border hover:border-accent hover:text-accent"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <Link to="/category/kids" className="hidden md:block">
              <Button variant="ghost" className="group text-black hover:text-primary font-bold uppercase text-xs tracking-widest">
                View All
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Kids Carousel - Using Real Product Images */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4"
        >
          {kidsProducts.map((product, index) => (
            <div key={product.id} className="flex-shrink-0 w-64 md:w-72">
              {/* ProductCard component automatically uses product.images[0] */}
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center md:hidden">
          <Link to="/category/kids">
            <Button variant="outline" className="group border-accent text-accent font-bold uppercase text-xs rounded-full px-8">
              Shop Kids Collection
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default KidsCollection;