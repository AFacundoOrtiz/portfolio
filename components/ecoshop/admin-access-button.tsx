'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getDemoAdminToken } from '@/app/actions/auth';

interface AdminAccessProps {
  onTokenReceived: (token: string | null) => void;
  isAuthenticated: boolean;
}

export const AdminAccessButton = ({ onTokenReceived }: AdminAccessProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    onTokenReceived(null);
    toast.info("Sesión de demostración finalizada");
  };

  if (isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        onClick={handleLogout}
        className="border-green-500/50 text-green-500 bg-green-500/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all"
      >
        <ShieldCheck className="mr-2 h-4 w-4" />
        Admin Conectado (Click para salir)
      </Button>
    );
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await getDemoAdminToken();
      
      if (result.success && result.token) {
        onTokenReceived(result.token);
        setIsAuthenticated(true);
        toast.success("Modo Admin Activado: Token recibido de Auth0");
      } else {
        toast.error("Error al conectar con Auth0");
      }
    } catch (err) {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <Button variant="outline" className="border-green-500/50 text-green-500 bg-green-500/10 cursor-default">
        <ShieldCheck className="mr-2 h-4 w-4" />
        Acceso Admin Concedido
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleLogin} 
      disabled={isLoading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Lock className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Autenticando..." : "Simular Acceso Admin"}
    </Button>
  );
};