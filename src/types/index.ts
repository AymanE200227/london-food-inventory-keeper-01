
export interface Drink {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  image?: string;
  initialStock: number;
  sold: number;
  expectedRemaining: number;
  actualRemaining: number;
  lastUpdated: string;
  discrepancy: number;
}

export interface Ingredient {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  image?: string;
  initialStock: number;
  used: number;
  remaining: number;
  unit: string;
  lastUpdated: string;
}

export interface ReportData {
  date: string;
  totalSales: number;
  discrepancies: number;
  topDrinks: { name: string; count: number }[];
  lowStock: string[];
}
