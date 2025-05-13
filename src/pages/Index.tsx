
import { useState, useEffect } from "react";
import { getDrinks, getIngredients } from "@/utils/localStorage";
import { Drink, Ingredient } from "@/types";
import PageTitle from "@/components/layout/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Wine, Carrot, BarChart2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setDrinks(getDrinks());
    setIngredients(getIngredients());
  }, []);

  useEffect(() => {
    const newAlerts: string[] = [];
    
    // Check for drink discrepancies
    drinks.forEach(drink => {
      if (drink.discrepancy > 0) {
        newAlerts.push(`هناك نقص في مخزون ${drink.nameAr || drink.name} بمقدار ${drink.discrepancy} وحدة`);
      }
    });
    
    // Check for low stock ingredients (less than 20% of initial)
    ingredients.forEach(ingredient => {
      const ratio = ingredient.remaining / ingredient.initialStock;
      if (ratio < 0.2 && ingredient.initialStock > 0) {
        newAlerts.push(`المكون ${ingredient.nameAr || ingredient.name} على وشك النفاد (${Math.round(ratio * 100)}% متبقي)`);
      }
    });
    
    setAlerts(newAlerts);
  }, [drinks, ingredients]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="لوحة التحكم" 
        description="نظرة عامة على مطعم لندن فود"
      />
      
      {alerts.length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-bold">التنبيهات</h2>
          {alerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>تنبيه</AlertTitle>
              <AlertDescription>
                {alert}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">المشروبات</CardTitle>
            <Wine className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{drinks.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {drinks.reduce((acc, drink) => acc + drink.sold, 0)} وحدة مباعة
            </p>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate("/drinks")}
            >
              إدارة المشروبات
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">المكونات</CardTitle>
            <Carrot className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ingredients.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {ingredients.filter(i => i.remaining / i.initialStock < 0.5).length} مكونات منخفضة
            </p>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate("/ingredients")}
            >
              إدارة المكونات
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">التقارير</CardTitle>
            <BarChart2 className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              قم بإنشاء تقارير مفصلة عن المخزون والمبيعات
            </p>
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate("/reports")}
            >
              عرض التقارير
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 p-8 bg-card rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-4">مرحبًا بك في نظام إدارة مطعم لندن فود</h2>
        <p className="text-muted-foreground mb-6">
          استخدم هذا النظام لإدارة مخزون المشروبات والمكونات وتتبع المبيعات ومراقبة الإحصائيات.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Button onClick={() => navigate("/drinks")} className="flex-1">
            <Wine className="ml-2 h-4 w-4" />
            إدارة المشروبات
          </Button>
          <Button onClick={() => navigate("/ingredients")} variant="outline" className="flex-1">
            <Carrot className="ml-2 h-4 w-4" />
            إدارة المكونات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
