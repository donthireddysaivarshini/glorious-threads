import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Assets
import categorySarees from '@/assets/category-sarees.jpg';
import categoryLehengas from '@/assets/category-lehengas.jpg';
import categoryKurtas from '@/assets/category-kurtas.jpg';
import categoryMens from '@/assets/category-mens.jpg';
import categoryKids from '@/assets/category-kids.jpg';
import categoryJewellery from '@/assets/category-jewellery.jpg';

const categories = [
  { name: 'New Arrivals', image: categorySarees, href: '/collections/new-arrivals' },
  { name: 'Gowns', image: categoryMens, href: '/category/gowns' },
  { name: 'Best Seller', image: categoryJewellery, href: '/collections/best-sellers' },
  { name: 'Lehenga', image: categoryLehengas, href: '/category/lehengas' },
  { name: 'Sarees', image: categorySarees, href: '/category/sarees' },
  { name: 'Kurta Sets', image: categoryKurtas, href: '/category/kurta-sets' },
  { name: 'Kids Wear', image: categoryKids, href: '/category/kids' },
  { name: 'Banarasi', image: categorySarees, href: '/category/sarees/banarasi' },
];

const CategoryCircles = () => {
  return (
    <section className="pt-6 pb-10 md:pt-10 md:pb-16 bg-[#FFF8F8]"> {/* Creative soft background */}
      <div className="container-luxury mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 md:gap-x-10 md:gap-y-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <Link
                to={category.href}
                className="flex flex-col items-center group w-[75px] md:w-28 lg:w-32"
              >
                {/* Border with glow effect */}
                <div className="relative p-1 rounded-full border border-primary/20 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all duration-500">
                  <div className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-sm">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                    />
                  </div>
                </div>

                <h3 className="mt-3 text-center text-[10px] md:text-[12px] font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight leading-tight px-1">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;