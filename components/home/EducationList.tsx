"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { ANIMATION_VARIANTS } from "@/lib/animations";
import { EducationItem } from "@/types/portfolio";

interface EducationListProps {
  data: EducationItem[];
}

export const EducationList = ({ data }: EducationListProps) => {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ANIMATION_VARIANTS.fadeInUp}>
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-primary" /> Educación
      </h3>
      <div className="space-y-4">
        {data.map((edu, i) => (
          <div key={`${edu.degree}-${i}`} className="group p-5 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/50 transition-all duration-300">
            <p className="font-bold text-base group-hover:text-primary transition-colors">{edu.degree}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">{edu.institution}</p>
              <p className="text-[10px] font-mono text-primary/70">{edu.period}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};