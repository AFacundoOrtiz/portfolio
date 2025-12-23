"use client";

import React, { useCallback } from "react";

// Components UI Globales
import { ModeToggle } from "@/components/ui/ModeToggle";
import { NeonCursor } from "@/components/ui/neonCursor";
import { ContactSection } from "@/components/contactSection";
import { ScrollProgressBar } from "@/components/ui/scrollProgress";
import { BackgroundGrid } from "@/components/ui/backgroundGrid";

// Components de Secciones
import { HeroSection } from "@/components/home/HeroSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { TechStack } from "@/components/home/TechStack";
import { EducationList } from "@/components/home/EducationList";
import { EcoShopSection } from "@/components/ecoshop/eco-shop-section";

// Data
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { education } from "@/data/education";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export default function Home() {
  
  // Lógica de UI
  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 max-w-5xl mx-auto relative overflow-x-hidden">
      {/* Background & Effects */}
      <NeonCursor />
      <ScrollProgressBar />
      <BackgroundGrid />
      
      {/* Header Controls */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[70]">
        <ModeToggle />
      </div>
      
      {/* Content Flow */}
      <HeroSection onContactClick={scrollToContact} />
      
      <ExperienceSection data={experience} />
      
      <ProjectsSection data={projects} />
      
      {/* Feature Project Integration */}
      <EcoShopSection />

      {/* Grid Layout for details */}
      <div className="grid md:grid-cols-2 gap-16 mb-32">
        <TechStack data={skills} />
        <EducationList data={education} />
      </div>

      <ContactSection variants={ANIMATION_VARIANTS.fadeInUp} />

      {/* Footer */}
      <footer className="text-center text-[10px] uppercase tracking-widest text-muted-foreground py-12">
        <p>© {new Date().getFullYear()} Facundo Ortiz — Hecho con Next.js - Shadcn/ui - Framer Motion</p>
      </footer>
    </main>
  );
}