'use client';

import { useState } from 'react';
import { ShieldCheck, DollarSign, ShoppingBag, Leaf, Users } from 'lucide-react';
import { AdminAccessButton } from './admin-access-button'; 
import { AdminStats } from '@/types/ecoshop';
import { toast } from 'sonner';

export function AdminDashboardDemo() {
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchAdminStats = async (authToken: string) => {
    setLoadingStats(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";
    
    try {
      const res = await fetch(`${apiUrl}/admin/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if(res.ok) {
        const jsonResponse = await res.json();
        
        const statsData = jsonResponse.data; 

        if (statsData && typeof statsData.totalRevenue === 'number') {
          setStats(statsData);
          toast.success("Métricas financieras cargadas exitosamente");
        } else {
          console.error("Estructura inesperada:", jsonResponse);
          toast.error("Formato de datos incorrecto");
        }
      } else {
        console.error("Error fetching stats:", res.status, res.statusText);
        toast.error(`Error del servidor: ${res.status}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error de conexión con el Dashboard");
    } finally {
      setLoadingStats(false);
    }
  };

  const handleToken = (newToken: string | null) => {
    if (!newToken) {
      setToken(null);
      setStats(null);
      return;
    }

    console.log("🔐 Token JWT Recibido de Auth0 (Oculto en Prod)");
    setToken(newToken);
    fetchAdminStats(newToken); 
  };

  return (
    <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-900/50 mt-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            Panel Administrativo
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            Datos sensibles protegidos por <strong>Auth0</strong> (Requiere Rol: ADMIN)
          </p>
        </div>
        
        <AdminAccessButton 
          onTokenReceived={handleToken} 
          isAuthenticated={!!token} 
        />
      </div>

      {!token && (
        <div className="h-40 flex flex-col items-center justify-center text-neutral-500 border border-dashed border-neutral-800 rounded-lg bg-black/20">
          <ShieldCheck className="w-8 h-8 mb-3 opacity-20" />
          <p className="text-sm">Autentícate para desbloquear las métricas globales</p>
        </div>
      )}

      {token && loadingStats && (
        <div className="h-40 flex items-center justify-center">
           <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
        </div>
      )}

      {token && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-indigo-400">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Ingresos</span>
              </div>
              <p className="text-2xl font-mono text-white">
                {stats?.totalRevenue?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2
                }) ?? '$0.00'}
              </p>
           </div>

           <div className="p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Órdenes</span>
              </div>
              <p className="text-2xl font-mono text-white">
                {stats?.totalOrders ?? '0'}
              </p>
           </div>

           <div className="p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <Leaf className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">CO₂ Ahorrado</span>
              </div>
              <p className="text-2xl font-mono text-white">
                {stats?.totalCo2Saved?.toFixed(1) ?? '0.0'} <span className="text-sm text-neutral-500">kg</span>
              </p>
           </div>

           <div className="p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Usuarios</span>
              </div>
              <p className="text-2xl font-mono text-white">
                {stats?.totalUsers ?? '0'}
              </p>
           </div>
        </div>
      )}
    </div>
  );
}