import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { storeService } from "../../services/api";

const BestSellers = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await storeService.getProducts({ is_best_seller: true });
        setProducts(data.results || data);
      } catch (err) {
        console.error("Best Sellers Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (products.length === 0) return null;

  return (
    /* 🔥 REDUCED GAP: Changed section-padding to pt-8 (top) and pb-16 (bottom) */
    <section className="pt-8 pb-16 bg-background">
      <div className="container-luxury mx-auto px-4">
        {/* HEADER - View All removed from here */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="flex items-end justify-between mb-8 px-1"
        >
          <div>
            <h2 className="heading-section mt-2">Best Sellers</h2>
          </div>
        </motion.div>

        {/* HORIZONTAL SCROLLING CONTAINER */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 scrollbar-hide pb-4 snap-x snap-mandatory">
          {products.slice(0, 6).map((product, index) => (
            <div key={product.id} className="w-[45%] md:w-72 flex-shrink-0 snap-start">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* 🔥 VIEW ALL BELOW PRODUCTS: Centered button added here */}
        <div className="flex justify-center mt-10">
          <Link to="/collections/best-sellers">
            <Button 
              variant="outline" 
              className="group border-primary text-primary hover:bg-[#F4C430] hover:text-black font-black uppercase text-[10px] md:text-xs tracking-widest px-8 py-6 transition-all duration-300 rounded-none"
            >
              View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;