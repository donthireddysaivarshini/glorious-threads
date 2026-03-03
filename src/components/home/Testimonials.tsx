import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface Testimonial {
  id: number;
  user_name: string;
  location: string;
  rating: number;
  comment: string;
  product_name: string;
  date: string;
  image?: string; // This is the REVIEW image (the product/customer photo)
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/store/featured-reviews/`);
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedReviews();
  }, []);

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div>;
  if (testimonials.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[currentIndex];

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-luxury mx-auto">
        <h2 className="heading-section text-center mb-12">Customer Reviews</h2>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]"
            >
              {/* Left Side: Review Content */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  {/* Letter Avatar (Like your image) */}
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white text-xl font-bold uppercase">
                    {current.user_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground leading-none">{current.user_name}</h4>
                    <span className="text-xs text-green-600 font-semibold uppercase tracking-wider">Verified Buyer</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < current.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>

                <p className="text-gray-700 italic text-lg leading-relaxed mb-6">
                  "{current.comment}"
                </p>

                <div className="mt-auto border-t pt-4">
                  <p className="text-sm text-gray-500 font-medium">Purchased: <span className="text-primary">{current.product_name}</span></p>
                  <p className="text-xs text-gray-400">{current.date} • {current.location}</p>
                </div>
              </div>

              {/* Right Side: Review Image (Most E-comms do this) */}
              {current.image && (
                <div className="w-full md:w-2/5 relative min-h-[300px]">
                  <img 
                    src={current.image} 
                    alt="Review proof" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5" /> {/* Subtle overlay */}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <Button onClick={prev} variant="ghost" className="rounded-full h-12 w-12 border border-gray-200 hover:bg-white">
              <ChevronLeft />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <div key={i} className={`h-1.5 transition-all rounded-full ${i === currentIndex ? 'w-8 bg-black' : 'w-2 bg-gray-300'}`} />
              ))}
            </div>

            <Button onClick={next} variant="ghost" className="rounded-full h-12 w-12 border border-gray-200 hover:bg-white">
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;