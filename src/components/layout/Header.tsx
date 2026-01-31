import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, Menu, UserCircle, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.jpeg'; 
import { useCart } from '@/context/CartContext';
import { products, Product, formatPrice } from '@/data/products';

const navigation = [
  { name: 'Sarees', href: '/category/sarees', subcategories: ['Silk', 'Organza', 'Banarasi'] },
  { name: 'Lehengas', href: '/category/lehengas', subcategories: ['Bridal', 'Party Wear'] },
  { name: 'Kurta Sets', href: '/category/kurta-sets', subcategories: ['Anarkalis', 'Straight Cuts'] },
  { name: 'Gowns', href: '/category/gowns', subcategories: ['Indo-Western', 'Evening Gowns'] },
  { name: 'Jewellery', href: '/category/jewellery', subcategories: ['Necklaces', 'Earrings'] },
  { name: 'Collections', href: '/collections', subcategories: ['New Arrivals', 'Best Sellers'] },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [categoryResults, setCategoryResults] = useState<typeof navigation>([]);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const { cartItems } = useCart();
  const location = useLocation();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query.length > 1) {
      const pFiltered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      ).slice(0, 5);

      const cFiltered = navigation.filter(nav => 
        nav.name.toLowerCase().includes(query)
      ).slice(0, 3);

      setProductResults(pFiltered);
      setCategoryResults(cFiltered);
    } else {
      setProductResults([]);
      setCategoryResults([]);
    }
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      if (categoryResults.length > 0) {
        navigate(categoryResults[0].href);
      } else if (productResults.length > 0) {
        navigate(`/product/${productResults[0].slug}`);
      }
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setProductResults([]);
        setCategoryResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-pink-100 shadow-sm h-20 md:h-24 flex items-center">
      <div className="container-luxury mx-auto px-4 w-full h-full">
        <div className="relative flex items-center justify-between h-full w-full gap-2">
          
          {/* LEFT: MENU & LOGO SIDE BY SIDE (RESTORED) */}
          <div className="flex items-center gap-1 md:gap-4">
            <div className="lg:hidden">
              <Button variant="ghost" className="p-1 h-10 w-10" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-7 h-7 text-primary" />
              </Button>
            </div>
            
            <Link to="/" className="flex items-center gap-2 md:gap-3 transition-transform hover:scale-[1.01]">
              <img src={logo} alt="GTD Logo" className="h-10 w-10 md:h-14 md:w-14 object-contain rounded-full border border-pink-50" />
              <div className="flex flex-col">
                <h1 className="font-display text-base md:text-xl font-bold text-primary leading-none whitespace-nowrap">Glorious Threads</h1>
                <span className="text-[8px] md:text-[10px] tracking-[0.2em] text-accent font-bold uppercase mt-0.5">by Divya</span>
              </div>
            </Link>
          </div>

          {/* CENTER: NAVIGATION (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-6 h-full mx-auto">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative h-full flex items-center group" 
                onMouseEnter={() => setHoveredNav(item.name)} 
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Link to={item.href} className="flex items-center gap-1 font-body text-[11px] xl:text-[13px] font-bold uppercase tracking-wider text-foreground hover:text-primary transition-all py-2 px-2">
                  {item.name}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${hoveredNav === item.name ? 'rotate-180' : ''}`} />
                </Link>

                <AnimatePresence>
                  {hoveredNav === item.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                      className="absolute top-[70%] left-0 min-w-[180px] bg-white rounded-xl shadow-2xl border border-pink-50 overflow-hidden py-2 z-50"
                    >
                      {item.subcategories.map((sub) => (
                        <Link 
                          key={sub} 
                          to={`${item.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-6 py-2.5 text-[11px] font-bold text-foreground hover:bg-secondary/50 hover:text-primary transition-colors border-b border-pink-50/30 last:border-0"
                        >
                          {sub}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* RIGHT: SEARCH & ACTIONS */}
          <div className="flex items-center gap-1 md:gap-3 justify-end">
            
            {/* Desktop Search */}
            <div className="hidden xl:flex relative w-40 2xl:w-56" ref={searchRef}>
              <Input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-10 pr-8 bg-secondary/20 border-pink-100 focus:border-accent rounded-full text-xs font-bold" 
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              
              <AnimatePresence>
                {(productResults.length > 0 || categoryResults.length > 0) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 w-[320px] bg-white mt-3 rounded-2xl shadow-2xl border border-pink-50 overflow-hidden z-50">
                    {categoryResults.length > 0 && (
                      <div className="p-3 bg-gray-50/50 border-b border-gray-100">
                        {categoryResults.map(cat => (
                          <Link key={cat.name} to={cat.href} className="flex items-center justify-between p-2 hover:bg-white rounded-lg group">
                            <span className="text-[11px] font-bold text-black uppercase">{cat.name}</span>
                            <ArrowUpRight className="w-3 h-3 text-accent" />
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="p-2">
                      {productResults.map(p => (
                        <Link key={p.id} to={`/product/${p.slug}`} className="flex items-center gap-3 p-2 hover:bg-secondary/30 rounded-lg">
                          <img src={p.images[0]} className="w-8 h-10 object-cover rounded shadow-sm" />
                          <div className="overflow-hidden">
                            <p className="text-[10px] font-bold text-black uppercase truncate">{p.name}</p>
                            <p className="text-[9px] text-primary font-bold">{formatPrice(p.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Search Button - Larger Icon and spacing */}
            <Button variant="ghost" className="p-1 h-10 w-10 xl:hidden" onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
              {isMobileSearchOpen ? <X className="w-8 h-8 text-primary" /> : <Search className="w-8 h-8 text-primary" />}
            </Button>

            {/* Desktop Only Profile Icon */}
            <Link to="/profile" className="hidden lg:flex h-10 w-10 items-center justify-center">
              <User className="w-7 h-7 text-primary hover:text-accent transition-colors" />
            </Link>
            
            {/* Bag Icon */}
            <Link to="/cart" className="relative h-10 w-10 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-primary hover:text-accent transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent text-white text-[9px] rounded-full flex items-center justify-center font-bold px-1 animate-pulse">
                    {cartCount}
                  </span>
                )}
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH DROPDOWN */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} 
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-pink-100 px-4 py-4 shadow-xl z-[60]"
            >
              <div className="relative">
                <Input autoFocus type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} className="h-12 pr-10 bg-secondary/30 border-pink-100 font-bold" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              {/* Mobile Results */}
              {(productResults.length > 0 || categoryResults.length > 0) && (
                <div className="mt-4 max-h-[50vh] overflow-y-auto space-y-3">
                   {categoryResults.map(cat => (
                    <Link key={cat.name} to={cat.href} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-[11px] font-bold text-black uppercase">{cat.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-accent" />
                    </Link>
                  ))}
                  {productResults.map(p => (
                    <Link key={p.id} to={`/product/${p.slug}`} className="flex items-center gap-3 py-2 border-b border-pink-50 last:border-0">
                      <img src={p.images[0]} className="w-10 h-12 object-cover rounded" />
                      <div>
                        <p className="text-[11px] font-bold text-black uppercase">{p.name}</p>
                        <p className="text-[10px] text-primary font-bold">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] bg-white p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-pink-50 flex flex-col items-center justify-center bg-secondary/10">
              <img src={logo} alt="Logo" className="h-16 w-16 rounded-full mb-3 shadow-sm" />
              <h2 className="font-display text-lg font-bold text-primary">Glorious Threads</h2>
              <span className="text-[10px] tracking-widest text-accent uppercase font-bold">by Divya</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-pink-50">
                <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 text-primary font-bold">
                  <UserCircle className="w-6 h-6" />
                  <span className="text-sm">My Account</span>
                </Link>
              </div>

              <nav className="p-4 space-y-4">
                {navigation.map((item) => (
                  <div key={item.name} className="py-2 border-b border-pink-50 last:border-0 pb-4">
                    <Link to={item.href} className="text-base font-display font-bold text-primary uppercase tracking-wide">
                      {item.name}
                    </Link>
                    <div className="flex flex-wrap gap-2 mt-3 ml-1">
                      {item.subcategories.map((sub) => (
                        <Link 
                          key={sub} 
                          to={`${item.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-[10px] bg-gray-50 border border-pink-100 px-3 py-1.5 rounded-full text-muted-foreground font-bold hover:bg-primary hover:text-white transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;