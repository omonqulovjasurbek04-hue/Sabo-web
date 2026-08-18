import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, volume?: string, quantity?: number) => void;
  removeFromCart: (productId: string, volume: string) => void;
  updateQuantity: (productId: string, volume: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  discountPercent: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  totalItemCount: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sabo_cart_v1';
const FREE_DELIVERY_THRESHOLD = 150000;
const STANDARD_DELIVERY_FEE = 15000;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem('puremilk_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product: Product, volume?: string, quantity: number = 1) => {
    const selectedVol = volume || product.volumeOptions.find(v => v.isDefault)?.volume || product.volumeOptions[0].volume;
    const option = product.volumeOptions.find(v => v.volume === selectedVol) || product.volumeOptions[0];
    const price = option.price;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.selectedVolume === selectedVol
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            selectedVolume: selectedVol,
            price,
            quantity,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, volume: string) => {
    setItems(prev => prev.filter(item => !(item.product.id === productId && item.selectedVolume === volume)));
  };

  const updateQuantity = (productId: string, volume: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, volume);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId && item.selectedVolume === volume) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SABO10' || cleanCode === 'TABIIY' || cleanCode === 'SABO' || cleanCode === 'SABOMILK' || cleanCode === 'PURE10') {
      setPromoCode(cleanCode);
      setDiscountPercent(10);
      return true;
    }
    return false;
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);

  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        promoCode,
        applyPromoCode,
        discountPercent,
        subtotal,
        deliveryFee,
        discountAmount,
        totalAmount,
        totalItemCount,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountNeededForFreeDelivery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
