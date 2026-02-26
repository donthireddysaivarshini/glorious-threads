import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { orderService, authService } from '@/services/api';
import { toast } from 'sonner';

// --- HELPERS ---
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [address, setAddress] = useState({
    firstName: '', lastName: '', street: '', city: '', pincode: '', phone: ''
  });

  const total = subtotal + (subtotal > 2000 ? 0 : 150);

  const handlePayment = async () => {
    if (!address.phone || !address.street) {
      toast.error("Please fill in shipping details");
      return;
    }

    setIsProcessing(true);
    const res = await loadRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create order in our backend
      const orderData = {
        total_amount: total,
        shipping_address: `${address.firstName} ${address.lastName}, ${address.street}`,
        city: address.city,
        state: "State", // You can add a state dropdown later
        zip_code: address.pincode,
        phone: address.phone,
        items: cartItems.map(item => ({
          id: item.productId,
          title: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor.name
        }))
      };

      const backendOrder = await orderService.createCheckoutSession(orderData);

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this is in your .env
        amount: backendOrder.amount,
        currency: backendOrder.currency,
        name: "Glorious Threads",
        description: "Luxury Fashion Purchase",
        order_id: backendOrder.razorpay_order_id,
        handler: async (response: any) => {
          // 3. Verify Payment
          try {
            await orderService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment Successful!");
            clearCart();
            navigate('/profile'); // Send them to order history
          } catch (err) {
            toast.error("Signature verification failed.");
          }
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          contact: address.phone
        },
        theme: { color: "#000000" }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      toast.error(error.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="container-luxury mx-auto px-4 max-w-5xl">
          <h1 className="text-2xl font-bold text-black mb-10 uppercase tracking-widest">Checkout</h1>
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-sm uppercase mb-6">1. Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" onChange={e => setAddress({...address, firstName: e.target.value})} />
                  <Input placeholder="Last Name" onChange={e => setAddress({...address, lastName: e.target.value})} />
                  <Input className="col-span-2" placeholder="Street Address" onChange={e => setAddress({...address, street: e.target.value})} />
                  <Input placeholder="City" onChange={e => setAddress({...address, city: e.target.value})} />
                  <Input placeholder="Pincode" onChange={e => setAddress({...address, pincode: e.target.value})} />
                  <Input className="col-span-2" placeholder="Phone Number" onChange={e => setAddress({...address, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase mb-6">2. Payment Method</h3>
                <div className="p-4 border border-black rounded flex justify-between items-center bg-black/5">
                  <span className="text-sm font-bold text-zinc-800">Razorpay (Cards, UPI, Netbanking)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl h-fit border border-gray-100">
              <h3 className="font-bold text-sm uppercase mb-6">Order Summary</h3>
              {/* Mapping cart items as before */}
              <div className="border-t border-gray-200 pt-6 space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full bg-black text-white h-14 uppercase font-bold mt-8"
              >
                {isProcessing ? "Opening Secure Payment..." : "Pay with Razorpay"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;