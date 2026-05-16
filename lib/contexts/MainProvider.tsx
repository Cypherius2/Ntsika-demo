'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
};
