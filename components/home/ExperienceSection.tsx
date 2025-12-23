"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/sectionHeader";
import { ANIMATION_VARIANTS } from "@/lib/animations";
import { ExperienceItem } from "@/types/portfolio";

interface ExperienceSectionProps {
  data: ExperienceItem[];
}

export const ExperienceSection = ({ data }: ExperienceSectionProps) => {
  if (!data || data.length === 0) return null;

  return (
    <motion.section 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-100px" }} 
      variants={ANIMATION_VARIANTS.fadeInUp} 
      className="mb-32"
    >
      <SectionHeader icon={Terminal} title="Experiencia" />

      <div className="space-y-12 max-w-3xl mx-auto">
        {data.map((job, index) => (
          <div key={`${job.company}-${index}`} className="group relative pl-8 border-l-2 border-border hover:border-primary transition-colors duration-500">
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-background border-2 border-muted-foreground group-hover:border-primary group-hover:shadow-glow group-hover:scale-125 transition-all" />
            <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{job.role}</h4>
            <div className="flex justify-between items-center text-sm mb-3 mt-1">
              <span className="text-muted-foreground font-medium">{job.company}</span>
              <Badge variant="secondary" className="font-mono">{job.period}</Badge>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">{job.description}</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(skill => (
                <Badge key={skill} variant="outline" className="text-[10px] uppercase tracking-tighter bg-primary/5">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};