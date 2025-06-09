
import React from "react";
import { Clock, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  summary?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const handleClick = () => {
    console.log("Recipe card clicked:", recipe.title);
    onClick(recipe);
  };

  const usedCount = recipe.usedIngredients?.length || 0;
  const missedCount = recipe.missedIngredients?.length || 0;
  const totalIngredients = usedCount + missedCount;
  const matchPercentage = totalIngredients > 0 ? Math.round((usedCount / totalIngredients) * 100) : 0;

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] recipe-card-gradient border border-gray-100 animate-slide-up"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={recipe.image || "https://via.placeholder.com/400x250?text=Ricetta"}
          alt={recipe.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/400x250?text=Ricetta";
          }}
        />
        <div className="absolute top-4 right-4">
          <Badge className="ingredient-tag text-white font-semibold">
            {matchPercentage}% Match
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-primary transition-colors">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-4 mb-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span className="text-sm">{recipe.readyInMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span className="text-sm">{recipe.servings} porzioni</span>
          </div>
          {recipe.spoonacularScore && (
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500" />
              <span className="text-sm">{Math.round(recipe.spoonacularScore)}/100</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {usedCount > 0 && (
            <div>
              <p className="text-sm font-medium text-green-700 mb-2">
                Ingredienti che hai ({usedCount}):
              </p>
              <div className="flex flex-wrap gap-1">
                {recipe.usedIngredients.slice(0, 3).map((ingredient, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-green-100 text-green-800 border-green-200"
                  >
                    {ingredient.name}
                  </Badge>
                ))}
                {usedCount > 3 && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    +{usedCount - 3} altri
                  </Badge>
                )}
              </div>
            </div>
          )}

          {missedCount > 0 && (
            <div>
              <p className="text-sm font-medium text-orange-700 mb-2">
                Ti servono anche ({missedCount}):
              </p>
              <div className="flex flex-wrap gap-1">
                {recipe.missedIngredients.slice(0, 3).map((ingredient, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs border-orange-200 text-orange-700"
                  >
                    {ingredient.name}
                  </Badge>
                ))}
                {missedCount > 3 && (
                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                    +{missedCount - 3} altri
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
