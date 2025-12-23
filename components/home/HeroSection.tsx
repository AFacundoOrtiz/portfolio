"use client";

import { motion } from "framer-motion";
import { FileText, Github, Linkedin, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarNeon } from "@/components/ui/avatarNeon";
import { ANIMATION_VARIANTS } from "@/lib/animations";

interface HeroSectionProps {
  onContactClick: () => void;
}

export const HeroSection = ({ onContactClick }: HeroSectionProps) => {
  return (
    <section className="relative z-10 min-h-[85vh] flex flex-col justify-center mb-16 pt-10 md:pt-0">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={ANIMATION_VARIANTS.fadeInUp} 
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            Facundo Ortiz
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground font-medium mb-6">
            Fullstack Developer especializado en <span className="text-primary font-bold">Backend</span>
          </h2>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed mb-8 mx-auto md:mx-0">
            Ingeniero en formación. Construyo sistemas escalables y microservicios, enfocándome en la arquitectura y eficiencia del lado del servidor.
          </p>
          
          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            <Button 
              size="lg" 
              onClick={onContactClick} 
              className="font-semibold shadow-glow hover:shadow-glow-lg hover:translate-y-[-2px] transition-all"
            >
              Contáctame!
            </Button>
            
            <Button variant="outline" size="lg" asChild className="hover:bg-secondary">
              <a href="/cv-facundo-ortiz.pdf" download>
                <FileText className="mr-2 h-4 w-4" /> Descargar CV
              </a>
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild title="GitHub" className="hover:text-primary transition-colors">
                <a href="https://github.com/AFacundoOrtiz" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild title="LinkedIn" className="hover:text-primary transition-colors">
                <a href="https://www.linkedin.com/in/facundo-ortiz-8a24b42a2/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
        
        <AvatarNeon />
      </div>
      
      <motion.div 
        animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center text-muted-foreground/50"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
};