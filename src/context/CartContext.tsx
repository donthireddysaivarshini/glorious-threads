import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string; 
  productId: string | number;
  name: string;
  title?: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  slug: string; 
  product_type: 'REGULAR' | 'WATCH_BUY';
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity: number, size: string, color: { name: string; hex: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('gtd_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('gtd_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, quantity: number, size: string, color: { name: string; hex: string }) => {
    setCartItems((prev) => {
      const variantId = `${product.id}-${color.name}-${size}`;
      const existingItem = prev.find((item) => item.id === variantId);

      if (existingItem) {
        return prev.map((item) =>
          item.id === variantId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      // Logic to determine if it's a video product or standard product
      const isWatchBuy = product.product_type === 'WATCH_BUY' || !!product.video_url || !!product.video_file;

      const newItem: CartItem = {
        id: variantId,
        productId: product.id,
        name: product.name || product.title,
        price: Number(product.price),
        image: product.thumbnail || (product.images?.[0]?.url || product.images?.[0] || ''),
        quantity,
        selectedSize: size,
        selectedColor: color,
        slug: product.slug,
        product_type: isWatchBuy ? 'WATCH_BUY' : 'REGULAR'
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};