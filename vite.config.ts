// Importiamo le dipendenze necessarie
import { defineConfig } from "vite"; // Il costruttore di configurazione di Vite
import react from "@vitejs/plugin-react-swc"; // Plugin per supportare React con SWC (compilatore più veloce di Babel)
import path from "path"; // Utility per gestire i percorsi dei file
import { componentTagger } from "lovable-tagger"; // Plugin per il tagging dei componenti in sviluppo

// Definiamo la configurazione di Vite
// La funzione defineConfig accetta una funzione che riceve l'oggetto { mode } (development/production)
export default defineConfig(({ mode }) => ({
  // Configurazione del server di sviluppo
  server: {
    host: "::", // Ascolta su tutte le interfacce di rete (IPv4 e IPv6)
    port: 8080, // Porta su cui il server di sviluppo sarà in ascolto
  },

  // Array di plugin che Vite utilizzerà
  plugins: [
    react(), // Abilita il supporto per React
    // Il componentTagger viene usato solo in modalità sviluppo
    mode === "development" && componentTagger(),
  ].filter(Boolean), // Rimuove eventuali plugin 'falsy' (come false o undefined)

  // Configurazione per la risoluzione dei moduli
  resolve: {
    alias: {
      // Permette di usare '@' come alias per la cartella 'src'
      // Es: import Component from '@/components/Component' invece di '../../components/Component'
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Configurazione per il build
  base: "/", // Il percorso base dell'applicazione
  build: {
    outDir: "dist", // Cartella dove verrà generato il build di produzione
    assetsDir: "assets", // Sottocartella per gli asset (immagini, font, ecc.)
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disabilita la suddivisione automatica dei chunk
      },
    },
  },
}));
