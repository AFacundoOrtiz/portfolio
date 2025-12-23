import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
}

export const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => (
  <div className="flex items-center gap-4 mb-12">
    <h3 className="text-3xl font-bold flex items-center gap-3">
      {Icon && <Icon className="h-8 w-8 text-primary" />} {title}
    </h3>
    <div className="h-px bg-border flex-1" />
  </div>
);