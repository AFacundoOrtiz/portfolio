'use client';

import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { User, Leaf, TrendingUp, History, Trophy, Loader2, Gift, Ticket, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { getUserProfileData } from '@/lib/user-service';
import { getRewards, redeemReward, getMyCoupons } from '@/lib/wallet-service';
import { ImpactStats, WalletBalance, WalletTransaction, Reward, Coupon } from '@/types/ecoshop';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { getDemoAdminToken } from '@/app/actions/auth';

export function EcoProfileSidebar() {
  const { isAuthenticated, getAccessTokenSilently, user, isLoading, logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'rewards'>('profile'); 
  
  const [demoToken, setDemoToken] = useState<string | null>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [data, setData] = useState<{
    impact: ImpactStats | null;
    wallet: WalletBalance | null;
    history: WalletTransaction[];
    rewards: Reward[];
    coupons: Coupon[];
  }>({ impact: null, wallet: null, history: [], rewards: [], coupons: [] });

  useEffect(() => {
    if (isLoading) return;

    const status = searchParams.get('status');
    const action = searchParams.get('action');

    const initializeDemo = async (showWelcomeToast: boolean, clearTheCart: boolean) => {
        // 1. Si hay que limpiar carrito (Viene de Stripe)
        if (clearTheCart) {
            clearCart();
            toast.success("¡Pago exitoso! Has ganado EcoPoints 🌱", { duration: 5000 });
        } else if (showWelcomeToast) {
            // 2. Si solo es login (Viene del botón)
            toast.success("¡Bienvenido al Modo Demo!", { icon: '👋' });
        }

        // 3. Autenticación Demo (Si no es usuario Auth0)
        if (!isAuthenticated) {
            try {
                const res = await getDemoAdminToken();
                if(res.success && res.token) { 
                    setDemoToken(res.token); 
                    setIsDemoUser(true);
                }
            } catch (e) {
                console.error(e);
            }
        }
        
        // 4. Abrir Sidebar y Limpiar URL
        setIsOpen(true);
        // IMPORTANTE: Limpiamos la URL pero mantenemos el usuario en estado local
        setTimeout(() => router.replace(window.location.pathname, { scroll: false }), 1000);
    };

    if (status === 'success') {
        // ESCENARIO 1: VUELVE DE STRIPE
        initializeDemo(false, true); // No toast bienvenida (usa el de pago), Si limpiar carrito
    } else if (action === 'demo_login') {
        // ESCENARIO 2: CLICK EN ACCEDER DEMO
        initializeDemo(true, false); // Si toast bienvenida, No limpiar carrito
    }

  }, [searchParams, isLoading, isAuthenticated, clearCart, router]);

  useEffect(() => {
    const hasToken = isAuthenticated || demoToken;
    if (isOpen && hasToken && !isLoading) {
      const loadData = async () => {
        setDataLoading(true);
        try {
          let token = demoToken;
          if (isAuthenticated) token = await getAccessTokenSilently();
          
          if (token) {
            const [profile, rewardsList, couponsList] = await Promise.all([
                getUserProfileData(token),
                getRewards(token),
                getMyCoupons(token)
            ]);
            
            setData({ 
                ...profile, 
                rewards: rewardsList, 
                coupons: couponsList 
            });
          }
        } catch (error) {
          console.error(error);
          toast.error("Error cargando datos del perfil");
        } finally {
          setDataLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, isAuthenticated, isLoading, getAccessTokenSilently, demoToken]);

  // FUNCIONES DE ACCIÓN
  const handleRedeem = async (reward: Reward) => {
    if ((data.wallet?.balance || 0) < reward.costInPoints) {
        toast.error("Puntos insuficientes");
        return;
    }

    try {
        let token = demoToken;
        if (isAuthenticated) token = await getAccessTokenSilently();
        
        if (token) {
            await redeemReward(token, reward.id, reward.costInPoints);
            toast.success(`¡Canjeado! Has obtenido: ${reward.name}`);
            
            // Recargar datos para actualizar saldo
            const [profile, couponsList] = await Promise.all([
                getUserProfileData(token),
                getMyCoupons(token)
            ]);
            setData(prev => ({ ...prev, ...profile, coupons: couponsList }));
        }
    } catch (e) {
        toast.error("Error al canjear recompensa");
    }
  };

  const copyCoupon = (code: string) => {
      navigator.clipboard.writeText(code);
      toast.success("Código copiado al portapapeles");
  };

  // 2. FUNCIÓN DE LOGOUT HÍBRIDA
  const handleLogout = () => {
    if (isDemoUser) {
        // Reset local para usuario Demo
        setIsDemoUser(false);
        setDemoToken(null);
        setIsOpen(false);
        // IMPORTANTE: Limpiamos la bandera de sesión
        sessionStorage.removeItem('isDemoSession');
        toast.info("Sesión demo cerrada");
        // Recargamos para que el UserMenu vuelva a detectar el estado inicial
        window.location.reload();
    } else {
        // Logout real de Auth0
        logout({ logoutParams: { returnTo: window.location.origin } });
    }
  };

  if (isLoading) return null;
  
  // Determinamos si mostramos el trigger
  const hasToken = isAuthenticated || isDemoUser;
  if (!hasToken) return null;

  const displayUser = isDemoUser 
    ? { name: "Demo Admin", picture: "https://github.com/shadcn.png" } 
    : user;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* 3. TRIGGER PERSONALIZADO: AVATAR */}
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full h-9 w-9 border transition-all 
            ${isDemoUser 
              ? 'border-emerald-500/50 hover:border-emerald-500 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
              : 'border-gray-200 dark:border-white/10 hover:border-indigo-500'
            }`}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={displayUser?.picture} alt={displayUser?.name} />
            <AvatarFallback className={isDemoUser ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}>
              {displayUser?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>

      {/* 4. CONTENIDO CON FLEX-COL PARA EMPUJAR EL FOOTER */}
      <SheetContent side="left" className="w-full sm:w-[400px] bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-r border-gray-200 dark:border-neutral-800 overflow-y-auto flex flex-col h-full">
         
         <SheetHeader className="mb-6 flex-shrink-0">
          <SheetTitle className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <Leaf className="w-6 h-6" /> Eco-Wallet
          </SheetTitle>
        </SheetHeader>

        {/* HEADER DE USUARIO (Visual extra) */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex-shrink-0">
            <Avatar className="h-10 w-10 border border-emerald-500/30">
                <AvatarImage src={displayUser?.picture} />
                <AvatarFallback>{displayUser?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{displayUser?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {isDemoUser ? <span className="text-emerald-500 font-bold text-[10px] px-1.5 py-0.5 bg-emerald-500/10 rounded-full">DEMO</span> : user?.email}
                </p>
            </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-white/5 rounded-lg flex-shrink-0">
            <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-neutral-800 shadow text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
                Mi Impacto
            </button>
            <button 
                onClick={() => setActiveTab('rewards')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'rewards' ? 'bg-white dark:bg-neutral-800 shadow text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
                Recompensas
            </button>
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-20 flex-1">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-500" />
          </div>
        ) : (
          <div className="flex flex-col flex-1 space-y-6">
            
            {/* SALDO */}
            <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg flex-shrink-0">
                <div>
                    <p className="text-xs text-emerald-100 uppercase tracking-wider font-bold">Saldo Disponible</p>
                    <h3 className="text-3xl font-bold">{data.wallet?.balance ?? 0} pts</h3>
                </div>
                <Trophy className="w-8 h-8 text-yellow-300 opacity-80" />
            </div>

            {/* CONTENIDO SCROLLEABLE */}
            <div className="flex-1 min-h-0">
                {activeTab === 'profile' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-center">
                                <Leaf className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <span className="text-2xl font-bold dark:text-white">{data.impact?.co2SavedKg.toFixed(1)} kg</span>
                                <p className="text-xs text-muted-foreground">CO₂ Ahorrado</p>
                            </div>
                             <div className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-center">
                                <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                <span className="text-2xl font-bold dark:text-white">{data.impact?.totalOrders}</span>
                                <p className="text-xs text-muted-foreground">Órdenes</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {/* Rewards */}
                        <div>
                             <h5 className="text-sm font-bold mb-3 flex items-center gap-2 dark:text-white"><Gift className="w-4 h-4 text-purple-500" /> Canjear Puntos</h5>
                             <div className="space-y-3">
                                {data.rewards.length === 0 ? <p className="text-sm text-muted-foreground text-center">Sin recompensas.</p> : 
                                    data.rewards.map(reward => (
                                        <div key={reward.id} className="group p-4 rounded-xl border border-gray-200 dark:border-neutral-800 hover:border-emerald-500 transition-all bg-white dark:bg-neutral-900">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-sm dark:text-white">{reward.name}</h4>
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">{reward.costInPoints} pts</span>
                                            </div>
                                            <Button className="w-full h-8 text-xs bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors" onClick={() => handleRedeem(reward)} disabled={(data.wallet?.balance || 0) < reward.costInPoints}>
                                                {(data.wallet?.balance || 0) < reward.costInPoints ? 'Faltan Puntos' : 'Canjear'}
                                            </Button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 5. FOOTER CON LOGOUT */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/10 flex-shrink-0">
                 <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                </Button>
            </div>

          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}