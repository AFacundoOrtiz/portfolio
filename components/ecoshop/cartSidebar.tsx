'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Trash2, Zap } from 'lucide-react'; // Agregamos icono Zap
import { toast } from 'sonner';
import { useAuth0 } from "@auth0/auth0-react";

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { useCartStore } from '@/store/cartStore';
import { processCheckout } from '@/lib/checkout-service';
// IMPORTANTE: Ajusta la ruta según donde tengas tu archivo auth.ts
import { getDemoAdminToken } from '@/app/actions/auth'; 

export function CartSidebar() {
  const { items, removeItem, getTotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      let token = "";

      // ESTRATEGIA HÍBRIDA:
      if (isAuthenticated) {
        // OPCIÓN A: Usuario real logueado
        token = await getAccessTokenSilently();
      } else {
        // OPCIÓN B: Visitante -> Usamos cuenta Demo automáticamente
        toast.info("⚡ Modo Demo: Autenticando como usuario de prueba...");
        
        const demoAuth = await getDemoAdminToken();
        
        if (!demoAuth.success || !demoAuth.token) {
          throw new Error("No se pudo activar el modo demo. Por favor inicia sesión manualmente.");
        }
        
        token = demoAuth.token;
        toast.success("Sesión Demo activa", { duration: 2000 });
      }

      toast.loading("Procesando orden con Stripe...", { id: "checkout-toast" });

      // Llamamos al servicio de checkout con el token (sea real o demo)
      const stripeUrl = await processCheckout(token, items);

      toast.success("Redirigiendo a pasarela segura...", { id: "checkout-toast" });
      
      setTimeout(() => {
        window.location.href = stripeUrl;
      }, 1000);

    } catch (error: unknown) {
      console.error(error);
      let errorMessage = "Ocurrió un error inesperado";
      if (error instanceof Error) errorMessage = error.message;

      toast.error(errorMessage, { id: "checkout-toast" });
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-indigo-500/20 hover:bg-indigo-500/10 hover:text-indigo-400">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-[400px] flex flex-col bg-neutral-950/80 backdrop-blur-xl border-l border-neutral-800 shadow-[-10px_0_30px_rgba(0,0,0,0.8)]">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-500" /> Tu Carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-10" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="group flex gap-4 p-3 rounded-lg border border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10 transition-colors items-center relative overflow-hidden">
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                   <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="object-cover"
                   />
                </div>
                <div className="flex-1 min-w-0 z-10">
                  <h5 className="text-sm font-medium text-foreground line-clamp-1" title={item.name}>
                    {item.name}
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${item.price} x {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 z-10">
                   <p className="text-sm font-mono font-bold text-indigo-400">
                     ${(item.price * item.quantity).toFixed(2)}
                   </p>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-full"
                     onClick={() => removeItem(item.id)}
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t border-white/10 pt-6 sm:flex-col gap-4">
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-muted-foreground text-sm uppercase tracking-wider">Total Estimado</span>
              <span className="text-2xl font-bold font-mono text-white">
                ${getTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6
                shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]
                transition-all duration-300 border border-white/10 rounded-xl group"
                onClick={handleCheckout}
                disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                  <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                  </span>
              ) : (
                  <span className="flex items-center gap-2">
                    {isAuthenticated ? "Proceder al Pago" : "Checkout Demo Rápido"} 
                    {!isAuthenticated && <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" />}
                  </span>
              )}
            </Button>
            
            {!isAuthenticated && (
                <p className="text-[10px] text-center text-muted-foreground">
                    * Modo Visitante: Se usará una cuenta demo automática.
                </p>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}