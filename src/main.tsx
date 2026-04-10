// Importiamo le dipendenze necessarie
import { createRoot } from "react-dom/client"; // Funzione per creare la root di React 18
import App from "./App.tsx"; // Il componente principale dell'applicazione
import "./index.css"; // Stili globali dell'applicazione

// Creiamo la root dell'applicazione React
// document.getElementById("root") trova l'elemento HTML con id "root"
// Il ! è un'asserzione di non-nullità in TypeScript
createRoot(document.getElementById("root")!).render(<App />);

// Questo file è il punto di ingresso dell'applicazione React
// Vite lo carica automaticamente grazie alla riga in index.html:
// <script type="module" src="/src/main.tsx"></script>
