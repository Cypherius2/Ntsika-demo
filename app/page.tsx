'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Navbar } from '@/components/storefront/Navbar';
import { ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bakery-cream overflow-hidden">
      <Navbar />
      
      {/* Hero Section: Editorial Split */}
      <section className="relative min-h-[90vh] flex flex-col pt-32">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-20">
          <div className="lg:w-1/2 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-bakery-gold mb-8">Established 2024 • Eswatini</p>
              <h1 className="text-8xl md:text-[140px] font-serif font-light text-bakery-brown leading-[0.85] tracking-tighter mb-12">
                Crafting <br />
                <span className="italic text-bakery-gold">Delight.</span>
              </h1>
              <p className="text-xl font-medium text-bakery-brown/60 max-w-md mb-12 leading-relaxed">
                Experience the finest artisanal bakery in the kingdom. Every treat is a masterpiece of passion and precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/menu" className="group flex items-center gap-6 bg-bakery-black text-bakery-cream px-10 py-6 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all">
                  Shop Collection <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="/custom-cake" className="group flex items-center gap-6 bg-transparent border border-bakery-brown/20 text-bakery-brown px-10 py-6 rounded-full font-black uppercase tracking-widest hover:bg-bakery-brown hover:text-white transition-all">
                  Bespoke Cakes
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative aspect-[4/5] w-full max-w-md mx-auto"
            >
              {/* Luxury Image Frame (Placeholder style) */}
              <div className="w-full h-full bg-bakery-brown/5 rounded-[120px] overflow-hidden border border-bakery-brown/10 p-4">
                 <div className="w-full h-full rounded-[100px] overflow-hidden relative">
                    <Image 
                      src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1920&auto=format&fit=crop" 
                      alt="Artisanal Bread"
                      fill
                      className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-bakery-brown/10" />
                 </div>
              </div>
              
              {/* Decorative Floating Element */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[40px] shadow-2xl border border-bakery-brown/5 hidden md:block"
              >
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#C5A059" color="#C5A059" />)}
                </div>
                <p className="font-serif italic font-bold text-bakery-brown">&quot;The gold standard <br />of Eswatini baking.&quot;</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute right-10 bottom-20 hidden xl:block">
           <div className="flex items-center gap-6 origin-right rotate-90 translate-x-1/2">
              <span className="h-[1px] w-20 bg-bakery-brown/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-bakery-brown/40 whitespace-nowrap">Handcrafted with Pride</span>
           </div>
        </div>
      </section>

      {/* Feature Section: High Contrast */}
      <section className="bg-bakery-black py-40">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row gap-20 items-center">
              <div className="md:w-1/2">
                 <h2 className="text-5xl md:text-7xl font-serif text-bakery-cream leading-tight mb-12">
                   Artisanal <span className="italic text-bakery-gold">Excellence.</span>
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { title: "Sustainably Sourced", desc: "We use only the finest local ingredients from our Swazi farmers." },
                      { title: "Baked Fresh Daily", desc: "Every dawn brings a new batch of handcrafted perfection." },
                    ].map((item, i) => (
                      <div key={i} className="border-l border-bakery-gold/30 pl-6">
                         <p className="text-bakery-gold font-bold text-xs uppercase tracking-widest mb-4">{item.title}</p>
                         <p className="text-bakery-cream/60 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="md:w-1/2 relative">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="relative h-64 w-full rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                      <Image 
                        src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=800&auto=format&fit=crop" 
                        alt="Cake Decoration" 
                        fill 
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="relative h-64 w-full rounded-2xl overflow-hidden mt-12 grayscale hover:grayscale-0 transition-all duration-700">
                      <Image 
                        src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop" 
                        alt="Artisanal Bread" 
                        fill 
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
