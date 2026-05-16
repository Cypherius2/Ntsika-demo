'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Order } from '@/lib/types';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { 
  Package, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Truck,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export default function AdminOrdersPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  const updateOrderStatus = async (order: Order, newStatus: Order['status']) => {
    setUpdatingId(order.id);
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Trigger notification
      await fetch('/api/notifications/order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: order.email,
          orderNumber: order.orderNumber,
          status: newStatus,
          customerName: order.customerName
        })
      });

    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!authLoading && !isAdmin) {
    return (
      <div className="min-h-screen bg-bakery-cream flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-bakery-brown mb-4">Access Denied.</h1>
          <p className="text-bakery-brown/40">You do not have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bakery-cream pt-32 pb-20 px-6">
      <Navbar />
      <div className="container mx-auto">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-gold mb-4">Headquarters</p>
              <h1 className="text-6xl font-serif font-bold text-bakery-brown">Order <span className="text-bakery-gold italic">Control.</span></h1>
           </div>
           <div className="flex gap-4">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-bakery-brown/20 group-hover:text-bakery-gold transition-colors" size={20} />
                <input placeholder="Search orders..." className="bg-white border border-bakery-brown/5 rounded-[28px] pl-16 pr-8 h-16 w-full md:w-80 outline-none focus:ring-4 focus:ring-bakery-gold/10 transition-all font-bold text-sm" />
              </div>
           </div>
        </header>

        {loading ? (
          <div className="py-40 text-center"><Loader2 size={40} className="animate-spin mx-auto text-bakery-gold" /></div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div 
                  layout
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[40px] p-8 md:p-12 border border-bakery-brown/5 shadow-xl hover:border-bakery-gold/20 transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Header Info */}
                    <div className="lg:w-1/4">
                       <div className="flex items-center gap-4 mb-6">
                          <span className="font-mono font-bold text-2xl text-bakery-brown">#{order.orderNumber}</span>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                            order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 
                            order.status === 'processing' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {order.status}
                          </span>
                       </div>
                       <p className="text-xl font-serif font-bold text-bakery-brown mb-2">{order.customerName}</p>
                       <p className="text-sm font-medium text-bakery-brown/40 mb-6">{order.email}</p>
                       <div className="flex items-center gap-2 text-bakery-gold/60 text-xs font-bold uppercase tracking-widest">
                          <Clock size={14} />
                          {order.createdAt?.seconds ? format(new Date(order.createdAt.seconds * 1000), 'MMM d, h:mm a') : 'Just now'}
                       </div>
                    </div>

                    {/* Items */}
                    <div className="lg:w-2/4 bg-bakery-cream/30 rounded-[32px] p-8 space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-widest text-bakery-brown/20 mb-4">Line Items</p>
                       {order.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-start pb-4 border-b border-bakery-brown/5 last:border-0 last:pb-0">
                            <div className="flex gap-4">
                               <span className="font-mono text-sm text-bakery-gold font-bold">{item.quantity}x</span>
                               <div>
                                  <p className="font-bold text-bakery-brown">{item.name}</p>
                                  {item.customization && (
                                    <p className="text-[10px] text-bakery-brown/40 uppercase tracking-widest mt-1">
                                       {item.customization.flavor} • {item.customization.frosting}
                                       {item.customization.decorations.length > 0 && ` • ${item.customization.decorations.join(', ')}`}
                                       {item.customization.message && ` • "${item.customization.message}"`}
                                    </p>
                                  )}
                               </div>
                            </div>
                            <span className="font-mono text-sm font-bold">E{(item.price * item.quantity).toFixed(2)}</span>
                         </div>
                       ))}
                       <div className="pt-4 flex justify-between items-center">
                          <span className="font-serif font-bold text-xl">Total</span>
                          <span className="text-3xl font-serif font-bold text-bakery-gold">E{order.totalAmount.toFixed(2)}</span>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/4 flex flex-col gap-3">
                       <p className="text-[10px] font-black uppercase tracking-widest text-bakery-brown/20 mb-4">Set Status</p>
                       {updatingId === order.id ? (
                         <div className="flex items-center justify-center p-8 bg-bakery-gold/5 rounded-3xl">
                            <Loader2 size={24} className="animate-spin text-bakery-gold" />
                         </div>
                       ) : (
                         <>
                           <button 
                             onClick={() => updateOrderStatus(order, 'processing')}
                             className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${order.status === 'processing' ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                           >
                             <Truck size={16} /> Baking
                           </button>
                           <button 
                             onClick={() => updateOrderStatus(order, 'completed')}
                             className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${order.status === 'completed' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                           >
                             <CheckCircle2 size={16} /> Completed
                           </button>
                           <button 
                             onClick={() => updateOrderStatus(order, 'cancelled')}
                             className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${order.status === 'cancelled' ? 'bg-red-600 text-white shadow-lg' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                           >
                             <XCircle size={16} /> Cancelled
                           </button>
                         </>
                       )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
