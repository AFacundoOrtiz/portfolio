"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";

interface Auth0ProviderWithHistoryProps {
  children: ReactNode;
}

export const Auth0ProviderWrapper = ({ children }: Auth0ProviderWithHistoryProps) => {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;

  // DEBUG: Esto te mostrará en la consola del navegador si las variables están llegando
  console.log("Auth0 Config Check:", { 
    hasDomain: !!domain, 
    hasClient: !!clientId,
    domainValue: domain // Opcional para verificar
  });

  // SI FALTAN, AVISAMOS PERO RENDERIZAMOS EL PROVIDER IGUAL
  // (Esto cambiará el error a uno de configuración de Auth0, que es más útil)
  if (!domain || !clientId) {
    console.error("❌ ERROR CRÍTICO: Faltan las variables de entorno de Auth0 en .env.local");
    // No hacemos return anticipado para evitar el error "You forgot to wrap..."
  }

  return (
    <Auth0Provider
      domain={domain || ""} // Evitamos que sea undefined
      clientId={clientId || ""}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};