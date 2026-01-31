import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { getBestSellers } from '@/data/products';

const BestSellers = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const products = getBestSellers();

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
    <section className="section-padding bg-background">
      <div className="container-luxury mx-auto">
        {/* Header - Exact match to New Arrivals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-8"
        >
          <div>
            
            <h2 className="heading-section mt-2">Best Sellers</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Our community's favorites. The absolute best of Indian craftsmanship.
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
            <Link to="/collections/best-sellers" className="hidden md:block">
              <Button variant="ghost" className="group text-primary hover:text-primary">
                View All
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {products.map((product, index) => (
            <div key={product.id} className="flex-shrink-0 w-64 md:w-72">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;