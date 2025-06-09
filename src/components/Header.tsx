
import { ChefHat, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="cooking-gradient text-white py-8 px-4 shadow-lg">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ChefHat size={40} className="text-white" />
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Chef AI Assistant
          </h1>
          <Sparkles size={32} className="text-yellow-200" />
        </div>
        <p className="text-center text-lg md:text-xl text-orange-100 max-w-2xl mx-auto">
          Trasforma i tuoi ingredienti in ricette deliziose con l'aiuto dell'intelligenza artificiale
        </p>
      </div>
    </header>
  );
};

export default Header;
