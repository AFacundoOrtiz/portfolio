"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ANIMATION_VARIANTS } from "@/lib/animations";
import { SkillsData } from "@/types/portfolio";

interface TechStackProps {
  data: SkillsData;
}

export const TechStack = ({ data }: TechStackProps) => {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={ANIMATION_VARIANTS.fadeInUp}>
      <h3 className="text-2xl font-bold mb-8">Tech Stack</h3>
      <div className="space-y-6">
        {Object.entries(data).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <p className="text-xs font-black text-primary uppercase tracking-widest">
              {category}
            </p>
            <motion.div variants={ANIMATION_VARIANTS.container} className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <motion.div key={skill} variants={ANIMATION_VARIANTS.item}>
                  <Badge variant="secondary" className="text-[10px] py-1 px-2 border border-transparent shadow-glow hover:border-primary/30 transition-all">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};