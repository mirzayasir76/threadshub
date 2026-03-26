import type { Product } from "@/data/products";
import { type ReactNode, createContext, useContext, useState } from "react";

export interface CartItem {
  product: Product;
  size: string;
  qty: number;
  cartKey: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, qty: number) => void;
  removeFromCart: (cartKey: string) => void;
  updateQty: (cartKey: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size: string, qty: number) => {
    const cartKey = `${product.id}-${size}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) =>
          i.cartKey === cartKey ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { product, size, qty, cartKey }];
    });
  };

  const removeFromCart = (cartKey: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
  };

  const updateQty = (cartKey: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.cartKey === cartKey ? { ...i, qty } : i)),
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cartItems.reduce(
    (acc, i) => acc + i.product.price * i.qty,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
