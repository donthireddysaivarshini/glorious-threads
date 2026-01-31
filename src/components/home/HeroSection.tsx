import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import hero1 from '@/assets/hero-banner2.png'; 


const images = [hero1];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { scrollY } = useScroll();
  
  // Parallax effect for the background image
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ y }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex]}
            alt="Glorious Threads Collection"
            className="w-full h-full object-cover object-center md:object-[center_20%]"
          />
        </motion.div>
      </AnimatePresence>

      {/* CREATIVE TRANSITION LAYERS */}
      
      {/* 1. Subtle Dark Gradient for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent pointer-events-none" />

      {/* 2. Bottom Multi-Color Glow (Creative Addition) */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-pink-50/40 to-transparent pointer-events-none" />

      {/* 3. The Royal Curve (Line-fix: added -mt-[1px] to overlap slightly) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180 -mb-[1px]">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-[calc(135%+1.3px)] h-[80px] md:h-[120px]"
          fill="hsl(var(--background))"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* 4. Luxury Accent Line: Triple Gradient (Pink -> Gold -> Pink) */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-4 overflow-hidden pointer-events-none">
        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_-5px_15px_rgba(212,175,55,0.6)]" />
      </div>

      {/* 5. Decorative Center Accent (Small Indian Motif feel) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-accent/30 rounded-t-full blur-sm" />
    </section>
  );
};

export default HeroSection;
