'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/contexts/CartContext';
import { ShoppingBag, Plus, Check } from 'lucide-react';
import Image from 'next/image';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem, items } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), orderBy('name'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-bakery-cream pt-32 pb-20 px-6">
      <Navbar />
      <div className="container mx-auto">
        <header className="mb-24">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-bakery-gold mb-4 text-center">Seasonal Selection</p>
           <h1 className="text-7xl md:text-8xl font-serif font-light text-bakery-brown text-center">Curated <span className="text-bakery-gold italic">Treasures.</span></h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {products.length === 0 ? (
            <div className="col-span-full py-40 text-center">
               <p className="text-bakery-brown/20 font-bold uppercase tracking-[0.3em] text-xs underline underline-offset-8">Preheating our ovens. Products arriving shortly.</p>
            </div>
          ) : products.map((product) => {
            const inCart = items.some(i => i.productId === product.id);
            return (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] mb-8 transition-transform duration-700 hover:-translate-y-2">
                  <div className="w-full h-full rounded-[140px] overflow-hidden border border-bakery-brown/5 p-3">
                     <div className="w-full h-full rounded-[120px] overflow-hidden relative grayscale-[0.3] hover:grayscale-0 transition-all duration-700">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-bakery-brown/5 bg-bakery-cream"><ShoppingBag size={48} /></div>
                        )}
                     </div>
                  </div>
                  <Button 
                    variant="primary" 
                    className={`absolute bottom-10 right-4 w-14 h-14 rounded-full p-0 shadow-2xl transition-all duration-500 ${inCart ? 'bg-emerald-600 scale-110' : 'bg-bakery-black hover:scale-110'}`}
                    onClick={(e) => {
                       e.stopPropagation();
                       addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl });
                    }}
                  >
                    {inCart ? <Check size={20} /> : <Plus size={20} />}
                  </Button>
                </div>
                
                <div className="px-4">
                  <div className="flex justify-between items-end mb-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-gold">{product.category}</p>
                     <p className="font-mono text-xs font-bold text-bakery-brown/40">E{product.price.toFixed(2)}</p>
                  </div>
                  <h3 className="text-3xl font-serif font-light text-bakery-brown mb-3 group-hover:text-bakery-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-bakery-brown/40 leading-relaxed line-clamp-2">{product.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
