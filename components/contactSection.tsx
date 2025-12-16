"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Loader2, Mail, AlertCircle } from "lucide-react";
import { sendEmail } from "@/app/actions/sendEmail";

interface ContactSectionProps {
  variants: Variants;
}

export function ContactSection({ variants }: ContactSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    const formData = new FormData(event.currentTarget);
    const result = await sendEmail(formData);

    setIsLoading(false);
    if (result.success) {
      setStatus("success");
      (event.target as HTMLFormElement).reset();
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
    }
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
      className="mb-24 scroll-mt-24"
      id="contact"
    >
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-3xl font-bold flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" /> Contacto
        </h3>
        <div className="h-px bg-border flex-1" />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center space-y-6">
          <h4 className="text-4xl font-extrabold tracking-tight">
            ¿Tienes un proyecto <span className="text-primary">en mente?</span>
          </h4>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Estoy disponible para nuevas oportunidades laborales y colaboraciones freelance. 
            Si buscas un backend sólido o una arquitectura escalable, hablemos.
          </p>
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/30 w-fit px-4 py-2 rounded-full border border-border">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Disponible para trabajar
          </div>
        </div>

        <Card className="border-muted bg-card/40 backdrop-blur-md shadow-glow">
          <CardHeader>
            <CardTitle>Envíame un mensaje</CardTitle>
            <CardDescription>Te responderé a la brevedad posible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Tu nombre" 
                  required 
                  className="bg-background/50 focus-visible:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="tu@email.com" 
                  required 
                  className="bg-background/50 focus-visible:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder="Cuéntame sobre tu proyecto..." 
                  className="min-h-[120px] bg-background/50 focus-visible:ring-primary" 
                  required 
                />
              </div>

              <Button 
                type="submit" 
                className="w-full font-bold shadow-glow hover:translate-y-[-2px] transition-all" 
                disabled={isLoading || status === "success"}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : status === "success" ? (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                ) : status === "error" ? (
                  <AlertCircle className="mr-2 h-4 w-4" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                
                {isLoading ? "Enviando..." : status === "success" ? "¡Mensaje Recibido!" : status === "error" ? "Error al enviar" : "Enviar Mensaje"}
              </Button>
              
              {status === "error" && (
                <p className="text-xs text-destructive text-center mt-2">
                  Ocurrió un error. Por favor, inténtalo de nuevo.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}