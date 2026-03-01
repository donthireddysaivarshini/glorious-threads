import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black uppercase mb-10">Terms & Conditions</h1>
        <div className="prose prose-zinc max-w-none text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-lg font-bold uppercase">1. Weaving Characteristics</h2>
            <p>Please note that thread pullings and thread missings are a natural part of the traditional weaving process. These are not considered defects or damages. Our products celebrate the authenticity of handloom and powerloom craftsmanship.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase">2. Color Variation</h2>
            <p>A slight variation in color (approximately 10-15%) may occur between the digital photograph and the physical product. This is due to studio photography lighting, professional editing, and the individual screen resolution of your mobile or desktop device.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase">3. Order Acceptance</h2>
            <p>GTD Fashion reserves the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase or errors in product/pricing information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase">4. User Account</h2>
            <p>You are responsible for maintaining the confidentiality of your account details and for all activities that occur under your account.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;