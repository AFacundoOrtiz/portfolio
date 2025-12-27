'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Trash2, Ticket, Check, Loader2, Search, AlertCircle } from 'lucide-react';
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
import { getMyCoupons } from '@/lib/wallet-service';
import { Coupon } from '@/types/ecoshop';

export function CartSidebar() {
  const { items, removeItem, getTotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [isOpen, setIsOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [hasLoadedDemoCoupons, setHasLoadedDemoCoupons] = useState(false);

  const filterValidCoupons = (list: Coupon[]) => {
    return list.filter(c => !c.isUsed && new Date(c.expiresAt) > new Date());
  };

  useEffect(() => {
    if (isAuthenticated && isOpen) {
        const loadAuthCoupons = async () => {
            setLoadingCoupons(true);
            try {
                const token = await getAccessTokenSilently();
                const myCoupons = await getMyCoupons(token);
                // APLICAMOS EL NUEVO FILTRO
                setCoupons(filterValidCoupons(myCoupons));
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingCoupons(false);
            }
        };
        loadAuthCoupons();
    }
  }, [isAuthenticated, isOpen, getAccessTokenSilently]);


  const handleLoadDemoCoupons = async () => {
    setLoadingCoupons(true);
    try {
        const demoAuth = await getDemoAdminToken();
        if (!demoAuth.success || !demoAuth.token) throw new Error("Error auth demo");
        
        const myCoupons = await getMyCoupons(demoAuth.token);
        
        console.log("📦 API Raw Coupons:", myCoupons);
        
        const activeCoupons = filterValidCoupons(myCoupons);
        
        console.log("✅ Cupones Válidos:", activeCoupons);

        setCoupons(activeCoupons);
        setHasLoadedDemoCoupons(true); 
        
        if (activeCoupons.length > 0) {
            toast.success(`¡Encontramos ${activeCoupons.length} cupones!`);
        } 

    } catch (error) {
        console.error(error);
        toast.error("Error al buscar cupones");
    } finally {
        setLoadingCoupons(false);
    }
  };


  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      let token = "";
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      } else {
        toast.info("Iniciando checkout rápido...");
        const demoAuth = await getDemoAdminToken();
        if (!demoAuth.success || !demoAuth.token) throw new Error("Error auth demo");
        token = demoAuth.token;
      }
      toast.loading("Procesando orden...", { id: "checkout-toast" });
      const stripeUrl = await processCheckout(token, items, selectedCoupon?.code);
      toast.success("Redirigiendo a Stripe...", { id: "checkout-toast" });
      setTimeout(() => window.location.href = stripeUrl, 1000);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toast.error(msg, { id: "checkout-toast" });
      setIsCheckingOut(false);
    }
  };

  const toggleCoupon = (coupon: Coupon) => {
    if (selectedCoupon?.id === coupon.id) {
      setSelectedCoupon(null);
    } else {
      setSelectedCoupon(coupon);
      toast.success(`Cupón ${coupon.code} aplicado`);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-indigo-500/20 hover:bg-indigo-500/10 hover:text-indigo-400">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (<span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center">{items.length}</span>)}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-[400px] flex flex-col bg-white/90 dark:bg-neutral-950/80 backdrop-blur-xl border-l border-gray-200 dark:border-neutral-800 shadow-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-500" /> Tu Carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 py-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 items-center">
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10">
                   <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium dark:text-white truncate">{item.name}</h5>
                  <p className="text-xs text-muted-foreground mt-1">${item.price} x {item.quantity}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                     ${(item.price * item.quantity).toFixed(2)}
                   </p>
                   <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-red-500" onClick={() => removeItem(item.id)}>
                     <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            ))
          )}
        </div>


        {items.length > 0 && (
          <SheetFooter className="border-t border-gray-200 dark:border-white/10 pt-6 sm:flex-col gap-4">
            
            <div className="w-full space-y-2 mb-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">
                  <Ticket className="w-3 h-3" /> Mis Cupones
                </div>

                {loadingCoupons && (
                    <div className="py-4 flex justify-center text-indigo-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                )}

                {!isAuthenticated && !hasLoadedDemoCoupons && !loadingCoupons && (
                    <Button 
                        onClick={handleLoadDemoCoupons}
                        variant="outline" 
                        className="w-full border-dashed border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Buscar Cupones Disponibles
                    </Button>
                )}

                {coupons.length > 0 && !loadingCoupons && (
                    <div className="grid grid-cols-1 gap-2">
                    {coupons.map((coupon) => {
                        const isSelected = selectedCoupon?.id === coupon.id;
                        return (
                        <button
                            key={coupon.id}
                            onClick={() => toggleCoupon(coupon)}
                            className={`
                            relative flex items-center justify-between p-3 rounded-lg border text-left transition-all group
                            ${isSelected 
                                ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500/50 ring-1 ring-indigo-500/50' 
                                : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-white/30'}
                            `}
                        >
                            <div>
                            <p className={`text-xs font-mono font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                {coupon.code}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                                {coupon.discountPercentage ? `${coupon.discountPercentage}% OFF` : 'Descuento especial'}
                            </p>
                            </div>
                            {isSelected ? (
                            <div className="bg-indigo-500 text-white rounded-full p-1 shadow-sm"><Check className="w-3 h-3" /></div>
                            ) : (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-indigo-500 font-medium">Usar</div>
                            )}
                        </button>
                        )
                    })}
                    </div>
                )}

                {hasLoadedDemoCoupons && coupons.length === 0 && !loadingCoupons && (
                   <div className="flex flex-col items-center justify-center py-4 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">No hay cupones válidos disponibles.</p>
                      <Button variant="link" size="sm" className="h-6 text-[10px]" onClick={handleLoadDemoCoupons}>
                        Reintentar
                      </Button>
                   </div>
                )}

            </div>

            <div className="space-y-1 w-full">
              {selectedCoupon && (
                <div className="flex justify-between items-center text-sm text-green-600 dark:text-emerald-400">
                  <span>Cupón aplicado ({selectedCoupon.code})</span>
                  <span className="font-mono font-bold">-{selectedCoupon.discountPercentage}%</span>
                </div>
              )}
              
              <div className="flex justify-between items-center w-full">
                <span className="text-gray-600 dark:text-muted-foreground text-sm uppercase tracking-wider">Total Estimado</span>
                <div className="text-right">
                  {selectedCoupon ? (
                     <div className="flex flex-col items-end">
                       <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
                         ${getTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                       </span>
                       <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                         ${(getTotal() * (1 - (selectedCoupon.discountPercentage || 0) / 100)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                       </span>
                     </div>
                  ) : (
                    <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                      ${getTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6 shadow-lg transition-all rounded-xl"
                onClick={handleCheckout}
                disabled={isCheckingOut}
            >
              {isCheckingOut ? "Procesando..." : (isAuthenticated || hasLoadedDemoCoupons ? "Proceder al Pago" : "Checkout Demo Rápido")}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}