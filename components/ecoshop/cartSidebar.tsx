'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Trash2, Zap } from 'lucide-react';
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
import { getDemoAdminToken } from '@/app/actions/auth';

export function CartSidebar() {
  const { items, removeItem, getTotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      let token = "";

      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      } else {
        toast.info("⚡ Modo Demo: Autenticando como usuario de prueba...");
        const demoAuth = await getDemoAdminToken();
        if (!demoAuth.success || !demoAuth.token) {
          throw new Error("No se pudo activar el modo demo. Por favor inicia sesión manualmente.");
        }
        token = demoAuth.token;
        toast.success("Sesión Demo activa", { duration: 2000 });
      }

      toast.loading("Procesando orden con Stripe...", { id: "checkout-toast" });
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
      
      {/* CONTENEDOR PRINCIPAL: Adaptable Claro/Oscuro */}
      <SheetContent className="w-full sm:w-[400px] flex flex-col 
        bg-white/90 dark:bg-neutral-950/80 
        backdrop-blur-xl 
        border-l border-gray-200 dark:border-neutral-800 
        shadow-xl dark:shadow-[-10px_0_30px_rgba(0,0,0,0.8)]">
        
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-500" /> Tu Carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-20 dark:opacity-10" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="group flex gap-4 p-3 rounded-lg items-center relative overflow-hidden transition-colors
                bg-gray-50 dark:bg-white/5 
                border border-gray-200 dark:border-white/5 
                hover:bg-gray-100 dark:hover:bg-white/10 
                hover:border-gray-300 dark:hover:border-white/10">
                
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent">
                   <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="object-cover"
                   />
                </div>
                
                <div className="flex-1 min-w-0 z-10">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1" title={item.name}>
                    {item.name}
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
                    ${item.price} x {item.quantity}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 z-10">
                   <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                     ${(item.price * item.quantity).toFixed(2)}
                   </p>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-7 w-7 text-gray-400 dark:text-muted-foreground hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full"
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
          <SheetFooter className="border-t border-gray-200 dark:border-white/10 pt-6 sm:flex-col gap-4">
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-gray-600 dark:text-muted-foreground text-sm uppercase tracking-wider">Total Estimado</span>
              <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                ${getTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6
                shadow-lg dark:shadow-[0_0_20px_rgba(79,70,229,0.3)] 
                transition-all duration-300 border border-transparent dark:border-white/10 rounded-xl group"
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
                <p className="text-[10px] text-center text-gray-500 dark:text-muted-foreground">
                    * Modo Visitante: Se usará una cuenta demo automática.
                </p>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}