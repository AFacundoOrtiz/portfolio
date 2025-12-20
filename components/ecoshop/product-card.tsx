'use client';

import { motion } from 'framer-motion';
import { Leaf, Droplets, ShoppingCart, Info } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Utilidad standard de shadcn/ui
import type { Product, EcoBadgeLevel } from '@/types/ecoshop';

// Configuración de colores según el nivel de impacto (Tu lógica de negocio)
const BADGE_CONFIG: Record<EcoBadgeLevel, { color: string; label: string; glow: string }> = {
  'NEUTRAL': { color: 'text-emerald-400', label: 'Carbono Neutral', glow: 'group-hover:shadow-emerald-500/50 group-hover:border-emerald-500/50' },
  'HIGH':    { color: 'text-green-500',   label: 'Alto Impacto +',  glow: 'group-hover:shadow-green-500/50 group-hover:border-green-500/50' },
  'MEDIUM':  { color: 'text-yellow-400',  label: 'Impacto Medio',   glow: 'group-hover:shadow-yellow-500/50 group-hover:border-yellow-500/50' },
  'LOW':     { color: 'text-orange-500',  label: 'Bajo Impacto',    glow: 'group-hover:shadow-orange-500/50 group-hover:border-orange-500/50' },
};

export const ProductCard = ({ 
  product, 
  onOpenJson 
}: { 
  product: Product; 
  onOpenJson: (product: Product) => void; 
}) => {
  const impact = product.environmentalImpact || { carbonFootprint: 0, waterUsage: 0, ecoBadgeLevel: 'LOW' };
  const { carbonFootprint, waterUsage, ecoBadgeLevel } = impact;
  const config = BADGE_CONFIG[ecoBadgeLevel] || BADGE_CONFIG['LOW'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative w-full h-[400px] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 transition-all duration-300",
        config.glow // Aplica el efecto neón en el borde al hacer hover
      )}
    >
      {/* --- Capa de Imagen --- */}
      <div className="relative h-full w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-40"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badge Flotante Superior */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
           {config.label}
        </div>
      </div>

      {/* --- Información Básica (Siempre visible, se mueve al hover) --- */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent transition-transform duration-300 group-hover:-translate-y-2">
        <h3 className="text-xl font-bold text-white mb-1 truncate">{product.name}</h3>
        <p className="text-neutral-400 text-sm mb-2">{product.brand?.name || 'EcoBrand'}</p>
        <div className="text-2xl font-light text-white">${Number(product.price).toFixed(2)}</div>
      </div>

      {/* --- Capa de "Revelación" (Visible solo en Hover) --- */}
      <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 bg-black/60 backdrop-blur-sm">
        
        <div className="w-full space-y-4">
          <div className="text-center mb-4">
            <h4 className="text-sm uppercase tracking-widest text-neutral-400 font-semibold border-b border-neutral-700 pb-2">
              Huella Ambiental
            </h4>
          </div>

          {/* Métrica 1: CO2 */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-sm">Emisiones CO₂</span>
            </div>
            <span className="font-mono text-lg font-bold">{carbonFootprint} kg</span>
          </div>

          {/* Métrica 2: Agua */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Uso de Agua</span>
            </div>
            <span className="font-mono text-lg font-bold">{waterUsage} L</span>
          </div>

          {/* Barra decorativa basada en el nivel */}
          <div className="w-full h-1 bg-neutral-700 rounded-full mt-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8 }}
              className={cn("h-full", config.color.replace('text-', 'bg-'))} 
            />
          </div>
          
          <button 
            onClick={() => onOpenJson(product)}
            className="w-full mt-6 bg-white text-black py-2 rounded-lg font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            Ver JSON Detallado
          </button>
        </div>
      </div>
    </motion.div>
  );
};