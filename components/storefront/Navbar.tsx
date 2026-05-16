'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCart } from '@/lib/contexts/CartContext';
import { ShoppingBag, User, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Navbar = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bakery-cream/80 backdrop-blur-md border-b border-bakery-brown/5">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="font-serif text-3xl font-light text-bakery-brown tracking-tighter">
          INSIKA<span className="text-bakery-gold italic">.</span>
        </Link>

        <div className="flex items-center gap-12">
          {isAdmin && (
            <Link href="/admin/orders" className="font-bold text-[10px] uppercase tracking-[0.4em] text-bakery-gold hover:text-bakery-brown transition-colors">
              Studio
            </Link>
          )}
          
          <Link href="/menu" className="font-bold text-[10px] uppercase tracking-[0.4em] text-bakery-brown/40 hover:text-bakery-gold transition-colors">
            Collection
          </Link>
          
          <div className="h-4 w-[1px] bg-bakery-brown/10" />

          <div className="flex items-center gap-8">
            <Link href="/cart" className="relative group">
              <ShoppingBag size={20} strokeWidth={1.5} className="text-bakery-brown group-hover:text-bakery-gold transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-bakery-gold text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {loading ? (
              <Loader2 size={18} className="animate-spin text-bakery-brown/20" />
            ) : user ? (
              <Link href="/account" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full border border-bakery-gold/20 flex items-center justify-center group-hover:bg-bakery-gold/5 transition-colors">
                  <User size={16} strokeWidth={1.5} className="text-bakery-gold" />
                </div>
              </Link>
            ) : (
              <Link href="/account/login" className="text-[10px] font-bold uppercase tracking-[0.4em] text-bakery-brown hover:text-bakery-gold transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
