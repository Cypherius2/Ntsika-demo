'use client';

import React from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Home } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-bakery-cream flex flex-col items-center justify-center pt-32 pb-20">
      <Navbar />
      <div className="bg-white rounded-[72px] p-24 text-center shadow-2xl max-w-2xl mx-auto border border-bakery-gold/10">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-12 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-6xl font-serif font-bold text-bakery-brown mb-8">Order Confirmed!</h1>
        <p className="text-xl text-bakery-brown/40 mb-12 leading-relaxed">We&apos;ve received your order and we&apos;re getting your treats ready. You can track your order in your account history.</p>
        <Link href="/account">
           <Button className="h-16 px-10">View Order History</Button>
        </Link>
        <div className="mt-8">
           <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-bakery-brown/20 hover:text-bakery-gold transition-colors">Return to Home</Link>
        </div>
      </div>
    </main>
  );
}
