"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import { education } from "@/data/education"; // Asegúrate de importar educación
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, Terminal, GraduationCap, FileText, ExternalLink } from "lucide-react";
import Image from "next/image";
import { ContactButton } from "@/components/ui/ContactButton"; // Verifica la ruta (si es components/ui o components/)
import { ModeToggle } from "@/components/ui/ModeToggle"; // Verifica la ruta

export default function Home() {
  // Configuración de animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Variantes para el contenedor (controla a los hijos)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Retraso entre cada hijo
      }
    }
  };

  // Variantes para cada Badge individual
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 max-w-5xl mx-auto relative">

      {/* BOTÓN DE TEMA FLOTANTE */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
        <ModeToggle />
      </div>
      
      {/* --- HERO SECTION --- */}
      <section className="mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Texto Animado */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Facundo Ortiz</h1>
          
          {/* TÍTULO ACTUALIZADO */}
          <h2 className="text-xl md:text-2xl text-muted-foreground font-medium">
            Fullstack Developer especializado en Backend | Ecosistema Node.js
          </h2>
          
          <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
            Ingeniero en formación apasionado por la arquitectura de software. 
            Me especializo en construir sistemas escalables, microservicios y 
            la lógica invisible que impulsa las aplicaciones modernas.
          </p>
          
          <div className="flex gap-4 mt-6 flex-wrap">
            <ContactButton />
            <Button variant="outline" asChild>
              <a href="https://github.com/AFacundoOrtiz" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://www.linkedin.com/in/facundo-ortiz-8a24b42a2/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/cv-facundo-ortiz.pdf" download="CV_Facundo_Ortiz_Backend.pdf">
                <FileText className="mr-2 h-4 w-4" /> Descargar CV
              </a>
            </Button>
          </div>
        </motion.div>
        
        {/* --- FOTO DE PERFIL CON ANIMACIÓN POP --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: 3 }} // Empieza rotada
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: [3, 0, 3] // Ciclo: Inclinada -> Recta -> Inclinada
          }}
          whileHover={{ rotate: 0, scale: 1.05 }} // Efecto al pasar el mouse (más rápido)
          transition={{
            // Configuración general (entrada)
            default: { duration: 0.5, delay: 0.2, type: "spring" },
            // Configuración específica para el bucle de rotación
            rotate: { 
              duration: 2,        // Cuánto tarda en moverse
              repeat: Infinity,   // Se repite para siempre
              repeatDelay: 4,     // Espera 4 segundos entre cada movimiento
              ease: "easeInOut"   // Movimiento suave
            }
          }}
          className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 mt-6 md:mt-0"
        >
          <Image
            src="/profile.png"
            alt="Facundo Ortiz"
            fill
            // ELIMINÉ: rotate-3 hover:rotate-0 transition-transform duration-300
            // MANTUVE: el resto de estilos visuales
            className="rounded-2xl object-cover border-4 border-muted shadow-xl"
            priority
          />
        </motion.div>
      </section>

      <Separator className="my-12" />

      {/* --- EXPERIENCIA --- */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="mb-16"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Terminal className="mr-2 h-6 w-6" /> Experiencia
        </h3>
        <div className="space-y-6">
          {experience.map((item, index) => (
            <div key={index} className="border-l-4 border-primary pl-4 py-1">
              <h4 className="text-lg font-bold">{item.role}</h4>
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                <span>{item.company}</span>
                <span>{item.period}</span>
              </div>
              <p className="mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* --- EDUCACIÓN --- */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        variants={fadeInUp}
        className="mb-16"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <GraduationCap className="mr-2 h-6 w-6" /> Educación
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((item, index) => (
            <Card key={index} className="bg-muted/50 border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-base">{item.degree}</CardTitle>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{item.institution}</span>
                  <span>{item.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* --- PROYECTOS --- */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="mb-16"
      >
        <h3 className="text-2xl font-bold mb-6">Proyectos Destacados</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  {project.highlight && <Badge>Destacado</Badge>}
                </div>
                <CardDescription className="mt-2 leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              
              {/* LÓGICA DE DOBLE BOTÓN APLICADA AQUÍ */}
              <CardFooter className="flex gap-2 pt-4">
                  {/* 1. Botón de Código (Si hay github) */}
                  {project.github && (
                    <Button asChild variant="outline" className="flex-1">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" /> Código
                      </a>
                    </Button>
                  )}

                  {/* 2. Botón de Demo/Docs (Si hay link y es distinto a github) */}
                  {project.link && project.link !== project.github && (
                    <Button asChild variant="default" className="flex-1">
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {project.link.includes("notion") ? "Ver Diseño" : "Ver Docs/Demo"}
                      </a>
                    </Button>
                  )}

                  {/* 3. Caso Borde: Si solo hay link y es igual a github */}
                  {project.link === project.github && !project.github && (
                     <Button asChild variant="default" className="w-full">
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                           <Github className="mr-2 h-4 w-4" /> Ver Repo
                        </a>
                     </Button>
                  )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* --- TECH STACK --- */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="mb-16"
      >
        <h3 className="text-2xl font-bold mb-6">Tech Stack</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
  <CardHeader><CardTitle className="text-lg">Backend</CardTitle></CardHeader>
  <CardContent>
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-wrap gap-2"
    >
        {skills.backend.map(s => (
          <motion.div key={s} variants={itemVariants}>
            <Badge variant="secondary">{s}</Badge>
          </motion.div>
        ))}
    </motion.div>
  </CardContent>
</Card>
          <Card>
  <CardHeader><CardTitle className="text-lg">Database</CardTitle></CardHeader>
  <CardContent>
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-wrap gap-2"
    >
        {skills.database.map(s => (
          <motion.div key={s} variants={itemVariants}>
            <Badge variant="secondary">{s}</Badge>
          </motion.div>
        ))}
    </motion.div>
  </CardContent>
</Card>
          <Card>
  <CardHeader><CardTitle className="text-lg">Cloud & DevOps</CardTitle></CardHeader>
  <CardContent>
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-wrap gap-2"
    >
        {skills.cloud.map(s => (
          <motion.div key={s} variants={itemVariants}>
            <Badge variant="secondary">{s}</Badge>
          </motion.div>
        ))}
    </motion.div>
  </CardContent>
</Card>
          <Card>
  <CardHeader><CardTitle className="text-lg">Tools</CardTitle></CardHeader>
  <CardContent>
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-wrap gap-2"
    >
        {skills.tools.map(s => (
          <motion.div key={s} variants={itemVariants}>
            <Badge variant="secondary">{s}</Badge>
          </motion.div>
        ))}
    </motion.div>
  </CardContent>
</Card>
        </div>
      </motion.section>

      {/* --- FOOTER --- */}
      <footer className="text-center text-sm text-muted-foreground py-8 border-t">
        <p>© {new Date().getFullYear()} Facundo Ortiz. Built with Next.js & Shadcn UI.</p>
      </footer>

    </main>
  );
}