
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Users, 
  Star, 
  ChefHat, 
  X,
  Loader2,
  ExternalLink 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  spoonacularScore: number;
  usedIngredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
  missedIngredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}

interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  extendedIngredients: Array<{
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  sourceUrl: string;
}

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
}

const RecipeModal = ({ recipe, isOpen, onClose, apiKey }: RecipeModalProps) => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recipe && isOpen && apiKey) {
      fetchRecipeDetails();
    }
  }, [recipe, isOpen, apiKey]);

  const fetchRecipeDetails = async () => {
    if (!recipe || !apiKey) return;

    setIsLoading(true);
    setError(null);
    console.log("Fetching recipe details for:", recipe.id);

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Errore API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Recipe details fetched:", data);
      setRecipeDetails(data);
    } catch (err) {
      console.error("Error fetching recipe details:", err);
      setError("Errore nel caricamento dei dettagli della ricetta");
    } finally {
      setIsLoading(false);
    }
  };

  const cleanHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  };

  const parseInstructions = (instructions: string) => {
    if (!instructions) return [];
    
    // Try to split by common patterns
    const steps = instructions
      .split(/(?:\d+\.|Step \d+:|\n\n)/)
      .filter(step => step.trim().length > 0)
      .map(step => step.trim());
    
    return steps.length > 1 ? steps : [instructions];
  };

  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          <img
            src={recipe.image || "https://via.placeholder.com/800x400?text=Ricetta"}
            alt={recipe.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/800x400?text=Ricetta";
            }}
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        <ScrollArea className="max-h-[calc(90vh-16rem)]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-800">
                {recipe.title}
              </DialogTitle>
              
              <div className="flex items-center gap-4 mt-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>{recipe.readyInMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={18} />
                  <span>{recipe.servings} porzioni</span>
                </div>
                {recipe.spoonacularScore && (
                  <div className="flex items-center gap-1">
                    <Star size={18} className="text-yellow-500" />
                    <span>{Math.round(recipe.spoonacularScore)}/100</span>
                  </div>
                )}
              </div>
            </DialogHeader>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin mr-2" size={24} />
                <span>Caricamento dettagli ricetta...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchRecipeDetails} variant="outline">
                  Riprova
                </Button>
              </div>
            ) : recipeDetails ? (
              <div className="space-y-8">
                {recipeDetails.summary && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <ChefHat size={20} />
                      Descrizione
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {cleanHtml(recipeDetails.summary)}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold mb-4">Ingredienti</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {recipeDetails.extendedIngredients?.map((ingredient, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-primary">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                        <span className="text-gray-700">{ingredient.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {recipeDetails.instructions && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Istruzioni</h3>
                    <div className="space-y-4">
                      {parseInstructions(cleanHtml(recipeDetails.instructions)).map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recipeDetails.sourceUrl && (
                  <div className="flex justify-center pt-6">
                    <Button
                      variant="outline"
                      onClick={() => window.open(recipeDetails.sourceUrl, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Vedi ricetta originale
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
