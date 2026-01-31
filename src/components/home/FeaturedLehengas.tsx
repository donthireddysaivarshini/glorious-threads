import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, formatPrice } from '@/data/products';

const FeaturedLehengas = () => {
  // Pull only featured lehengas directly from your products data
  const featuredLehengas = products.filter(
    (p) => p.category === 'lehengas' && p.isFeatured
  ).slice(0, 2);

  return (
    <section className="section-padding bg-secondary/30 overflow-hidden">
      <div className="container-luxury mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
         
          <h2 className="heading-section mt-2">Featured Lehengas</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Exquisite bridal and festive lehengas for your most cherished moments.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {featuredLehengas.map((lehenga, index) => (
            <motion.div
              key={lehenga.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              <Link to={`/product/${lehenga.slug}`}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={lehenga.images[0]} // Uses actual product image from your data
                    alt={lehenga.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-white/70 text-sm italic mb-2">
                      "{lehenga.description}"
                    </p>
                    <h3 className="font-display text-xl md:text-2xl text-white mb-3 uppercase tracking-wide">
                      {lehenga.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-lg font-bold text-white">
                        {formatPrice(lehenga.price)}
                      </span>
                      {lehenga.originalPrice && (
                        <span className="text-sm text-white/60 line-through">
                          {formatPrice(lehenga.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button className="btn-gold rounded-full text-xs font-bold uppercase tracking-widest">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/category/lehengas">
            <Button variant="outline" className="group border-accent text-accent hover:bg-accent hover:text-white rounded-full px-8">
              Explore All Lehengas
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLehengas;