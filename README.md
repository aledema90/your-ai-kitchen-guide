# Your AI Kitchen Guide

Turn a list of ingredients into recipe ideas using AI-assisted ingredient normalization and the Spoonacular recipe API.

<img width="2531" height="827" alt="image" src="https://github.com/user-attachments/assets/82b5767e-789e-4a88-8b2d-8500c725fab8" />



## Features

- Search recipes by available ingredients.
- AI ingredient enhancement (Gemini) before API lookup.
- Recipe cards with quick details (time, servings, score).
- Recipe detail modal for deeper information.
- Toast-based feedback for loading/error states.

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- TanStack Query (provider configured)

## Getting Started

### 1) Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or compatible)

### 2) Install dependencies

```bash
npm install
```

## Environment variables

Create a `.env` file in the project root using the template in `.env.example`.
Never commit `.env` files or API keys to GitHub.
Create a `.env` file in the project root:

```bash
VITE_SPOONACULAR_API_KEY=your_spoonacular_key
VITE_GOOGLE_AI_API_KEY=your_google_ai_studio_key
```

Notes:

- Variables must start with `VITE_` to be available in the frontend.
- Never commit real API keys to version control.

### 4) Run locally

```bash
npm run dev
```

By default, Vite runs at [http://localhost:5173](http://localhost:5173).

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - production build
- `npm run build:dev` - development-mode build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## How It Works

1. User enters ingredients in the search input.
2. App sends ingredients to Google Gemini to normalize/translate for better recipe matching.
3. Enhanced ingredient list is sent to Spoonacular `findByIngredients`.
4. Results are displayed as recipe cards.
5. Selecting a recipe opens a modal with additional recipe data.

## Project Structure

```text
src/
  components/
    Header.tsx
    IngredientInput.tsx
    RecipeResults.tsx
    RecipeCard.tsx
    RecipeModal.tsx
    ui/...
  hooks/
    use-toast.ts
  pages/
    Index.tsx
    NotFound.tsx
  App.tsx
  main.tsx
```

## Troubleshooting

- **"Errore di Configurazione" in UI**
  - Ensure `.env` exists and both API keys are set.
  - Restart the dev server after changing env vars.
- **No recipe results**
  - Verify API key validity/quotas.
  - Try broader ingredient terms.
- **Request errors in browser console**
  - Check network restrictions, CORS behavior, and key permissions.

## Security Notes

- This project currently calls third-party APIs from the client.
- For production hardening, proxy requests through a backend to avoid exposing API keys in the browser.

## Original Lovable Project

This codebase was initially generated with Lovable:
[https://lovable.dev/projects/12c24799-27fa-470d-a2a4-c744342842fd](https://lovable.dev/projects/12c24799-27fa-470d-a2a4-c744342842fd)
