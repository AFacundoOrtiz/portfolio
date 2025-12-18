"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const NeonCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.6 };
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.closest("a") || 
        target.closest("button") || 
        target.closest("input") || 
        target.closest(".cursor-hover");

      setIsHovered(!!isClickable);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX - 8); 
      mouseY.set(e.clientY - 8);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return null;
  }

  return (
    <motion.div
      style={{
        translateX: cursorX,
        translateY: cursorY,
        opacity: isVisible ? 1 : 0,
      }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
    >
      <motion.div
        animate={{
          scale: isHovered ? 4 : 1,
          borderWidth: "0.1px",
          borderColor: isHovered ? "transparent" : "white",
          boxShadow: isHovered 
            ? "0 0 30px 5px var(--neon-color)"
            : "0 0 15px 2px var(--neon-color)",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative w-4 h-4 rounded-full bg-transparent"
      />
    </motion.div>
  );
};