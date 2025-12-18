"use client";

import { motion, useScroll, useSpring, Variants } from "framer-motion";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { education } from "@/data/education";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Terminal, GraduationCap, FileText, ExternalLink, ArrowDown } from "lucide-react";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { ContactSection } from "@/components/contactSection";
import { AvatarNeon } from "@/components/ui/avatarNeon";
import { NeonCursor } from "@/components/ui/neonCursor";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 max-w-5xl mx-auto relative overflow-x-hidden">
      < NeonCursor />
      
      {/* BARRA DE PROGRESO */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[60]" style={{ scaleX }} />

      {/* FONDO DE CUADRÍCULA */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] dark:opacity-[0.2]" 
        style={{
          backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)',
        }}
      />

      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[70]">
        <ModeToggle />
      </div>
      
      {/* HERO SECTION */}
      <section className="relative z-10 min-h-[85vh] flex flex-col justify-center mb-16 pt-10 md:pt-0">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex-1 text-center md:text-left">
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
              <Button size="lg" 
  onClick={scrollToContact} 
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

      {/* SECCIÓN: EXPERIENCIA */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mb-32">
        <div className="flex items-center gap-4 mb-12">
            <h3 className="text-3xl font-bold flex items-center gap-3">
              <Terminal className="h-8 w-8 text-primary" /> Experiencia
            </h3>
            <div className="h-px bg-border flex-1" />
        </div>

        <div className="space-y-12 max-w-3xl mx-auto">
          {experience.map((item, index) => (
            <div key={index} className="group relative pl-8 border-l-2 border-border hover:border-primary transition-colors duration-500">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-background border-2 border-muted-foreground group-hover:border-primary group-hover:shadow-glow group-hover:scale-125 transition-all" />
              <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{item.role}</h4>
              <div className="flex justify-between items-center text-sm mb-3 mt-1">
                <span className="text-muted-foreground font-medium">{item.company}</span>
                <Badge variant="secondary" className="font-mono">{item.period}</Badge>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.skills.map(skill => (
                  <Badge key={skill} variant="outline" className="text-[10px] uppercase tracking-tighter bg-primary/5">{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* SECCIÓN: PROYECTOS */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-32">
        <div className="flex items-center gap-4 mb-12">
            <h3 className="text-3xl font-bold">Proyectos</h3>
            <div className="h-px bg-border flex-1" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <Card key={index} className="group border-muted bg-card/40 backdrop-blur-md flex flex-col hover:border-primary/50 hover:shadow-glow transition-all duration-500 overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                  {project.highlight && <Badge className="bg-amber-500 hover:bg-amber-600">Destacado</Badge>}
                </div>
                <CardDescription className="line-clamp-3 mt-2 text-sm leading-relaxed">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[10px] bg-secondary/50">{tag}</Badge>)}
                </div>
              </CardContent>
              <CardFooter className="gap-3 border-t bg-muted/5 py-4">
                {project.github && (
                  <Button asChild variant="ghost" size="sm" className="flex-1 border hover:bg-background">
                    <a href={project.github} target="_blank"><Github className="mr-2 h-4 w-4" /> Repo</a>
                  </Button>
                )}
                {project.link && (
                  <Button asChild size="sm" className="flex-1 shadow-md">
                    <a href={project.link} target="_blank"><ExternalLink className="mr-2 h-4 w-4" /> Demo</a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* SECCIÓN: SKILLS Y EDUCACIÓN COMBINADA */}
      <div className="grid md:grid-cols-2 gap-16 mb-32">
  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
    <h3 className="text-2xl font-bold mb-8">Tech Stack</h3>
    <div className="space-y-6">
      {Object.entries(skills).map(([category, items]) => (
        <div key={category} className="space-y-3">
          {/* Título de la categoría: Backend, Database, etc. */}
          <p className="text-xs font-black text-primary uppercase tracking-widest">
            {category}
          </p>
          
          {/* Contenedor de las Badges con Stagger */}
          <motion.div 
            variants={containerVariants} 
            className="flex flex-wrap gap-2"
          >
            {items.map((skill) => (
              <motion.div key={skill} variants={itemVariants}>
                <Badge 
                  variant="secondary" 
                  className="text-[10px] py-1 px-2 border border-transparent shadow-glow hover:border-primary/30 transition-all"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  </motion.div>

        {/* Educación */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" /> Educación
          </h3>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="group p-5 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/50 transition-all duration-300">
                <p className="font-bold text-base group-hover:text-primary transition-colors">{edu.degree}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                  <p className="text-[10px] font-mono text-primary/70">{edu.period}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <ContactSection variants={fadeInUp} />

      <footer className="text-center text-[10px] uppercase tracking-widest text-muted-foreground py-12">
        <p>© {new Date().getFullYear()} Facundo Ortiz — Hecho con Next.js & Framer Motion</p>
      </footer>
    </main>
  );
}