'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/contexts/CartContext';
import { 
  ChevronRight, 
  ChevronLeft, 
  Cake as CakeIcon, 
  Check, 
  ShoppingBag,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

const STEPS = ['Size', 'Flavor', 'Frosting', 'Decorations', 'Review'];

const OPTIONS = {
  sizes: [
    { id: '6-inch', name: '6" Petite', price: 450, servings: '4-6' },
    { id: '8-inch', name: '8" Classic', price: 650, servings: '8-12' },
    { id: '10-inch', name: '10" Party', price: 850, servings: '15-20' },
    { id: 'two-tier', name: 'Two-Tier Grand', price: 1500, servings: '30-40' },
  ],
  flavors: [
    { id: 'vanilla', name: 'Madagascar Vanilla', description: 'Classic, light, and airy' },
    { id: 'chocolate', name: 'Belgian Chocolate', description: 'Rich, dark, and decadent' },
    { id: 'red-velvet', name: 'Velvet Rouge', description: 'Smooth with a hint of cocoa' },
    { id: 'lemon', name: 'Zesty Lemon', description: 'Bright and refreshing' },
  ],
  frosting: [
    { id: 'buttercream', name: 'Swiss Meringue Buttercream', description: 'Silky smooth and not too sweet' },
    { id: 'cream-cheese', name: 'Cream Cheese Frosting', description: 'Tangy and creamy' },
    { id: 'chocolate-ganache', name: 'Chocolate Ganache', description: 'Deep, intense chocolate glaze' },
  ],
  decorations: [
    { id: 'sprinkles', name: 'Gold Dust Sprinkles', price: 20 },
    { id: 'fruit', name: 'Seasonal Berries', price: 80 },
    { id: 'flowers', name: 'Edible Flowers', price: 120 },
    { id: 'macarons', name: 'Mini Macarons', price: 150 },
  ]
};

export default function CustomCakePage() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    size: OPTIONS.sizes[1].id,
    flavor: OPTIONS.flavors[0].id,
    frosting: OPTIONS.frosting[0].id,
    decorations: [] as string[],
    message: ''
  });
  const { addItem } = useCart();
  const router = useRouter();

  const currentSize = OPTIONS.sizes.find(s => s.id === config.size)!;
  const decoPrice = config.decorations.reduce((sum, d) => sum + (OPTIONS.decorations.find(opt => opt.id === d)?.price || 0), 0);
  const totalPrice = currentSize.price + decoPrice;

  const handleNext = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const handleAddToCart = () => {
    const flavor = OPTIONS.flavors.find(f => f.id === config.flavor)?.name || '';
    const frosting = OPTIONS.frosting.find(f => f.id === config.frosting)?.name || '';
    
    addItem({
      productId: `custom-cake-${Date.now()}`,
      name: `Custom ${currentSize.name} Cake`,
      price: totalPrice,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000', // Placeholder for custom cake
      customization: {
        size: currentSize.name,
        flavor,
        frosting,
        decorations: config.decorations.map(d => OPTIONS.decorations.find(opt => opt.id === d)?.name || ''),
        message: config.message,
        basePrice: currentSize.price
      }
    });
    router.push('/cart');
  };

  return (
    <main className="min-h-screen bg-bakery-cream pt-32 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Progress Header */}
          <div className="mb-16">
             <h1 className="text-5xl font-serif font-bold text-bakery-brown mb-8">Design Your <span className="text-bakery-gold italic">Masterpiece.</span></h1>
             <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-bakery-brown/5 shadow-xl shadow-bakery-gold/5">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2 px-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${step === i ? 'bg-bakery-gold text-white scale-110' : step > i ? 'bg-emerald-500 text-white' : 'bg-bakery-cream text-bakery-brown/20'}`}>
                      {step > i ? <Check size={14} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${step === i ? 'text-bakery-brown' : 'text-bakery-brown/20'}`}>{s}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-20">
            {/* Options Area */}
            <div className="lg:w-2/3 min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {step === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {OPTIONS.sizes.map(s => (
                        <button 
                          key={s.id}
                          onClick={() => setConfig({ ...config, size: s.id })}
                          className={`p-10 rounded-[40px] text-left transition-all border-2 ${config.size === s.id ? 'border-bakery-gold bg-white shadow-2xl scale-[1.02]' : 'border-transparent bg-white/50 hover:bg-white'}`}
                        >
                          <div className="font-serif text-3xl font-bold text-bakery-brown mb-2">{s.name}</div>
                          <div className="text-bakery-brown/40 font-medium mb-6">Serves {s.servings}</div>
                          <div className="font-mono font-bold text-bakery-gold">E{s.price.toFixed(2)}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-1 gap-6">
                      {OPTIONS.flavors.map(f => (
                        <button 
                          key={f.id}
                          onClick={() => setConfig({ ...config, flavor: f.id })}
                          className={`p-8 rounded-[32px] text-left transition-all border-2 flex items-center justify-between ${config.flavor === f.id ? 'border-bakery-gold bg-white shadow-xl' : 'border-transparent bg-white/50 hover:bg-white'}`}
                        >
                          <div>
                            <div className="font-serif text-2xl font-bold text-bakery-brown mb-1">{f.name}</div>
                            <div className="text-sm text-bakery-brown/40 font-medium">{f.description}</div>
                          </div>
                          {config.flavor === f.id && <div className="w-10 h-10 bg-bakery-gold rounded-full flex items-center justify-center text-white"><Check size={20} /></div>}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-1 gap-6">
                      {OPTIONS.frosting.map(f => (
                        <button 
                          key={f.id}
                          onClick={() => setConfig({ ...config, frosting: f.id })}
                          className={`p-8 rounded-[32px] text-left transition-all border-2 flex items-center justify-between ${config.frosting === f.id ? 'border-bakery-gold bg-white shadow-xl' : 'border-transparent bg-white/50 hover:bg-white'}`}
                        >
                          <div>
                            <div className="font-serif text-2xl font-bold text-bakery-brown mb-1">{f.name}</div>
                            <div className="text-sm text-bakery-brown/40 font-medium">{f.description}</div>
                          </div>
                          {config.frosting === f.id && <div className="w-10 h-10 bg-bakery-gold rounded-full flex items-center justify-center text-white"><Check size={20} /></div>}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {OPTIONS.decorations.map(d => (
                          <button 
                            key={d.id}
                            onClick={() => {
                              const decos = config.decorations.includes(d.id) 
                                ? config.decorations.filter(id => id !== d.id) 
                                : [...config.decorations, d.id];
                              setConfig({ ...config, decorations: decos });
                            }}
                            className={`p-8 rounded-[32px] text-left transition-all border-2 flex items-center justify-between ${config.decorations.includes(d.id) ? 'border-bakery-gold bg-white shadow-xl' : 'border-transparent bg-white/50 hover:bg-white'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${config.decorations.includes(d.id) ? 'bg-bakery-gold border-bakery-gold text-white' : 'border-bakery-brown/10'}`}>
                                {config.decorations.includes(d.id) && <Check size={14} />}
                              </div>
                              <span className="font-bold text-bakery-brown">{d.name}</span>
                            </div>
                            <span className="font-mono font-bold text-bakery-gold text-sm">+E{d.price.toFixed(2)}</span>
                          </button>
                        ))}
                      </div>
                      
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-brown/30 px-2 flex items-center gap-2">
                           <MessageSquare size={14} />
                           Handwritten Message (Optional)
                        </label>
                        <textarea 
                          className="w-full bg-white border border-bakery-brown/5 rounded-[32px] p-8 min-h-[120px] focus:ring-4 focus:ring-bakery-gold/10 outline-none font-medium text-bakery-brown transition-all"
                          placeholder="What would you like written on the cake? (e.g. Happy Birthday Ntsika!)"
                          value={config.message}
                          onChange={e => setConfig({...config, message: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="bg-white rounded-[48px] p-12 border border-bakery-brown/5 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-10 opacity-5">
                          <CakeIcon size={200} />
                       </div>
                       <h3 className="text-4xl font-serif font-bold text-bakery-brown mb-12">Confirm Your Recipe</h3>
                       
                       <div className="space-y-8 relative z-10">
                          <div className="grid grid-cols-2 gap-12">
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-bakery-brown/30 mb-2">Size & Structure</p>
                                <p className="text-xl font-bold text-bakery-brown">{currentSize.name}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-bakery-brown/30 mb-2">Flavor Profile</p>
                                <p className="text-xl font-bold text-bakery-brown">{OPTIONS.flavors.find(f => f.id === config.flavor)?.name}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-bakery-brown/30 mb-2">Artisanal Frosting</p>
                                <p className="text-xl font-bold text-bakery-brown">{OPTIONS.frosting.find(f => f.id === config.frosting)?.name}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-bakery-brown/30 mb-2">Decorations</p>
                                <p className="text-xl font-bold text-bakery-brown">{config.decorations.length > 0 ? config.decorations.map(d => OPTIONS.decorations.find(opt => opt.id === d)?.name).join(', ') : 'Simple & Clean'}</p>
                             </div>
                          </div>
                          
                          {config.message && (
                            <div className="bg-bakery-cream/50 p-8 rounded-3xl border border-bakery-gold/20">
                               <p className="text-[10px] font-black uppercase tracking-widest text-bakery-gold mb-2">Cake Message</p>
                               <p className="text-lg font-serif italic text-bakery-brown">&ldquo;{config.message}&rdquo;</p>
                            </div>
                          )}
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-4 mt-12">
                {step > 0 && (
                  <Button variant="outline" onClick={handleBack} className="h-20 px-12 rounded-[28px]">
                    <ChevronLeft className="mr-2" />
                    Back
                  </Button>
                )}
                {step < STEPS.length - 1 ? (
                  <Button onClick={handleNext} className="flex-grow h-20 rounded-[28px]">
                    Next Selection
                    <ChevronRight className="ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleAddToCart} className="flex-grow h-20 rounded-[28px] gap-4">
                    <ShoppingBag />
                    Add Masterpiece to Basket
                  </Button>
                )}
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:w-1/3">
               <div className="bg-bakery-brown rounded-[56px] p-12 text-white shadow-2xl sticky top-32">
                  <div className="flex items-center gap-4 mb-10 opacity-50">
                    <Sparkles size={20} className="text-bakery-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Order Summary</span>
                  </div>

                  <div className="space-y-6 mb-10 pb-10 border-b border-white/10">
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white/40">Base Cake ({currentSize.name})</span>
                        <span className="font-mono font-bold">E{currentSize.price.toFixed(2)}</span>
                     </div>
                     {config.decorations.map(dId => {
                        const d = OPTIONS.decorations.find(opt => opt.id === dId)!;
                        return (
                          <div key={dId} className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white/40">{d.name}</span>
                            <span className="font-mono font-bold text-bakery-gold">+E{d.price.toFixed(2)}</span>
                          </div>
                        );
                     })}
                  </div>

                  <div className="flex justify-between items-center">
                     <span className="text-2xl font-serif font-bold italic">Total Price</span>
                     <span className="text-5xl font-serif font-bold text-bakery-gold">E{totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="mt-12 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/20">
                     <Check className="text-emerald-500" size={14} />
                     Hand-baked specially for you
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
