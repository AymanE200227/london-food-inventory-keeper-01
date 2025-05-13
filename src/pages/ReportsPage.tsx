
import { useState, useEffect } from "react";
import { getDrinks, getIngredients } from "@/utils/localStorage";
import { Drink, Ingredient } from "@/types";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ReportsPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [phoneNumber, setPhoneNumber] = useState<string>("+212760834914");
  const { toast } = useToast();

  useEffect(() => {
    setDrinks(getDrinks());
    setIngredients(getIngredients());
  }, []);

  const getDrinkData = () => {
    return drinks.map((drink) => ({
      name: drink.nameAr || drink.name,
      value: drink.sold,
    })).filter(item => item.value > 0);
  };

  const getIngredientData = () => {
    return ingredients.map((ingredient) => ({
      name: ingredient.nameAr || ingredient.name,
      value: Math.round((ingredient.used / ingredient.initialStock) * 100),
    })).filter(item => item.value > 0);
  };

  const getLowStockItems = () => {
    return ingredients.filter(
      (ingredient) => ingredient.remaining / ingredient.initialStock < 0.2 && ingredient.initialStock > 0
    );
  };

  const COLORS = ["#ea384c", "#D4B08C", "#1A1F2C", "#D85C27", "#CCA43B"];

  const handleSendReport = () => {
    // In a real app, this would send the report via WhatsApp API
    // Here we'll just show a toast notification
    const reportUrl = `https://api.whatsapp.com/send?phone=${phoneNumber.replace("+", "")}&text=${encodeURIComponent(
      `تقرير ${period === "daily" ? "يومي" : period === "weekly" ? "أسبوعي" : "شهري"} من مطعم لندن فود:\n\n` +
      `المشروبات المباعة: ${drinks.reduce((acc, drink) => acc + drink.sold, 0)} وحدة\n` +
      `المكونات المستخدمة: ${ingredients.reduce((acc, ing) => acc + ing.used, 0)} وحدة\n\n` +
      `المشروبات الأكثر مبيعاً:\n` +
      drinks
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 3)
        .map((d) => `- ${d.nameAr || d.name}: ${d.sold} وحدة`)
        .join("\n") +
      `\n\nالمكونات منخفضة المخزون:\n` +
      getLowStockItems()
        .map((i) => `- ${i.nameAr || i.name}: ${Math.round((i.remaining / i.initialStock) * 100)}% متبقي`)
        .join("\n")
    )}`;
    
    // Open WhatsApp in a new window
    window.open(reportUrl, "_blank");
    
    toast({
      title: "تم إرسال التقرير",
      description: "تم فتح WhatsApp لإرسال التقرير",
    });
  };

  const handleSendAlert = () => {
    // In a real app, this would send an alert via WhatsApp API
    // Here we'll just open WhatsApp with a predefined message
    const items = [
      ...drinks.filter(d => d.discrepancy > 0).map(d => `نقص في ${d.nameAr || d.name}: ${d.discrepancy} وحدة`),
      ...getLowStockItems().map(i => `${i.nameAr || i.name} على وشك النفاد (${Math.round((i.remaining / i.initialStock) * 100)}% متبقي)`)
    ];
    
    if (items.length === 0) {
      toast({
        description: "لا توجد تنبيهات للإرسال",
      });
      return;
    }
    
    const alertUrl = `https://api.whatsapp.com/send?phone=${phoneNumber.replace("+", "")}&text=${encodeURIComponent(
      `تنبيهات من مطعم لندن فود:\n\n` + items.join("\n")
    )}`;
    
    // Open WhatsApp in a new window
    window.open(alertUrl, "_blank");
    
    toast({
      title: "تم إرسال التنبيه",
      description: "تم فتح WhatsApp لإرسال التنبيه",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="التقارير والإحصائيات"
        description="عرض وتحليل بيانات المخزون والمبيعات"
      />

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>إعدادات التقارير</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">الفترة الزمنية</Label>
                <Tabs
                  defaultValue="daily"
                  value={period}
                  onValueChange={(value) => setPeriod(value as "daily" | "weekly" | "monthly")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="daily">يومي</TabsTrigger>
                    <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
                    <TabsTrigger value="monthly">شهري</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">رقم الواتساب</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+212XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1" onClick={handleSendReport}>
                إرسال تقرير إلى واتساب
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleSendAlert}>
                إرسال التنبيهات إلى واتساب
              </Button>
            </div>
          </CardContent>
        </Card>
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
                      {item.nameAr || item.name}: {Math.round((item.remaining / item.initialStock) * 100)}% متبقي
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
