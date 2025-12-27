"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/ecoshop";

interface JsonTerminalProps {
  product: Product | null;
  onClose: () => void;
}

export const JsonTerminal = ({ product, onClose }: JsonTerminalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!product) return;
    navigator.clipboard.writeText(JSON.stringify(product, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[10%] left-0 right-0 mx-auto w-[90%] max-w-4xl h-[80vh] bg-[#1e1e1e] border border-neutral-700 rounded-xl shadow-2xl z-[9999] overflow-hidden flex flex-col font-mono"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-3 text-xs text-neutral-400">
                  json-viewer — {product.name.toLowerCase().replace(/ /g, "-")}.json
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-neutral-400 hover:text-white"
                  title="Copiar JSON"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 custom-scrollbar">
              <pre className="text-sm leading-relaxed">
                <code className="language-json text-blue-300">
                  {JSON.stringify(product, null, 2)}
                </code>
              </pre>
            </div>

            <div className="px-4 py-2 bg-[#252526] border-t border-neutral-700 text-[10px] text-neutral-500 flex justify-between">
              <span>HTTP 200 OK</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};