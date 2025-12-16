"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Check, Copy } from "lucide-react";

export function ContactButton() {
  const [copied, setCopied] = useState(false);
  const email = "urban12the@gmail.com";

  const handleInteraction = () => {
    navigator.clipboard.writeText(email);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

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