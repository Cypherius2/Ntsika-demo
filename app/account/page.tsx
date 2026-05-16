'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db, auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, updateDoc, doc, arrayUnion, arrayRemove, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { Order, Address } from '@/lib/types';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { 
  Package, 
  MapPin, 
  User, 
  LogOut, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function AccountPage() {
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ description: '', street: '', city: '' });
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'orders'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
        setFetchingOrders(false);
      }, (error) => {
        console.error('Error listening to orders:', error);
        setFetchingOrders(false);
      });

      return () => unsubscribe();
    } else {
      setFetchingOrders(false);
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const address: Address = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAddress,
      isDefault: profile?.addresses.length === 0
    };

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: arrayUnion(address),
        updatedAt: new Date()
      });
      setShowAddressForm(false);
      setNewAddress({ description: '', street: '', city: '' });
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (address: Address) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: arrayRemove(address),
        updatedAt: new Date()
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bakery-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-bakery-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bakery-cream pt-48 pb-32 px-6">
      <Navbar />
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-12">
            <div className="bg-white rounded-[48px] p-12 shadow-2xl shadow-bakery-gold/5 border border-bakery-gold/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <User size={80} className="text-bakery-gold/5" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-gold mb-4">Member Account</p>
                <h1 className="text-4xl font-serif font-bold text-bakery-brown mb-2">{profile?.displayName}</h1>
                <p className="text-sm font-medium text-bakery-brown/40">{profile?.email}</p>
                
                <div className="mt-12 flex flex-col gap-4">
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-4 p-6 rounded-3xl transition-all font-bold group ${activeTab === 'orders' ? 'bg-bakery-brown text-white' : 'text-bakery-brown/40 hover:bg-bakery-brown/5'}`}
                  >
                    <Package size={20} />
                    Order History
                  </button>
                  <button 
                    onClick={() => setActiveTab('addresses')}
                    className={`flex items-center gap-4 p-6 rounded-3xl transition-all font-bold group ${activeTab === 'addresses' ? 'bg-bakery-brown text-white' : 'text-bakery-brown/40 hover:bg-bakery-brown/5'}`}
                  >
                    <MapPin size={20} />
                    Saved Addresses
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 p-6 rounded-3xl transition-all font-bold text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' ? (
                <motion.section 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-4xl font-serif font-bold text-bakery-brown">Your <span className="text-bakery-gold italic">Orders.</span></h2>
                  
                  {fetchingOrders ? (
                    <div className="py-20 text-center"><div className="w-10 h-10 border-4 border-bakery-gold border-t-transparent rounded-full animate-spin mx-auto" /></div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-bakery-brown/5">
                      <Package size={48} className="mx-auto text-bakery-gold/20 mb-6" />
                      <p className="font-bold text-bakery-brown/40 uppercase tracking-widest text-xs">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[40px] p-8 md:p-10 border border-bakery-brown/5 shadow-xl shadow-bakery-gold/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-bakery-gold/20 transition-all">
                          <div className="flex gap-8 items-center">
                            <div className="w-20 h-20 bg-bakery-cream rounded-3xl flex items-center justify-center text-bakery-gold border border-bakery-brown/5">
                              <ShoppingBag size={32} className="" />
                            </div>
                            <div>
                               <div className="flex items-center gap-3 mb-2">
                                  <span className="font-mono font-bold text-bakery-brown text-lg">#{order.orderNumber}</span>
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                    order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                                    order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                  }`}>
                                    {order.status}
                                  </span>
                               </div>
                               <p className="text-sm font-medium text-bakery-brown/40">
                                  {order.createdAt?.seconds ? format(new Date(order.createdAt.seconds * 1000), 'MMMM d, yyyy') : 'Recently'}
                               </p>
                               <div className="mt-4 space-y-1">
                                  {order.items?.map((item, idx) => (
                                    <div key={idx} className="text-[10px] font-bold text-bakery-brown/60 flex flex-col">
                                       <span className="uppercase tracking-widest">{item.quantity}x {item.name}</span>
                                       {item.customization && (
                                         <span className="text-bakery-gold/60 lowercase italic">
                                            ({item.customization.flavor}, {item.customization.frosting})
                                         </span>
                                       )}
                                    </div>
                                  ))}
                               </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-12 border-t md:border-none pt-6 md:pt-0">
                            <p className="text-3xl font-serif font-bold text-bakery-gold">E{order.totalAmount.toFixed(2)}</p>
                            <button className="w-14 h-14 bg-bakery-cream rounded-2xl flex items-center justify-center text-bakery-brown/20 group-hover:text-bakery-gold group-hover:bg-bakery-gold/5 transition-all">
                               <ChevronRight size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.section>
              ) : (
                <motion.section 
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-4xl font-serif font-bold text-bakery-brown">Saved <span className="text-bakery-gold italic">Addresses.</span></h2>
                    <Button onClick={() => setShowAddressForm(!showAddressForm)} size="sm" className="rounded-full h-12 shadow-md">
                        {showAddressForm ? 'Close' : 'Add New'}
                    </Button>
                  </div>

                  {showAddressForm && (
                     <motion.form 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       onSubmit={handleAddAddress}
                       className="bg-white rounded-[40px] p-10 border-2 border-bakery-gold shadow-2xl mb-12 space-y-6"
                     >
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-brown/30 px-2">Label</label>
                              <input 
                                required 
                                placeholder="Home, Office, etc." 
                                className="w-full bg-bakery-cream/50 p-6 rounded-2xl border border-bakery-brown/5 focus:ring-4 focus:ring-bakery-gold/10 outline-none transition-all font-bold"
                                value={newAddress.description}
                                onChange={e => setNewAddress({...newAddress, description: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-brown/30 px-2">City</label>
                              <input 
                                required 
                                placeholder="Mbabane, Manzini..." 
                                className="w-full bg-bakery-cream/50 p-6 rounded-2xl border border-bakery-brown/5 focus:ring-4 focus:ring-bakery-gold/10 outline-none transition-all font-bold"
                                value={newAddress.city}
                                onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-brown/30 px-2">Detailed Street Address</label>
                            <input 
                              required 
                              placeholder="House number, street name..." 
                              className="w-full bg-bakery-cream/50 p-6 rounded-2xl border border-bakery-brown/5 focus:ring-4 focus:ring-bakery-gold/10 outline-none transition-all font-bold"
                              value={newAddress.street}
                              onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                            />
                        </div>
                        <Button type="submit" className="w-full rounded-2xl h-16">Add Address</Button>
                     </motion.form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile?.addresses.map((addr) => (
                      <div key={addr.id} className="bg-white rounded-[40px] p-10 border border-bakery-brown/5 shadow-xl shadow-bakery-gold/5 relative group">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-gold">{addr.description}</span>
                          <button 
                            onClick={() => handleDeleteAddress(addr)}
                            className="p-3 text-bakery-brown/20 hover:text-red-500 transition-colors bg-bakery-cream rounded-xl"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="font-bold text-xl text-bakery-brown mb-2">{addr.street}</p>
                        <p className="text-sm font-medium text-bakery-brown/40">{addr.city}</p>
                        
                        {addr.isDefault && (
                          <div className="mt-6 flex items-center gap-2 text-emerald-600">
                            <CheckCircle2 size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Default Address</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {!showAddressForm && (
                      <button 
                        onClick={() => setShowAddressForm(true)}
                        className="bg-bakery-cream rounded-[40px] border-2 border-dashed border-bakery-brown/10 p-10 flex flex-col items-center justify-center gap-4 group hover:bg-bakery-gold/5 hover:border-bakery-gold/20 transition-all text-bakery-brown/20 hover:text-bakery-gold"
                      >
                        <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
                          <Plus size={24} />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-widest">New Address</span>
                      </button>
                    )}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

// Minimal ShoppingBag component for the history row
const ShoppingBag = ({ size, className = "" }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
