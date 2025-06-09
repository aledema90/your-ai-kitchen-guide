import React, { useState } from "react";
import Header from "@/components/Header";
import IngredientInput from "@/components/IngredientInput";
import RecipeResults from "@/components/RecipeResults";
import RecipeModal from "@/components/RecipeModal";
import { toast } from "@/hooks/use-toast";

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

const Index = () => {
  const spoonacularApiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  const googleAiApiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const enhanceIngredientsWithAI = async (
    ingredients: string
  ): Promise<string> => {
    try {
      console.log("Enhancing ingredients with Google AI:", ingredients);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleAiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analizza questi ingredienti per una ricerca di ricette: "${ingredients}". 
              Restituisci SOLO una lista di ingredienti separati da virgole, ottimizzata per la ricerca.
              Esempi di ottimizzazione:
              - "pollo" diventa "chicken"
              - "broccoli" diventa "broccoli"
              - "riso" diventa "rice"
              - "aglio" diventa "garlic"
              
              Traduci in inglese quando necessario e mantieni i nomi semplici e chiari.
              Risposta (solo ingredienti separati da virgole):`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 200,
              temperature: 0.3,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google AI API error: ${response.status}`);
      }

      const data = await response.json();
      const enhancedIngredients =
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ingredients;

      console.log("Enhanced ingredients:", enhancedIngredients);
      return enhancedIngredients;
    } catch (error) {
      console.error("Error enhancing ingredients with AI:", error);
      // Fallback: basic translation
      return ingredients
        .toLowerCase()
        .replace(/pollo/g, "chicken")
        .replace(/broccoli/g, "broccoli")
        .replace(/riso/g, "rice")
        .replace(/aglio/g, "garlic")
        .replace(/cipolla/g, "onion")
        .replace(/pomodoro/g, "tomato")
        .replace(/pasta/g, "pasta")
        .replace(/formaggio/g, "cheese");
    }
  };

  const searchRecipes = async (ingredients: string) => {
    if (!spoonacularApiKey) {
      toast({
        title: "Errore",
        description: "Chiave API Spoonacular mancante",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Starting recipe search with ingredients:", ingredients);

    try {
      // First, enhance ingredients with AI
      const enhancedIngredients = await enhanceIngredientsWithAI(ingredients);
      console.log("Enhanced ingredients for search:", enhancedIngredients);

      // Then search recipes with Spoonacular
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
          enhancedIngredients
        )}&number=10&apiKey=${spoonacularApiKey}`
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Recipes found:", data);
      setRecipes(data);
    } catch (error) {
      console.error("Error searching recipes:", error);
      toast({
        title: "Errore nella ricerca",
        description:
          "Si è verificato un errore durante la ricerca delle ricette. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // Check if API keys are available
  if (!spoonacularApiKey || !googleAiApiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Errore di Configurazione
          </h2>
          <p className="text-gray-600 mb-4">
            Le chiavi API non sono configurate correttamente. Assicurati di aver
            impostato le variabili d'ambiente:
          </p>
          <ul className="text-left text-sm text-gray-500 space-y-2 mb-6">
            <li>• VITE_SPOONACULAR_API_KEY</li>
            <li>• VITE_GOOGLE_AI_API_KEY</li>
          </ul>
          <p className="text-sm text-gray-500">
            Controlla il file .env nella root del progetto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <IngredientInput onSearch={searchRecipes} isLoading={isLoading} />

        {recipes.length > 0 && (
          <RecipeResults recipes={recipes} onRecipeClick={handleRecipeClick} />
        )}
      </main>

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        apiKey={spoonacularApiKey}
      />

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-lg font-semibold mb-2">Chef AI Assistant</p>
          <p className="text-gray-400">
            Powered by Google AI Studio & Spoonacular API
          </p>
          <p className="text-sm text-gray-500 mt-2">
            🍳 Trasforma i tuoi ingredienti in deliziose ricette con
            l'intelligenza artificiale
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
