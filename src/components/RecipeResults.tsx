
import React from "react";
import RecipeCard from "./RecipeCard";
import { ChefHat } from "lucide-react";

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

interface RecipeResultsProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
}

const RecipeResults = ({ recipes, onRecipeClick }: RecipeResultsProps) => {
  console.log("Rendering recipe results:", recipes.length, "recipes");

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat size={64} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Nessuna ricetta trovata
        </h3>
        <p className="text-gray-500">
          Prova con ingredienti diversi o più comuni
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Ricette Trovate
          </h2>
          <p className="text-gray-600">
            Abbiamo trovato {recipes.length} ricette perfette per i tuoi ingredienti!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={onRecipeClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeResults;
