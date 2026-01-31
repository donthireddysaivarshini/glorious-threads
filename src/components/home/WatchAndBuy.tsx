import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getInstagramPicks } from '@/data/products';

const WatchAndBuy = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const products = getInstagramPicks();

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
    <section className="section-padding bg-[#FFF9F9]">
      <div className="container-luxury mx-auto">
        {/* Section Header - Styled like New Arrivals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-8"
        >
          <div>
            
            <h2 className="heading-section mt-2">Watch & Buy</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              See our threads in motion. Tap any reel to shop the look directly.
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
            <Link to="/collections/watch-and-buy" className="hidden md:block">
              <Button variant="ghost" className="group text-primary hover:text-primary">
                View All
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Carousel Logic */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 md:w-72">
               <Link to={`/product/${product.slug}`} className="block group relative aspect-[9/16] rounded-xl overflow-hidden shadow-sm bg-white border border-pink-50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-black/10" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[10px] font-bold uppercase line-clamp-1">{product.name}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center md:hidden">
          <Link to="/collections/watch-and-buy">
            <Button variant="outline" className="group border-accent text-accent">
              Follow @glorious_threads_by_divya
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WatchAndBuy;