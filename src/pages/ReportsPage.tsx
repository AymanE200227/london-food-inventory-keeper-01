
import { useState, useEffect } from "react";
import { getDrinks, getIngredients } from "@/utils/localStorage";
import { Drink, Ingredient } from "@/types";
import PageTitle from "@/components/layout/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ReportControls from "@/components/reports/ReportControls";

export default function ReportsPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    setDrinks(getDrinks());
    setIngredients(getIngredients());
  }, []);

  const handleDummyDataLoaded = (data: { drinks: Drink[], ingredients: Ingredient[] }) => {
    setDrinks(data.drinks);
    setIngredients(data.ingredients);
  };

  const getDrinkData = () => {
    return drinks.map((drink) => ({
      name: drink.name,
      value: drink.sold,
    })).filter(item => item.value > 0);
  };

  const getIngredientData = () => {
    return ingredients.map((ingredient) => ({
      name: ingredient.name,
      value: Math.round((ingredient.used / ingredient.initialStock) * 100),
    })).filter(item => item.value > 0);
  };

  const getLowStockItems = () => {
    return ingredients.filter(
      (ingredient) => ingredient.remaining / ingredient.initialStock < 0.2 && ingredient.initialStock > 0
    );
  };

  const COLORS = ["#ea384c", "#D4B08C", "#1A1F2C", "#D85C27", "#CCA43B"];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="التقارير والإحصائيات"
        description="عرض وتحليل بيانات المخزون والمبيعات"
      />

      <div className="mb-8">
        <ReportControls 
          drinks={drinks} 
          ingredients={ingredients} 
          onDummyDataLoaded={handleDummyDataLoaded}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>المشروبات المباعة</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            {getDrinkData().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getDrinkData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {getDrinkData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} وحدة`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                لا توجد بيانات متاحة
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>استخدام المكونات</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            {getIngredientData().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getIngredientData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "استخدام"]} />
                  <Bar dataKey="value" fill="#ea384c" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                لا توجد بيانات متاحة
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ملخص المخزون</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">المشروبات</h3>
              <p>إجمالي المشروبات: {drinks.length}</p>
              <p>إجمالي المبيعات: {drinks.reduce((acc, drink) => acc + drink.sold, 0)} وحدة</p>
              <p>الفروقات: {drinks.reduce((acc, drink) => acc + drink.discrepancy, 0)} وحدة</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">المكونات</h3>
              <p>إجمالي المكونات: {ingredients.length}</p>
              <p>المستخدم: {ingredients.reduce((acc, ingredient) => acc + ingredient.used, 0).toFixed(2)} وحدة</p>
              <p>العناصر منخفضة المخزون: {getLowStockItems().length}</p>
            </div>
            
            {getLowStockItems().length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-2">المكونات التي تحتاج للتزويد</h3>
                <ul className="list-disc list-inside">
                  {getLowStockItems().map((item) => (
                    <li key={item.id}>
                      {item.name}: {Math.round((item.remaining / item.initialStock) * 100)}% متبقي
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
