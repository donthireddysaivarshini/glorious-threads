import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const WatchBuyCard = ({ item, index }: { item: any, index: number }) => {
  const discount = item.original_price 
    ? Math.round(((item.original_price - item.price) / item.original_price) * 100) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      /* FIX: Removed w-[260px] and added w-full. Added max-width to keep it elegant on desktop */
      className="relative aspect-[9/16] w-full max-w-[320px] mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-black group"
    >
      <video
        src={item.video_url}
        poster={item.thumbnail}
        autoPlay muted loop playsInline
        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
      />
      
      <Link 
        to={`/watch-and-buy/${item.slug}`} 
        /* FIX: Reduced padding on mobile so text fits better in a smaller card */
        className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-3 md:p-6"
      >
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 space-y-1 md:space-y-2">
          {/* FIX: Smaller font size on mobile (text-sm) so it doesn't wrap 4 times */}
          <h3 className="text-white font-serif text-sm md:text-lg leading-tight line-clamp-2">
            {item.name}
          </h3>
          
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            <span className="text-white font-bold text-xs md:text-base">₹{Number(item.price).toLocaleString('en-IN')}</span>
            {item.original_price && (
              <>
                <span className="text-white/40 line-through text-[10px] md:text-xs">₹{Number(item.original_price).toLocaleString('en-IN')}</span>
                <span className="bg-primary text-[8px] md:text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold">
                  {discount}%
                </span>
              </>
            )}
          </div>
          
          {/* FIX: Smaller button on mobile */}
          <Button className="w-full h-8 md:h-10 rounded-lg md:rounded-xl bg-white text-black hover:bg-primary hover:text-white font-black uppercase text-[8px] md:text-[10px] tracking-widest">
              Shop Look
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};
export default WatchBuyCard;