import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black uppercase mb-10 tracking-tight">Shipping Policy</h1>
        
        <div className="space-y-12">
          {/* Shipping Timelines */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="border border-zinc-100 p-8 rounded-3xl">
              <Clock className="text-primary mb-4" size={32} />
              <h3 className="font-black uppercase text-sm mb-2">Processing Time</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Orders are typically processed and dispatched within 2–4 business days.
              </p>
            </div>
            <div className="border border-zinc-100 p-8 rounded-3xl">
              <Truck className="text-primary mb-4" size={32} />
              <h3 className="font-black uppercase text-sm mb-2">Delivery Time</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Domestic orders usually arrive within 5–7 business days after dispatch. International shipping timelines vary by location (typically 10–15 days).
              </p>
            </div>
          </section>

          {/* Shipping Rates */}
          <section className="bg-zinc-50 p-8 rounded-3xl">
            <h2 className="font-black uppercase text-lg mb-4 flex items-center gap-2">
              <MapPin size={20} /> Shipping Charges
            </h2>
            <p className="text-sm text-zinc-600 mb-4">
              Shipping charges are calculated at checkout based on your delivery location and order value. 
            </p>
            <div className="bg-white p-4 rounded-xl inline-block border border-zinc-200">
              <p className="text-xs font-bold text-primary uppercase">Note: Free shipping may apply on orders above a specific value (refer to checkout).</p>
            </div>
          </section>

          {/* Secure Packaging */}
          <section className="space-y-4">
            <h2 className="font-black uppercase text-lg flex items-center gap-2">
              <ShieldCheck size={20} /> Secure Delivery
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Every order from GTD Fashion is packed with extreme care to ensure it reaches you in perfect condition.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;