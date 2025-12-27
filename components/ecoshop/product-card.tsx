'use client';

import { motion } from 'framer-motion';
import { Leaf, Droplets, ShoppingCart, Terminal, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Product, EcoBadgeLevel } from '@/types/ecoshop';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { useState } from 'react';

const BADGE_CONFIG: Record<EcoBadgeLevel, { color: string; dotColor: string; label: string; glow: string; borderColor: string }> = {
  'NEUTRAL': { 
    color: 'text-teal-400', 
    dotColor: 'bg-teal-400', 
    label: 'Carbono Neutral',
    glow: 'group-hover:shadow-teal-500/50',
    borderColor: 'group-hover:border-teal-500/50'
  },
  'HIGH': { 
    color: 'text-green-500', 
    dotColor: 'bg-green-500',
    label: 'Alta Sostenibilidad',  
    glow: 'group-hover:shadow-green-500/50',
    borderColor: 'group-hover:border-green-500/50'
  },
  'MEDIUM': { 
    color: 'text-yellow-400', 
    dotColor: 'bg-yellow-400',
    label: 'Eco-Friendly',   
    glow: 'group-hover:shadow-yellow-500/50',
    borderColor: 'group-hover:border-yellow-500/50'
  },
  'LOW': { 
    color: 'text-orange-500', 
    dotColor: 'bg-orange-500',
    label: 'Producto Estándar',    
    glow: 'group-hover:shadow-orange-500/50',
    borderColor: 'group-hover:border-orange-500/50'
  },
};

export const ProductCard = ({ 
  product, 
  onOpenJson 
}: { 
  product: Product; 
  onOpenJson: (product: Product) => void; 
}) => {
  const [quantity, setQuantity] = useState(1);
  const impact = product.environmentalImpact || { carbonFootprint: 0, waterUsage: 0, ecoBadgeLevel: 'LOW' };
  const { carbonFootprint, waterUsage, ecoBadgeLevel } = impact;
  const config = BADGE_CONFIG[ecoBadgeLevel] || BADGE_CONFIG['LOW'];

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} agregados al carrito`);
    setQuantity(1);
  };

  const adjustQuantity = (e: React.MouseEvent, amount: number) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative w-full h-[400px] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 transition-all duration-300",
        config.glow,
        config.borderColor
      )}
    >
      <div className="relative h-full w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-40"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-2 shadow-lg z-10">
           <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${config.dotColor}`} />
           <span className={config.color}>{config.label}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent transition-transform duration-300 group-hover:-translate-y-2">
        <h3 className="text-xl font-bold text-white mb-1 truncate">{product.name}</h3>
        <p className="text-neutral-400 text-sm mb-2">{product.brand?.name || 'EcoBrand'}</p>
        <div className="text-2xl font-light text-white">${Number(product.price).toFixed(2)}</div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 bg-black/60 backdrop-blur-sm">
        
        <div className="w-full space-y-4">
          
           <div className="text-center mb-4">
            <h4 className="text-sm uppercase tracking-widest text-neutral-400 font-semibold border-b border-neutral-700 pb-2">
              Huella Ambiental
            </h4>
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-sm">Emisiones CO₂</span>
            </div>
            <span className="font-mono text-lg font-bold">{carbonFootprint} kg</span>
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Uso de Agua</span>
            </div>
            <span className="font-mono text-lg font-bold">{waterUsage} L</span>
          </div>
          <div className="w-full h-1 bg-neutral-700 rounded-full mt-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8 }}
              className={cn("h-full", config.color.replace('text-', 'bg-'))} 
            />
          </div>
          
          <div className="flex flex-col gap-3 mt-4 w-full">
            
            <div className="flex items-center justify-between bg-black/40 rounded-full p-1 border border-white/10 w-32 mx-auto backdrop-blur-md shadow-inner">
              <button 
                onClick={(e) => adjustQuantity(e, -1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white transition-all disabled:opacity-30 active:scale-90"
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
    
              <span className="font-mono font-bold text-white text-lg w-8 text-center tabular-nums shadow-black drop-shadow-md">
                {quantity}
              </span>
    
              <button 
                onClick={(e) => adjustQuantity(e, 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all active:scale-90 border border-emerald-500/30 hover:border-emerald-500"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleAddToCart}
                className="flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-wider
                  bg-white text-black hover:bg-neutral-200 
                  transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                Añadir {quantity > 1 ? `(${quantity})` : ''}
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); onOpenJson(product); }}
                className="py-2 px-3 rounded-lg font-mono text-xs font-bold uppercase
                  border border-white/20 bg-white/5 text-white 
                  hover:bg-white/10 hover:border-white/40
                  transition-all duration-200 flex items-center justify-center"
              >
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};