"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface CartLine {
  id: string;
  slug: string;
  name: string;
  image: string;
  volume: string;
  fat: string | null;
  price: number | null;
  quantity: number;
}

export interface CartAddInput {
  id: string;
  slug: string;
  name: string;
  image: string;
  volume: string;
  fat: string | null;
  price: number | null;
  quantity?: number;
}

interface CartContextValue {
  items: CartLine[];
  totalQuantity: number;
  subtotal: number | null;
  hasPrices: boolean;
  toast: string | null;
  addItem: (item: CartAddInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  notify: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "sabo-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addItem = useCallback(
    (item: CartAddInput) => {
      setItems((current) => {
        const existing = current.find((line) => line.id === item.id);
        if (existing) {
          return current.map((line) =>
            line.id === item.id
              ? { ...line, quantity: line.quantity + Math.max(1, item.quantity ?? 1) }
              : line,
          );
        }
        return [...current, { ...item, quantity: Math.max(1, item.quantity ?? 1) }];
      });
    },
    [],
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) =>
            line.id === id ? { ...line, quantity } : line,
          ),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalQuantity = items.reduce((sum, line) => sum + line.quantity, 0);

  const hasPrices = items.every((line) => line.price !== null);
  const subtotal = hasPrices
    ? items.reduce((sum, line) => sum + (line.price ?? 0) * line.quantity, 0)
    : null;

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        subtotal,
        hasPrices,
        toast,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        notify,
      }}
    >
      {children}
      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-[calc(100vw-32px)] text-center"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      ) : null}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
