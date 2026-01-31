import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin, Clock } from 'lucide-react';
import logo from '@/assets/logo.jpeg';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white/90 border-t border-white/5">
      <div className="container-luxury mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* 1. BRAND IDENTITY */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Glorious Threads by Divya Logo"
                className="h-16 w-16 rounded-full border border-white/10 shadow-lg"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white leading-none">
                  Glorious Threads
                </span>
                <span className="text-[10px] tracking-[0.3em] text-accent uppercase mt-1 font-bold">
                  by Divya
                </span>
              </div>
            </Link>

            <p className="text-sm text-white/50 leading-relaxed text-center md:text-left">
              Premium Indian ethnic wear celebrating timeless craftsmanship, elegance,
              and modern tradition.
            </p>

            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/gloriousthreads_by_divya/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-white transition-all"
              >
                <Instagram size={18} />
              </a>

              {/* Disabled placeholders for future */}
              
            </div>
          </div>

          {/* 2. SHOP */}
          <div>
            <h4 className="font-display text-base font-bold mb-6 text-white uppercase tracking-widest">
              Shop
            </h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link to="/category/sarees" className="hover:text-accent">Sarees</Link></li>
              <li><Link to="/category/lehengas" className="hover:text-accent">Lehengas</Link></li>
              <li><Link to="/category/kurta-sets" className="hover:text-accent">Kurta Sets</Link></li>
              <li><Link to="/category/gowns" className="hover:text-accent">Gowns</Link></li>
            </ul>
          </div>

          {/* 3. CONTACT DETAILS */}
          <div>
            <h4 className="font-display text-base font-bold mb-6 text-white uppercase tracking-widest">
              Contact
            </h4>

            <div className="space-y-4 text-sm text-white/60">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent" />
                <span>+91 85000 85065</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent" />
                <span className="italic">gtd@gmail.com</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-1 shrink-0" />
                <span>
                  Site No: 14, Reliable Silver Oak Layout,<br />
                  Near Zonasha Elegance Apartment,<br />
                  Dinne Anjaneya Swamy Temple Rd,<br />
                  Haralur, Karnataka – 560102
                </span>
              </div>
            </div>
          </div>

          {/* 4. BUSINESS HOURS */}
          <div>
            <h4 className="font-display text-base font-bold mb-6 text-white uppercase tracking-widest">
              Business Hours
            </h4>

            <div className="space-y-4 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-accent mt-1" />
                <div className="space-y-2">
                  <p>Monday – Friday: <strong>9:00 AM – 6:00 PM</strong></p>
                  <p>Saturday: <strong>9:00 AM – 6:00 PM</strong></p>
                  <p>Sunday: <strong>9:00 AM – 1:00 PM</strong></p>
                </div>
              </div>

              
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-white/30 font-bold">
          <p>© 2026 Glorious Threads by Divya. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
