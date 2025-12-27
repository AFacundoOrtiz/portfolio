'use client';

import { useAuth0 } from "@auth0/auth0-react";
import { Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function UserMenu() {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (isLoading) {
     return (
      <Button variant="ghost" size="icon" disabled className="rounded-full">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </Button>
    );
  }

  const isDemoActive = searchParams.get('action') === 'demo_login' || searchParams.get('status') === 'success';

  if (isAuthenticated || isDemoActive) {
    return null;
  }

  const handleDemoLogin = () => {
    router.push(`${pathname}?action=demo_login`);
  };

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