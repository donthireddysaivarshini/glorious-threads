import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black uppercase mb-10">Privacy Policy</h1>
        <div className="prose prose-zinc max-w-none text-sm leading-relaxed space-y-6">
          <p>At GTD Fashion, we are committed to protecting your privacy. This policy outlines how we collect and use your data.</p>
          
          <h2 className="text-lg font-bold uppercase">1. Information Collection</h2>
          <p>We collect personal information such as name, email, phone number, and address when you create an account or place an order.</p>

          <h2 className="text-lg font-bold uppercase">2. Payment Security</h2>
          <p>We do not store your credit card or payment information. All transactions are processed through Razorpay's secure, encrypted payment gateway.</p>

          <h2 className="text-lg font-bold uppercase">3. Data Usage</h2>
          <p>Your data is used solely to process orders, manage accounts, and send relevant updates about your purchase or our latest collections.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;