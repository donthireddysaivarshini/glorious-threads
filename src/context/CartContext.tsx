import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/data/products';

// Define the structure of an item in the cart
interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

// Define what the Cart Context provides to the rest of the app
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, size: string, color: { name: string; hex: string }) => void;
  // These now correctly accept two arguments to match the implementation
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Adds a product to the cart or increases quantity if same ID and Size exists
  const addToCart = (product: Product, quantity: number, size: string, color: { name: string; hex: string }) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }];
    });
  };

  // Removes a specific item based on ID and Size
  const removeFromCart = (id: string, size: string) => {
    setCartItems((prev) => 
      prev.filter((item) => !(item.id === id && item.selectedSize === size))
    );
  };

  // Updates quantity for a specific item based on ID and Size
  const updateQuantity = (id: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  // Calculate the total price of all items in the cart
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        subtotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart anywhere in the app
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};