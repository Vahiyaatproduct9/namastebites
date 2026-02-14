import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Food, Item } from '../types/types';
type CartState = {
  cart: Food[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: string) => void;
  decreaseQuantity: (itemId: string, num?: number) => void;
  // updateQuantity: (itemId: string, quantity: number) => void;
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
        })
      },
      removeFromCart: (itemId) => {
        set((state) => ({
          cart: state.cart.filter((cartItem) => cartItem.id !== itemId),
        }));
      },
      decreaseQuantity: (itemId, num) => {
        set(state => {
          const existingItem = state.cart.find(t => t.id === itemId);
          if (existingItem) {
            const newQuantity = existingItem.quantity - (num || 1);
            if (newQuantity <= 0) {
              return { cart: state.cart.filter(t => t.id !== itemId) }
            } else {
              return {
                cart: state.cart.map((t) => t.id === itemId ? { ...t, quantity: t.quantity - (num || 1) } : t)
              }
            }
          }
          return state;
        })
      },
      // updateQuantity: (itemId, quantity) => {
      //   set((state) => ({
      //     cart: state.cart
      //       .map((cartItem) =>
      //         cartItem.id === itemId ? { ...cartItem, quantity: quantity } : cartItem
      //       )
      //       .filter((cartItem) => cartItem.quantity > 0), // Remove if quantity drops to 0
      //   }));
      // },
      clearCart: () => set({ cart: [] }),
      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'namaste-bites-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
