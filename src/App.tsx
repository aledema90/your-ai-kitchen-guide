// Importiamo i componenti e le librerie necessarie
import { Toaster } from "@/components/ui/toaster"; // Componente per le notifiche toast
import { Toaster as Sonner } from "@/components/ui/sonner"; // Un altro sistema di notifiche
import { TooltipProvider } from "@/components/ui/tooltip"; // Provider per i tooltip
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Gestione delle query e cache
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Routing dell'applicazione
import Index from "./pages/Index"; // Pagina principale
import NotFound from "./pages/NotFound"; // Pagina 404

// Creiamo un'istanza di QueryClient per gestire le richieste API e la cache
const queryClient = new QueryClient();

// Componente principale dell'applicazione
const App = () => (
  // QueryClientProvider permette a tutti i componenti di usare react-query
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider permette a tutti i componenti di usare i tooltip */}
    <TooltipProvider>
      {/* Sistema di notifiche toast */}
      <Toaster />
      {/* Sistema di notifiche sonner (alternativo) */}
      <Sonner />

      {/* BrowserRouter abilita il routing nell'applicazione */}
      <BrowserRouter>
        {/* Routes definisce tutte le rotte disponibili */}
        <Routes>
          {/* Rotta principale - mostra il componente Index */}
          <Route path="/" element={<Index />} />

          {/* Rotta catch-all - mostra NotFound per qualsiasi percorso non definito */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
