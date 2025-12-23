export interface Project {
  title: string;
  description: string;
  tags: string[];
  highlight?: boolean;
  github?: string | null;
  link?: string | null;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export type SkillsCategory = string;
export type SkillsData = Record<SkillsCategory, string[]>;
