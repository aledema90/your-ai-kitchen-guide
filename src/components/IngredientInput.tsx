
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface IngredientInputProps {
  onSearch: (ingredients: string) => void;
  isLoading: boolean;
}

const IngredientInput = ({ onSearch, isLoading }: IngredientInputProps) => {
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredients.trim()) {
      toast({
        title: "Ingredienti mancanti",
        description: "Per favore, inserisci almeno un ingrediente.",
        variant: "destructive",
      });
      return;
    }

    console.log("Submitting ingredients:", ingredients);
    onSearch(ingredients.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIngredients(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 recipe-card-gradient border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Quali ingredienti hai a disposizione?
            </h2>
            <p className="text-gray-600">
              Inserisci gli ingredienti separati da virgole (es. pollo, broccoli, riso, aglio)
            </p>
          </div>
          
          <div className="relative">
            <Input
              type="text"
              value={ingredients}
              onChange={handleInputChange}
              placeholder="Es. pollo, broccoli, riso, aglio, cipolla..."
              className="pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              disabled={isLoading}
            />
            <Search 
              size={20} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 text-lg font-semibold cooking-gradient hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Cercando ricette...
              </>
            ) : (
              <>
                <Search className="mr-2" size={20} />
                Trova Ricette
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 Suggerimento: più ingredienti inserisci, più precise saranno le ricette!
          </p>
        </div>
      </div>
    </div>
  );
};

export default IngredientInput;
