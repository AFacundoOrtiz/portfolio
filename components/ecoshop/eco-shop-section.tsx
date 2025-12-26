"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Server, RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/ecoshop/product-card";
import { Product } from "@/types/ecoshop"; 
import { Button } from "@/components/ui/button";
import { JsonTerminal } from "@/components/ecoshop/json-terminal";
import { AdminDashboardDemo } from "./adminDashboardDemo";
import { CartSidebar } from "@/components/ecoshop/cartSidebar";
import { EcoProfileSidebar } from "./eco-profile-sidebar";
import { Suspense } from 'react';

export function EcoShopSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";
    
      const res = await fetch(`${apiUrl}/products`);
      
      if (!res.ok) throw new Error("Error fetching");

      const jsonData = await res.json();
      const rawProducts = jsonData.data;

      setProducts(rawProducts);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      }}
      className="mb-32 relative"
    >
      <JsonTerminal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <div className="absolute -left-20 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* --- HEADER DE LA SECCIÓN --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
        <h3 className="text-3xl font-bold flex items-center gap-3">
          <Leaf className="h-8 w-8 text-emerald-500" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600">
            Live API Demo
          </span>
        </h3>
        
        {/* Separador (Línea) */}
        <div className="hidden md:block h-px bg-border flex-1" />
        
        {/* --- ÁREA DE ACCIONES (Status + Carrito) --- */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border px-3 py-1 rounded-full bg-background/50">
                <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                {error ? "API Offline" : "API Connected: NestJS"}
            </div>
            <Suspense fallback={<div className="w-10 h-10" />}>
              <EcoProfileSidebar />
            </Suspense>
            <CartSidebar /> 
        </div>
      </div>

      <p className="text-muted-foreground mb-8 max-w-2xl">
        Esta sección consume en tiempo real mi API de <strong>EcoShop</strong>. 
        Las tarjetas calculan el impacto ambiental dinámicamente. 
        <span className="text-xs ml-2 text-emerald-500 opacity-70">(Pasa el mouse sobre las tarjetas)</span>
      </p>

      {/* --- SKELETON LOADING --- */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] rounded-xl bg-muted/10 animate-pulse border border-border/50" />
          ))}
        </div>
      )}

      {/* --- ERROR STATE --- */}
      {!loading && error && (
        <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-8 text-center space-y-4">
          <Server className="w-12 h-12 text-red-500 mx-auto opacity-50" />
          <h4 className="text-xl font-bold text-red-400">Servidor Local Desconectado</h4>
          <p className="text-muted-foreground">
            No se pudo conectar con <code>localhost:3010</code>. Asegúrate de correr el backend para ver la demo.
          </p>
          <Button variant="outline" onClick={fetchProducts} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Reintentar Conexión
          </Button>
        </div>
      )}

      {/* --- PRODUCT GRID --- */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onOpenJson={(p) => setSelectedProduct(p)}
              // No hace falta pasar 'onAddToCart', el ProductCard ya usa el store internamente
            />
          ))}
        </div>
      )}

      {/* --- ADMIN DASHBOARD --- */}
      <div className="mt-16 border-t border-neutral-800 pt-12">
          <AdminDashboardDemo />
       </div>
    </motion.section>
  );
}