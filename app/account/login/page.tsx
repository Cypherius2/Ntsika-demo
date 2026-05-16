'use client';

import React, { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      }
      router.push('/account');
    } catch (err) {
      alert('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/account');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bakery-cream pt-32 pb-20 px-6">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white rounded-[64px] p-12 md:p-20 shadow-2xl border border-bakery-brown/5"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-bakery-brown mb-4 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join the Kitchen'}
            </h1>
            <p className="text-bakery-brown/40 font-medium tracking-tight">
              {isLogin ? 'Sign in to access your order history.' : 'Create an account for faster checkout and exclusive rewards.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-brown/30 px-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-bakery-brown/20" size={20} />
                <input 
                  required 
                  type="email" 
                  className="w-full bg-bakery-cream/50 border border-bakery-brown/5 rounded-[28px] pl-16 pr-6 p-6 text-bakery-brown focus:ring-4 focus:ring-bakery-gold/10 outline-none transition-all placeholder:text-bakery-brown/10 font-bold" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  placeholder="ntsika@example.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-brown/30 px-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-bakery-brown/20" size={20} />
                <input 
                  required 
                  type="password" 
                  className="w-full bg-bakery-cream/50 border border-bakery-brown/5 rounded-[28px] pl-16 pr-6 p-6 text-bakery-brown focus:ring-4 focus:ring-bakery-gold/10 outline-none transition-all placeholder:text-bakery-brown/10 font-bold" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-24 rounded-[32px] text-lg">
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-12 pt-10 border-t border-bakery-brown/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black uppercase tracking-widest text-bakery-brown/40 hover:text-bakery-gold transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
