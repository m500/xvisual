"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { Search } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Funkcia pre odoslanie formulára (rieši Enter aj Klik)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Zastaví refresh stránky
    if (!url) return;
    
    setIsLoading(true);
    // Presmerujeme na inspect stránku s parametrom URL
    router.push(`/inspect?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-white p-4 font-sans">
      <div className="w-full max-w-lg flex flex-col items-center gap-8 text-center">
        
        {/* Logo / Nadpis */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            xVisual
          </h1>
          <p className="text-zinc-400 text-sm uppercase tracking-tight font-bold">
            Visual Feedback Tool
          </p>
        </div>

        {/* Formulár */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            size="lg"
            placeholder="Zadajte URL webu (napr. dennikn.sk)"
            value={url}
            onValueChange={setUrl}
            startContent={<Search className="text-zinc-500" size={20} />}
            classNames={{
              input: "text-white tracking-tight",
              inputWrapper: "bg-[rgb(24,24,27)] border border-white/10 hover:border-white/20 focus-within:!border-blue-500 rounded-2xl transition-colors"
            }}
          />
          
          <Button 
            type="submit"
            size="lg" 
            color="primary" 
            className="w-full font-bold shadow-lg shadow-blue-900/20 rounded-2xl tracking-tight"
            isLoading={isLoading}
          >
            {isLoading ? "Načítavam..." : "Analyzovať Web"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs text-zinc-600 tracking-tight">
          Powered by xVisual Engine v1.0
        </p>
      </div>
    </div>
  );
}