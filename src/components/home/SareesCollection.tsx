import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard'; // Using standard ProductCard for consistency
import { getProductsByCategory } from '@/data/products';

const SareesCollection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const products = getProductsByCategory('sarees');

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
        {/* Section Header - Matched to New Arrivals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-8"
        >
          <div>
            {/* Darkened/Bolded Tagline */}
            
            {/* Heading set to Black text */}
            <h2 className="heading-section mt-1 text-black">Timeless Drapes</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              From Banarasi to Kanjivaram, discover sarees that celebrate India's weaving traditions.
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Carousel Navigation Arrows */}
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
            
            {/* View All Link (Desktop) */}
            <Link to="/category/sarees" className="hidden md:block">
              <Button variant="ghost" className="group text-black hover:text-primary font-bold uppercase text-xs tracking-widest">
                View All
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {products.map((product, index) => (
            <div key={product.id} className="flex-shrink-0 w-64 md:w-72">
              {/* ProductCard component handles names/prices - ensure name color is set to black there */}
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center md:hidden">
          <Link to="/category/sarees">
            <Button variant="outline" className="group border-accent text-accent font-bold uppercase text-xs">
              View All Sarees
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SareesCollection;