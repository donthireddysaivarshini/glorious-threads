import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroimage1 from '@/assets/heroimage1.png'; 
import { storeService } from '@/services/api';

const HeroSection = () => {
  const [heroData, setHeroData] = useState({
    image: heroimage1,
    link: "/category/all"
  });

  useEffect(() => {
  const fetchHeroData = async () => {
    try {
      const data = await storeService.getWebContent();
      
      if (data && data.hero_slides && data.hero_slides.length > 0) {
        const topSlide = data.hero_slides[0];
        let rawPath = topSlide.image;

        if (rawPath && !rawPath.startsWith('http')) {
          // 1. Get the base domain safely
          // If VITE_API_URL is missing, we use window.location.origin as a backup
          const apiBase = import.meta.env.VITE_API_URL || window.location.origin;
          
          // 2. Extract the domain (e.g., https://api.yourdomain.com)
          const domain = apiBase.split('/api')[0].replace(/\/$/, "");
          
          // 3. Clean the path (remove leading slash to avoid double slashes)
          const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
          
          // 4. Combine them with a forced double-slash protocol fix
          // This ensures we get https:// even if the split messed up
          const finalUrl = `${domain}/${cleanPath}`;
          
          setHeroData({
            image: finalUrl,
            link: topSlide.link_url || "/category/all"
          });
          
          console.log("✅ Fixed Hero URL:", finalUrl);
        } else {
          // It's already a full URL
          setHeroData({
            image: rawPath,
            link: topSlide.link_url || "/category/all"
          });
        }
      }
    } catch (error) {
      console.error("Hero Load Error:", error);
    }
  };
  fetchHeroData();
}, []);
  return (
    <section className="relative w-full bg-white pt-28 md:pt-32">
      <div className="container-luxury mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[3/2] md:aspect-[21/8] rounded-2xl overflow-hidden shadow-2xl bg-zinc-50"
        >
          <Link to={heroData.link} className="block w-full h-full group">
            <img 
              key={heroData.image} // Re-mounts img tag when URL changes
              src={heroData.image} 
              className="w-full h-full object-cover object-center transition-opacity duration-500" 
              alt="Promotion Banner"
              onLoad={(e) => (e.currentTarget.style.opacity = "1")}
              onError={(e) => {
                console.error("Image failed to load:", heroData.image);
                e.currentTarget.src = heroimage1; // Show local fallback
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;