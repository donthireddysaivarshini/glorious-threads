import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';

const CheckoutPage = () => {
  const { cartItems, subtotal } = useCart();
  const total = subtotal + (subtotal > 2000 ? 0 : 150);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="container-luxury mx-auto px-4 max-w-5xl">
          <h1 className="text-2xl font-bold text-black mb-10 uppercase tracking-widest">Checkout</h1>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Delivery Form */}
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-sm uppercase mb-6">1. Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                  <Input className="col-span-2" placeholder="Street Address" />
                  <Input placeholder="City" />
                  <Input placeholder="Pincode" />
                  <Input className="col-span-2" placeholder="Phone Number" />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm uppercase mb-6">2. Payment Method</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-black rounded flex justify-between items-center bg-black/5">
                    <span className="text-sm font-bold">Pay with Razorpay / UPI</span>
                  </div>
                  <div className="p-4 border border-gray-200 rounded flex justify-between items-center opacity-50 cursor-not-allowed">
                    <span className="text-sm font-bold">Cash on Delivery (Disabled)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Preview */}
            <div className="bg-gray-50 p-8 rounded-xl h-fit border border-gray-100">
              <h3 className="font-bold text-sm uppercase mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} (x{item.quantity})</span>
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-6 space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button className="w-full bg-primary h-14 uppercase font-bold mt-8">Pay Now</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;