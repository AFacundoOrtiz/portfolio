'use client';

import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

export function UserMenu() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const router = useRouter();
  const pathname = usePathname();
  
  // Estado local para controlar la visibilidad basado en sessionStorage
  const [isDemoSessionActive, setIsDemoSessionActive] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // CORRECCIÓN AQUÍ:
  useEffect(() => {
    // 1. Verificamos que window exista (entorno cliente)
    if (typeof window !== 'undefined') {
      const demoActive = sessionStorage.getItem('isDemoSession') === 'true';
      
      // 2. Solo actualizamos si es TRUE. Si es false, el estado inicial ya es correcto.
      if (demoActive) {
        // 3. Usamos setTimeout para diferir la actualización y evitar el error de
        // "Calling setState synchronously within an effect"
        const timer = setTimeout(() => {
          setIsDemoSessionActive(true);
        }, 0);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDemoLogin = () => {
    setIsRedirecting(true);
    // 1. Marcamos en sessionStorage que la sesión demo está activa
    sessionStorage.setItem('isDemoSession', 'true');
    // Actualizamos el estado local también para feedback inmediato
    setIsDemoSessionActive(true);
    
    // 2. Disparamos la acción mediante la URL para que el Sidebar la intercepte
    router.push(`${pathname}?action=demo_login`);
  };

  if (authLoading || isRedirecting) {
     return (
      <Button variant="ghost" size="icon" disabled className="rounded-full">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </Button>
    );
  }

  // OCULTAR BOTÓN SI: Está logueado con Auth0 O hay una sesión demo activa
  if (isAuthenticated || isDemoSessionActive) {
    return null;
  }

  return (
    <Button 
      onClick={handleDemoLogin}
      variant="ghost" 
      size="sm"
      className="gap-2 font-bold text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all rounded-full px-4"
    >
      <Zap className="w-4 h-4 text-emerald-500 animate-pulse" /> 
      <span className="hidden sm:inline">Acceder Demo</span>
    </Button>
  );
}