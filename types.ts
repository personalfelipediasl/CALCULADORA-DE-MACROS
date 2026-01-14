
export type Language = 'pt' | 'en';

export interface FoodItem {
  id: string;
  name: string;
  measure: string; // 'unid', 'fatia' ou '100g'
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  category: string;
  maxPortion?: number; // em gramas/ml
  minPortion?: number; // em gramas/ml
}

export interface UserMacroGoals {
  tdee: number;
  cutting: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface LoggedFood {
  foodId: string;
  amount: number; // em gramas ou unidades
}

export interface Meal {
  id: number;
  name: string;
  items: LoggedFood[];
}