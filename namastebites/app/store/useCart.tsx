import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export type CartItem = MenuItem & {
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          } else {
            return {
              cart: [...state.cart, { ...item, quantity: 1 }],
            };
          }
        });
      },
      removeFromCart: (itemId) => {
        set((state) => ({
          cart: state.cart.filter((cartItem) => cartItem.id !== itemId),
        }));
      },
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          cart: state.cart
            .map((cartItem) =>
              cartItem.id === itemId ? { ...cartItem, quantity: quantity } : cartItem
            )
            .filter((cartItem) => cartItem.quantity > 0), // Remove if quantity drops to 0
        }));
      },
      clearCart: () => set({ cart: [] }),
      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'namaste-bites-cart', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
