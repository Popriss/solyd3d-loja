"use client";

import { createContext, useContext, useReducer, useState } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const payloadId = action.payload.id;
      const payloadColor = action.payload.selectedColor || "default";
      const cartItemId = `${payloadId}_${payloadColor}`;
      
      const existingItemIndex = state.findIndex((item) => item.cartItemId === cartItemId);
      if (existingItemIndex > -1) {
        const newState = [...state];
        newState[existingItemIndex].quantity += 1;
        return newState;
      }
      return [...state, { ...action.payload, quantity: 1, cartItemId }];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.cartItemId !== action.payload.cartItemId);
    case "UPDATE_QUANTITY": {
      return state.map((item) =>
        item.cartItemId === action.payload.cartItemId
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
    }
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.salePrice || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        dispatch,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
