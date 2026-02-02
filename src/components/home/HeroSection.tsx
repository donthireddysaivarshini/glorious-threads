import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroimage1 from '@/assets/heroimage1.png'; 

const HeroSection = () => {
  return (
    // Inside HeroSection.tsx
<section className="relative w-full bg-white pt-20 md:pt-24">
  <div className="container-luxury mx-auto px-4">
    {/* Changed aspect ratio from 21/7 to 21/9 to increase height/bottom space */}
    <div className="relative w-full aspect-[3/2] md:aspect-[21/8] rounded-2xl overflow-hidden shadow-2xl">
      
      <img 
        src={heroimage1} 
        className="w-full h-full object-cover object-[center_30%]" 
        alt="Wedding Glow Collection" 
      />

      {/* OVERLAY */}
      
    </div>
  </div>
</section>
  );
};

export default HeroSection;