"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/sectionHeader";
import { ANIMATION_VARIANTS } from "@/lib/animations";
import { Project } from "@/types/portfolio";

// Helper Component (Internal)
const ProjectCard = ({ project }: { project: Project }) => (
  <Card className="group border-muted bg-card/40 backdrop-blur-md flex flex-col hover:border-primary/50 hover:shadow-glow transition-all duration-500 overflow-hidden">
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
          <a href={project.github} target="_blank" rel="noopener noreferrer"><Github className="mr-2 h-4 w-4" /> Repo</a>
        </Button>
      )}
      {project.link && (
        <Button asChild size="sm" className="flex-1 shadow-md">
          <a href={project.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> Demo</a>
        </Button>
      )}
    </CardFooter>
  </Card>
);

interface ProjectsSectionProps {
  data: Project[];
}

export const ProjectsSection = ({ data }: ProjectsSectionProps) => {
  if (!data || data.length === 0) return null;

  return (
    <motion.section 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={ANIMATION_VARIANTS.fadeInUp} 
      className="mb-32"
    >
      <SectionHeader title="Proyectos" />
      <div className="grid gap-6 md:grid-cols-2">
        {data.map((project, index) => (
          <ProjectCard key={`${project.title}-${index}`} project={project} />
        ))}
      </div>
    </motion.section>
  );
};