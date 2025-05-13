import { Drink, Ingredient, ReportData } from "../types";
import { generateDummyDrinks, generateDummyIngredients } from "./dummyData";

// Drinks Storage
export const saveDrinks = (drinks: Drink[]): void => {
  localStorage.setItem("london-food-drinks", JSON.stringify(drinks));
};

export const getDrinks = (): Drink[] => {
  const drinks = localStorage.getItem("london-food-drinks");
  return drinks ? JSON.parse(drinks) : [];
};

export const saveDrink = (drink: Drink): void => {
  const drinks = getDrinks();
  const index = drinks.findIndex((d) => d.id === drink.id);
  
  if (index >= 0) {
    drinks[index] = drink;
  } else {
    drinks.push(drink);
  }
  
  saveDrinks(drinks);
};

export const deleteDrink = (id: string): void => {
  const drinks = getDrinks().filter((drink) => drink.id !== id);
  saveDrinks(drinks);
};

// Ingredients Storage
export const saveIngredients = (ingredients: Ingredient[]): void => {
  localStorage.setItem("london-food-ingredients", JSON.stringify(ingredients));
};

export const getIngredients = (): Ingredient[] => {
  const ingredients = localStorage.getItem("london-food-ingredients");
  return ingredients ? JSON.parse(ingredients) : [];
};

export const saveIngredient = (ingredient: Ingredient): void => {
  const ingredients = getIngredients();
  const index = ingredients.findIndex((i) => i.id === ingredient.id);
  
  if (index >= 0) {
    ingredients[index] = ingredient;
  } else {
    ingredients.push(ingredient);
  }
  
  saveIngredients(ingredients);
};

export const deleteIngredient = (id: string): void => {
  const ingredients = getIngredients().filter((ingredient) => ingredient.id !== id);
  saveIngredients(ingredients);
};

// Reports Storage
export const saveReports = (reports: ReportData[]): void => {
  localStorage.setItem("london-food-reports", JSON.stringify(reports));
};

export const getReports = (): ReportData[] => {
  const reports = localStorage.getItem("london-food-reports");
  return reports ? JSON.parse(reports) : [];
};

export const addReport = (report: ReportData): void => {
  const reports = getReports();
  reports.push(report);
  saveReports(reports);
};

// Load dummy data into localStorage
export const loadDummyData = () => {
  localStorage.setItem('drinks', JSON.stringify(generateDummyDrinks()));
  localStorage.setItem('ingredients', JSON.stringify(generateDummyIngredients()));
  return {
    drinks: generateDummyDrinks(),
    ingredients: generateDummyIngredients()
  };
};
