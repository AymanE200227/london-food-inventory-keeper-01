
import { Drink, Ingredient } from "@/types";

export const generateDummyDrinks = (): Drink[] => {
  return [
    {
      id: "d1",
      name: "Coca Cola",
      nameAr: "كوكا كولا",
      description: "Refreshing carbonated drink",
      image: "",
      initialStock: 24,
      sold: 10,
      expectedRemaining: 14,
      actualRemaining: 12,
      discrepancy: 2,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "d2",
      name: "Orange Juice",
      nameAr: "عصير البرتقال",
      description: "Fresh orange juice",
      image: "",
      initialStock: 15,
      sold: 7,
      expectedRemaining: 8,
      actualRemaining: 8,
      discrepancy: 0,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "d3",
      name: "Mint Tea",
      nameAr: "شاي بالنعناع",
      description: "Traditional Moroccan mint tea",
      image: "",
      initialStock: 30,
      sold: 22,
      expectedRemaining: 8,
      actualRemaining: 7,
      discrepancy: 1,
      lastUpdated: new Date().toISOString()
    }
  ];
};

export const generateDummyIngredients = (): Ingredient[] => {
  return [
    {
      id: "i1",
      name: "Chicken",
      nameAr: "دجاج",
      description: "Fresh chicken",
      image: "",
      initialStock: 10,
      used: 4.5,
      remaining: 5.5,
      unit: "kg",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "i2",
      name: "Rice",
      nameAr: "أرز",
      description: "Basmati rice",
      image: "",
      initialStock: 25,
      used: 8,
      remaining: 17,
      unit: "kg",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "i3",
      name: "Olive Oil",
      nameAr: "زيت الزيتون",
      description: "Extra virgin olive oil",
      image: "",
      initialStock: 5,
      used: 2.5,
      remaining: 2.5,
      unit: "l",
      lastUpdated: new Date().toISOString()
    }
  ];
};
