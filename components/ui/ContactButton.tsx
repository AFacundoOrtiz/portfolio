"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Check, Copy } from "lucide-react";

export function ContactButton() {
  const [copied, setCopied] = useState(false);
  const email = "urban12the@gmail.com";

  const handleInteraction = () => {
    // 1. Copiar al portapapeles
    navigator.clipboard.writeText(email);
    
    // 2. Cambiar el estado para mostrar feedback visual
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // 3. Intentar abrir el cliente de correo (opcional, pero recomendado)
    window.location.href = `mailto:${email}`;
  };

  return (
    <Button onClick={handleInteraction} className="min-w-[140px]">
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" /> Email Copiado
        </>
      ) : (
        <>
          <Mail className="mr-2 h-4 w-4" /> Contactarme
        </>
      )}
    </Button>
  );
}