import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 150;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="container-luxury mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-10 uppercase tracking-tighter">Shopping Bag ({cartItems.length})</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="mx-auto mb-4 text-gray-200" size={64} />
              <p className="text-muted-foreground mb-8">Your bag is currently empty.</p>
              <Link to="/"><Button className="bg-primary text-white px-10 h-12 uppercase font-bold">Discover Collections</Button></Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 pb-8 border-b border-gray-100">
                    <img src={item.images[0]} alt={item.name} className="w-24 h-32 object-cover rounded-md" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-black text-sm uppercase">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-muted-foreground hover:text-black"><X size={18} /></button>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Size: {item.selectedSize} | Color: {item.selectedColor.name}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button className="px-3 py-1 hover:bg-gray-50" onClick={() => updateQuantity(item.id, item.selectedSize, -1)}>-</button>
                          <span className="px-4 text-sm font-bold">{item.quantity}</span>
                          <button className="px-3 py-1 hover:bg-gray-50" onClick={() => updateQuantity(item.id, item.selectedSize, 1)}>+</button>
                        </div>
                        <span className="font-bold text-black">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-secondary/10 p-8 rounded-xl h-fit border border-gray-100">
                <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-widest">Order Summary</h2>
                <div className="space-y-4 text-sm border-b border-gray-100 pb-6">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                </div>
                <div className="flex justify-between text-lg font-bold text-black pt-6 mb-8 uppercase">
                  <span>Total</span><span>{formatPrice(subtotal + shipping)}</span>
                </div>
                <Link to="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white h-14 font-bold uppercase tracking-widest">
                    Checkout Now
                  </Button>
                </Link>
               
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;