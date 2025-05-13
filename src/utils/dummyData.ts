
import { Drink, Ingredient } from "@/types";

export const generateDummyDrinks = (): Drink[] => {
  return [
    {
      id: "d1",
      name: "Mint Tea",
      nameAr: "شاي بالنعناع",
      description: "شاي مغربي تقليدي بالنعناع",
      image: "",
      initialStock: 30,
      sold: 22,
      expectedRemaining: 8,
      actualRemaining: 7,
      discrepancy: 1,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "d2",
      name: "Orange Juice",
      nameAr: "عصير البرتقال",
      description: "عصير برتقال طازج",
      image: "",
      initialStock: 15,
      sold: 7,
      expectedRemaining: 8,
      actualRemaining: 8,
      discrepancy: 0,
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
      description: "دجاج طازج",
      image: "",
      initialStock: 10,
      used: 4.5,
      remaining: 5.5,
      unit: "كغ",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "i2",
      name: "Rice",
      nameAr: "أرز",
      description: "أرز بسمتي",
      image: "",
      initialStock: 25,
      used: 8,
      remaining: 17,
      unit: "كغ",
      lastUpdated: new Date().toISOString()
    }
  ];
};
