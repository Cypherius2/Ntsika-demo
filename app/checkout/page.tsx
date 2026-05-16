'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ChevronLeft, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.displayName || '',
    email: profile?.email || '',
    phone: profile?.phoneNumber || '',
    address: profile?.addresses.find(a => a.isDefault)?.street || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderNumber = `INS-${Math.floor(100000 + Math.random() * 900000)}`;
      await addDoc(collection(db, 'orders'), {
        userId: user?.uid || null,
        orderNumber,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items,
        totalAmount: cartTotal,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      clearCart();
      router.push('/checkout/success');
    } catch (err) {
      console.error(err);
      alert('Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bakery-cream pt-32 pb-20 px-6">
      <Navbar />
      <div className="container mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-[56px] p-12 shadow-2xl space-y-10">
          <h1 className="text-5xl font-serif font-bold text-bakery-brown mb-12">Checkout</h1>
          
          <div className="grid gap-6">
             <input required placeholder="Name" className="w-full bg-bakery-cream p-6 rounded-2xl outline-none focus:ring-2 focus:ring-bakery-gold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             <input required type="email" placeholder="Email" className="w-full bg-bakery-cream p-6 rounded-2xl outline-none focus:ring-2 focus:ring-bakery-gold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
             <input required type="tel" placeholder="Phone" className="w-full bg-bakery-cream p-6 rounded-2xl outline-none focus:ring-2 focus:ring-bakery-gold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
             <textarea required placeholder="Address" className="w-full bg-bakery-cream p-6 rounded-2xl outline-none focus:ring-2 focus:ring-bakery-gold min-h-[100px]" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div className="pt-10 border-t border-bakery-brown/5 flex items-center justify-between">
             <span className="text-2xl font-serif font-bold">Total Amount</span>
             <span className="text-4xl font-serif font-bold text-bakery-gold">E{cartTotal.toFixed(2)}</span>
          </div>

          <Button type="submit" disabled={loading || items.length === 0} className="w-full h-20 text-xl font-bold">
             {loading ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
          </Button>
        </form>
      </div>
    </main>
  );
}
