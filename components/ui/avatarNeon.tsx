"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const AvatarNeon = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 flex justify-center items-center"
    >
      <div className="relative w-64 h-64 md:w-[24rem] md:h-[24rem] shrink-0">
        <motion.div
          animate={{
            filter: [
              "drop-shadow(0 0 8px var(--neon-color))",
              "drop-shadow(0 0 2px var(--neon-color))",
              "drop-shadow(0 0 12px var(--neon-color))",
              "drop-shadow(0 0 8px var(--neon-color))",
              "drop-shadow(0 0 8px var(--neon-color))",
            ] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "linear",
            times: [0, 0.7, 0.75, 0.8, 1] 
          }}
          className="relative w-full h-full 
                     [mask-image:linear-gradient(to_bottom,black_95%,transparent_100%)] 
                     [-webkit-mask-image:linear-gradient(to_bottom,black_95%,transparent_100%)]"
        >
          <Image
            src="/avatar.png"
            alt="Facundo Ortiz"
            fill
            sizes="(max-width: 768px) 256px, 384px"
            className="object-contain"
            priority
            quality={90}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};