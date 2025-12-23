export const BackgroundGrid = () => (
  <div 
    className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] dark:opacity-[0.2]"
    style={{
      backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
      backgroundSize: '4rem 4rem',
      maskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)',
    }}
  />
);