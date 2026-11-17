'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Product, ProductVariant, CartItem } from './types';

const STORAGE_KEY = 'mv-cart';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant | null, quantity?: number) => void;
  removeItem: (productId: number, variantId: number | null) => void;
  updateQuantity: (productId: number, variantId: number | null, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

function findItemIndex(items: CartItem[], productId: number, variantId: number | null): number {
  return items.findIndex(
    (item) => item.product.id === productId && (item.variant?.id ?? null) === variantId
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    // Browser storage is unavailable during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getStoredCart());
    setMounted(true);
  }, []);

  // Close the drawer whenever the route changes away from the current page
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Persist to localStorage on change
  useEffect(() => {
    if (mounted) {
      storeCart(items);
    }
  }, [items, mounted]);

  const addItem = useCallback((product: Product, variant: ProductVariant | null, quantity = 1) => {
    setItems((prev) => {
      const idx = findItemIndex(prev, product.id, variant?.id ?? null);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...prev, { product, variant, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId: number, variantId: number | null) => {
    setItems((prev) => prev.filter((item) => !(item.product.id === productId && (item.variant?.id ?? null) === variantId)));
  }, []);

  const updateQuantity = useCallback((productId: number, variantId: number | null, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => !(item.product.id === productId && (item.variant?.id ?? null) === variantId)));
      return;
    }
    setItems((prev) => {
      const idx = findItemIndex(prev, productId, variantId);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], quantity };
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const basePrice = item.product.price;
    const modifier = item.variant?.price_modifier ?? 0;
    return sum + (basePrice + modifier) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isCartOpen,
        isHydrated: mounted,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
