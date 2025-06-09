
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff, ExternalLink } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeysSet: (spoonacularKey: string, googleAiKey: string) => void;
}

const ApiKeyInput = ({ onApiKeysSet }: ApiKeyInputProps) => {
  const [spoonacularKey, setSpoonacularKey] = useState("");
  const [googleAiKey, setGoogleAiKey] = useState("");
  const [showSpoonacularKey, setShowSpoonacularKey] = useState(false);
  const [showGoogleAiKey, setShowGoogleAiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (spoonacularKey.trim() && googleAiKey.trim()) {
      console.log("API keys set:", { spoonacularKey: "***", googleAiKey: "***" });
      onApiKeysSet(spoonacularKey.trim(), googleAiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Key className="text-primary" />
            Configurazione API
          </CardTitle>
          <CardDescription className="text-base">
            Per utilizzare Chef AI Assistant, inserisci le tue chiavi API per Spoonacular e Google AI Studio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="spoonacular-key" className="text-sm font-medium">
                  Chiave API Spoonacular
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="spoonacular-key"
                    type={showSpoonacularKey ? "text" : "password"}
                    value={spoonacularKey}
                    onChange={(e) => setSpoonacularKey(e.target.value)}
                    placeholder="Inserisci la tua chiave API Spoonacular"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSpoonacularKey(!showSpoonacularKey)}
                  >
                    {showSpoonacularKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Ottieni la tua chiave gratuita su{" "}
                  <a 
                    href="https://spoonacular.com/food-api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    spoonacular.com
                    <ExternalLink size={12} />
                  </a>
                </p>
              </div>

              <div>
                <Label htmlFor="google-ai-key" className="text-sm font-medium">
                  Chiave API Google AI Studio
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="google-ai-key"
                    type={showGoogleAiKey ? "text" : "password"}
                    value={googleAiKey}
                    onChange={(e) => setGoogleAiKey(e.target.value)}
                    placeholder="Inserisci la tua chiave API Google AI Studio"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowGoogleAiKey(!showGoogleAiKey)}
                  >
                    {showGoogleAiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Ottieni la tua chiave gratuita su{" "}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Google AI Studio
                    <ExternalLink size={12} />
                  </a>
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full cooking-gradient text-white"
              disabled={!spoonacularKey.trim() || !googleAiKey.trim()}
            >
              Inizia a cucinare!
            </Button>

            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>🔒 Le tue chiavi API sono salvate localmente nel browser</p>
              <p>🍳 Chef AI Studio utilizzerà l'AI per suggerire ricette perfette</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyInput;
