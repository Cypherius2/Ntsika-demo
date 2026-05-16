'use client';

import React from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <main className="min-h-screen bg-bakery-cream pt-48 text-center">
        <Navbar />
        <ShoppingBag size={64} className="mx-auto text-bakery-gold/20 mb-8" />
        <h1 className="text-4xl font-serif font-bold mb-8">Basket is Empty</h1>
        <Link href="/menu"><Button>Browse Menu</Button></Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bakery-cream pt-48 pb-32 px-6">
      <Navbar />
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-serif font-bold mb-16">Your <span className="text-bakery-gold italic">Basket.</span></h1>
        
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-2/3 space-y-6">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-[40px] p-8 flex items-center gap-8 border border-bakery-brown/5 shadow-xl">
                 <div className="relative w-32 h-32 rounded-3xl overflow-hidden shrink-0 bg-bakery-cream">
                    {item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" /> : <ShoppingBag />}
                 </div>
                 <div className="flex-grow">
                    <h3 className="text-2xl font-serif font-bold">{item.name}</h3>
                    <p className="font-mono font-bold text-bakery-gold">E{item.price.toFixed(2)}</p>
                    {item.customization && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-bakery-gold/10 text-bakery-gold px-3 py-1 rounded-full">{item.customization.flavor}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-bakery-gold/10 text-bakery-gold px-3 py-1 rounded-full">{item.customization.frosting}</span>
                        {item.customization.decorations.map(d => (
                          <span key={d} className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full">{d}</span>
                        ))}
                      </div>
                    )}
                 </div>
                 <div className="flex items-center gap-4 bg-bakery-cream rounded-2xl p-2">
                    <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="p-1 hover:text-bakery-gold transition-colors"><Minus size={18} /></button>
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          updateQuantity(item.productId, val);
                        }
                      }}
                      className="font-bold w-12 text-center bg-transparent outline-none focus:text-bakery-gold transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 hover:text-bakery-gold transition-colors"><Plus size={18} /></button>
                 </div>
                 <div className="text-right min-w-[100px]">
                    <p className="text-2xl font-serif font-bold">E{(item.price * item.quantity).toFixed(2)}</p>
                 </div>
                 <button onClick={() => removeItem(item.productId)} className="text-red-500/30 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3">
             <div className="bg-white rounded-[56px] p-10 border border-bakery-brown/5 shadow-2xl sticky top-32">
                <h2 className="text-3xl font-serif font-bold mb-10">Summary</h2>
                <div className="flex justify-between items-center pt-8 border-t-2 border-bakery-brown mb-10">
                   <span className="text-xl font-serif font-bold">Total</span>
                   <span className="text-4xl font-serif font-bold text-bakery-gold">E{cartTotal.toFixed(2)}</span>
                </div>
                <Link href="/checkout"><Button className="w-full h-20">Checkout <ArrowRight className="ml-4" size={20} /></Button></Link>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
