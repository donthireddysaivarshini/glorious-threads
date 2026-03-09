import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storeService } from "../../services/api";
import WatchBuyCard from '@/components/product/WatchBuyCard'; // 🔥 Using the card here

const WatchAndBuy = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await storeService.getWatchBuyProducts();
        setVideos(res);
      } catch (err) { 
        console.error("Watch & Buy Load Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (videos.length === 0) return null;

  return (
    /* 🔥 REDUCED GAP: Changed section-padding to pt-8 (top) and pb-16 (bottom) */
    <section className="pt-1 pb-2 bg-[#FFF9F9] overflow-hidden">
      <div className="container-luxury mx-auto px-4">
        
        {/* HEADER - View All removed from here */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="flex items-end justify-between mb-10 px-1"
        >
          <div>
             <h2 className="heading-section mt-2 italic font-serif">Watch & Buy</h2>
             <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Curated Looks in Motion</p>
          </div>
        </motion.div>

        {/* 🔥 HORIZONTAL SCROLLING CONTAINER */}
       {/* 🔥 HORIZONTAL SCROLLING CONTAINER */}
<div className="flex overflow-x-auto gap-3 md:gap-6 pb-8 scrollbar-hide snap-x snap-mandatory px-1">
  {videos.slice(0, 6).map((item, index) => (
    /* CHANGE: w-[45%] instead of w-[70%] 
       This ensures 2 cards fit + a small gap 
    */
    <div key={item.id} className="w-[46%] sm:w-[48%] md:w-80 flex-shrink-0 snap-center">
      <WatchBuyCard item={item} index={index} />
    </div>
  ))}
</div>

        {/* 🔥 VIEW ALL BELOW PRODUCTS: Centered button added here */}
        <div className="flex justify-center mt-10">
          <Link to="/watch-and-buy">
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

export default WatchAndBuy;