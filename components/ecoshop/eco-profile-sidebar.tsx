'use client';

import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { User, Leaf, TrendingUp, History, Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { getUserProfileData } from '@/lib/user-service';
import { ImpactStats, WalletBalance, WalletTransaction } from '@/types/ecoshop';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { getDemoAdminToken } from '@/app/actions/auth';

export function EcoProfileSidebar() {
  const { isAuthenticated, getAccessTokenSilently, user, isLoading } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  const [demoToken, setDemoToken] = useState<string | null>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [data, setData] = useState<{
    impact: ImpactStats | null;
    wallet: WalletBalance | null;
    history: WalletTransaction[];
  }>({ impact: null, wallet: null, history: [] });

  useEffect(() => {
    if (isLoading) return;
    const status = searchParams.get('status');
    if (status === 'success') {
      const handleSuccess = async () => {
        clearCart();
        toast.success("¡Pago exitoso! Has ganado EcoPoints 🌱", { duration: 5000 });

        if (!isAuthenticated) {
          try {
            const res = await getDemoAdminToken();
            if (res.success && res.token) {
              setDemoToken(res.token);
              setIsDemoUser(true);
            }
          } catch (e) {
            console.error("Error auto-login demo", e);
          }
        }
        setIsOpen(true);
        setTimeout(() => {
          router.replace(window.location.pathname, { scroll: false });
        }, 1000);
      };
      handleSuccess();
    }
  }, [searchParams, isLoading, isAuthenticated, clearCart, router]);

  useEffect(() => {
    const hasToken = isAuthenticated || demoToken;
    if (isOpen && hasToken && !isLoading) {
      const loadData = async () => {
        setDataLoading(true);
        try {
          let token = demoToken;
          if (isAuthenticated) {
            token = await getAccessTokenSilently();
          }
          if (token) {
            const profileData = await getUserProfileData(token);
            setData(profileData);
          }
        } catch (error) {
          console.error(error);
          toast.error("No se pudo cargar el perfil");
        } finally {
          setDataLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, isAuthenticated, isLoading, getAccessTokenSilently, demoToken]);

  if (isLoading) return null;
  if (!isAuthenticated && !isDemoUser) return null;

  const displayUser = isDemoUser 
    ? { name: "Demo User", picture: "https://github.com/shadcn.png" } 
    : user;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-gray-600 dark:text-muted-foreground transition-colors">
          <User className={`h-5 w-5 ${data.wallet?.level ? 'text-emerald-600 dark:text-emerald-500' : ''}`} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full sm:w-[400px] 
        bg-white/90 dark:bg-neutral-950/90 
        backdrop-blur-xl 
        border-r border-gray-200 dark:border-neutral-800 
        overflow-y-auto">
         
         <SheetHeader className="mb-8">
          <SheetTitle className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <Leaf className="w-6 h-6" /> Mi Impacto Eco
          </SheetTitle>
        </SheetHeader>

        {dataLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-500" />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            
            <div className="flex items-center gap-4 p-4 rounded-xl transition-colors
                bg-gray-100 dark:bg-white/5 
                border border-gray-200 dark:border-white/10">
              <img 
                src={displayUser?.picture || "https://github.com/shadcn.png"} 
                alt="User" 
                className="w-12 h-12 rounded-full border-2 border-emerald-500"
              />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{displayUser?.name}</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> {data.wallet?.level || "Explorador"}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 shadow-lg">
               <div className="relative z-10">
                 <p className="text-emerald-100 text-sm font-medium mb-1">Eco-Wallet Balance</p>
                 <h3 className="text-4xl font-bold text-white tracking-tight">
                    {data.wallet?.balance ?? 0} <span className="text-lg font-normal opacity-80">pts</span>
                 </h3>
                 <div className="mt-4 h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/80 rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${Math.min(100, ((data.wallet?.balance || 0) / (data.wallet?.nextLevelThreshold || 1000)) * 100)}%` 
                      }} 
                    />
                 </div>
                 <p className="text-[10px] text-emerald-100 mt-2 text-right">
                    Meta: {data.wallet?.nextLevelThreshold ?? 1000} pts
                 </p>
               </div>
               <Leaf className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-colors
                    bg-white dark:bg-neutral-900 
                    border border-gray-200 dark:border-neutral-800 shadow-sm dark:shadow-none">
                  <Leaf className="w-6 h-6 text-green-600 dark:text-green-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{data.impact?.co2SavedKg.toFixed(1) ?? 0} kg</span>
                  <span className="text-xs text-gray-500 dark:text-muted-foreground">CO₂ Ahorrado</span>
               </div>
               <div className="p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-colors
                    bg-white dark:bg-neutral-900 
                    border border-gray-200 dark:border-neutral-800 shadow-sm dark:shadow-none">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{data.impact?.totalOrders ?? 0}</span>
                  <span className="text-xs text-gray-500 dark:text-muted-foreground">Órdenes Sostenibles</span>
               </div>
            </div>

            <div>
              <h5 className="text-sm font-bold text-gray-600 dark:text-muted-foreground mb-4 flex items-center gap-2">
                <History className="w-4 h-4" /> Historial Reciente
              </h5>
              <div className="space-y-3">
                {data.history.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-muted-foreground text-center py-4">Aún no tienes movimientos.</p>
                ) : (
                    data.history.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg transition-colors
                        bg-gray-50 dark:bg-neutral-900/50 
                        border border-gray-200 dark:border-neutral-800">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-900 dark:text-white font-medium truncate max-w-[150px]">{tx.description}</span>
                            <span className="text-[10px] text-gray-500 dark:text-neutral-500">{new Date(tx.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`font-mono font-bold ${tx.type === 'EARN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {tx.type === 'EARN' ? '+' : '-'}{tx.amount}
                        </span>
                    </div>
                    ))
                )}
              </div>
            </div>

          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}