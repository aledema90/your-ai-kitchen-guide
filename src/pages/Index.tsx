
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import IngredientInput from "@/components/IngredientInput";
import RecipeResults from "@/components/RecipeResults";
import RecipeModal from "@/components/RecipeModal";
import ApiKeyInput from "@/components/ApiKeyInput";
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
  const [spoonacularApiKey, setSpoonacularApiKey] = useState("");
  const [googleAiApiKey, setGoogleAiApiKey] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load API keys from localStorage
    const savedSpoonacularKey = localStorage.getItem("spoonacular_api_key");
    const savedGoogleAiKey = localStorage.getItem("google_ai_api_key");
    
    if (savedSpoonacularKey && savedGoogleAiKey) {
      setSpoonacularApiKey(savedSpoonacularKey);
      setGoogleAiApiKey(savedGoogleAiKey);
      console.log("API keys loaded from localStorage");
    }
  }, []);

  const handleApiKeysSet = (spoonacularKey: string, googleAiKey: string) => {
    setSpoonacularApiKey(spoonacularKey);
    setGoogleAiApiKey(googleAiKey);
    
    // Save to localStorage
    localStorage.setItem("spoonacular_api_key", spoonacularKey);
    localStorage.setItem("google_ai_api_key", googleAiKey);
    
    toast({
      title: "API configurate con successo!",
      description: "Ora puoi iniziare a cercare ricette.",
    });
  };

  const enhanceIngredientsWithAI = async (ingredients: string): Promise<string> => {
    try {
      console.log("Enhancing ingredients with Google AI:", ingredients);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleAiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analizza questi ingredienti per una ricerca di ricette: "${ingredients}". 
              Restituisci SOLO una lista di ingredienti separati da virgole, ottimizzata per la ricerca.
              Esempi di ottimizzazione:
              - "pollo" diventa "chicken"
              - "broccoli" diventa "broccoli"
              - "riso" diventa "rice"
              - "aglio" diventa "garlic"
              
              Traduci in inglese quando necessario e mantieni i nomi semplici e chiari.
              Risposta (solo ingredienti separati da virgole):`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.3,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Google AI API error: ${response.status}`);
      }

      const data = await response.json();
      const enhancedIngredients = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ingredients;
      
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
      // Enhance ingredients with Google AI
      const enhancedIngredients = await enhanceIngredientsWithAI(ingredients);
      
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(enhancedIngredients)}&number=12&ignorePantry=false&ranking=2&apiKey=${spoonacularApiKey}`
      );

      if (!response.ok) {
        if (response.status === 402) {
          throw new Error("Limite API raggiunto. Verifica il tuo piano Spoonacular.");
        }
        throw new Error(`Errore API Spoonacular: ${response.status}`);
      }

      const data = await response.json();
      console.log("Recipes found:", data);

      if (data && Array.isArray(data)) {
        setRecipes(data);
        
        if (data.length === 0) {
          toast({
            title: "Nessuna ricetta trovata",
            description: "Prova con ingredienti diversi o più comuni.",
          });
        } else {
          toast({
            title: "Ricette trovate!",
            description: `Abbiamo trovato ${data.length} ricette per i tuoi ingredienti.`,
          });
        }
      } else {
        throw new Error("Formato risposta API non valido");
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      const errorMessage = error instanceof Error ? error.message : "Errore durante la ricerca delle ricette";
      
      toast({
        title: "Errore nella ricerca",
        description: errorMessage,
        variant: "destructive",
      });
      
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    console.log("Opening recipe modal for:", recipe.title);
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // Show API key input if keys are not set
  if (!spoonacularApiKey || !googleAiApiKey) {
    return <ApiKeyInput onApiKeysSet={handleApiKeysSet} />;
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
            🍳 Trasforma i tuoi ingredienti in deliziose ricette con l'intelligenza artificiale
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
