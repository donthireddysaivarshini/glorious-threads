import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { storeService } from '@/services/api';

const HeroSection = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await storeService.getWebContent();
        if (data && data.hero_slides && data.hero_slides.length > 0) {
          setSlides(data.hero_slides);
        }
      } catch (error) {
        console.error("Hero Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  // --- AUTO-PLAY LOGIC ---
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides]);

  if (loading || slides.length === 0) {
    return (
      <section className="relative w-full bg-white pt-28 md:pt-32 px-4">
        <div className="container-luxury mx-auto aspect-[3/2] md:aspect-[21/8] bg-zinc-100 rounded-2xl animate-pulse" />
      </section>
    );
  }

  return (
    <section className="relative w-full bg-white pt-28 md:pt-32">
      <div className="container-luxury mx-auto px-4 relative">
        
        <div className="relative w-full aspect-[3/2] md:aspect-[21/8] rounded-2xl overflow-hidden shadow-2xl bg-zinc-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Link to={slides[currentIndex].link_url || "/category/all"} className="block w-full h-full">
                <img 
                  src={slides[currentIndex].image} 
                  className="w-full h-full object-cover object-center md:object-[center_25%] transition-transform duration-[5000ms] hover:scale-105" 
                  alt="Luxury Fashion Banner" 
                />
                
                {/* Subtle dark overlay for better text visibility if you add any later */}
                <div className="absolute inset-0 bg-black/5" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentIndex 
                      ? 'w-8 bg-[#ec4899] shadow-[0_0_10px_rgba(236,72,153,0.5)]' 
                      : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;