export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
}

export interface Ingredient {
  id: number;
  name: string;
  original: string;
  amount: number;
  unit: string;
}

export interface InstructionStep {
  number: number;
  step: string;
}

export interface Instruction {
  steps: InstructionStep[];
}

export interface RecipeDetail extends Recipe {
  extendedIngredients: Ingredient[];
  analyzedInstructions: Instruction[];
  summary?: string;
  cuisines?: string[];
}