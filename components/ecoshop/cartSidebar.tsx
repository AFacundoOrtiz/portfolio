'use client';

import { ShoppingCart, Trash2 } from 'lucide-react';
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
import { toast } from 'sonner';
import { useState } from 'react';
import Image from 'next/image'; // <--- 1. Importante: Agregar este import

export function CartSidebar() {
  const { items, removeItem, getTotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulación de checkout
    setTimeout(() => {
        toast.success("¡Integración de pago lista para el siguiente paso!");
        setIsCheckingOut(false);
    }, 1500);
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
            <ShoppingCart className="w-5 h-5 text-primary" /> Tu Carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-lg border border-border bg-muted/30 items-center">
                
                {/* --- 2. CORRECCIÓN AQUÍ: Imagen Real --- */}
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border border-border/50">
                   <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="object-cover"
                   />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-foreground line-clamp-1" title={item.name}>
                    {item.name}
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${item.price} x {item.quantity}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                   <p className="text-sm font-mono font-bold text-primary">
                     ${(item.price * item.quantity).toFixed(2)}
                   </p>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-6 w-6 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
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
          <SheetFooter className="border-t border-border pt-4 sm:flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <span className="text-muted-foreground">Total:</span>
              <span className="text-xl font-bold font-mono text-foreground">
                ${getTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
             hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6
              shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]
              transition-all duration-300 border border-white/10"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </span>
              ) : (
                "Proceder al Pago"
              )}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}