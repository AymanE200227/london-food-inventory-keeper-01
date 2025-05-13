
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDrinksPDF, generateIngredientsPDF } from "@/utils/pdfUtils";
import { loadDummyData } from "@/utils/localStorage";
import { Drink, Ingredient } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ReportControlsProps {
  drinks: Drink[];
  ingredients: Ingredient[];
  onDummyDataLoaded: (data: { drinks: Drink[]; ingredients: Ingredient[] }) => void;
}

export default function ReportControls({
  drinks,
  ingredients,
  onDummyDataLoaded
}: ReportControlsProps) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [phoneNumber, setPhoneNumber] = useState<string>("+212760834914");
  const { toast } = useToast();

  const handleSendReport = () => {
    // Open WhatsApp with a predefined message
    const reportUrl = `https://api.whatsapp.com/send?phone=${phoneNumber.replace("+", "")}&text=${encodeURIComponent(
      `تقرير ${period === "daily" ? "يومي" : period === "weekly" ? "أسبوعي" : "شهري"} من مطعم لندن فود:\n\n` +
      `المشروبات المباعة: ${drinks.reduce((acc, drink) => acc + drink.sold, 0)} وحدة\n` +
      `المكونات المستخدمة: ${ingredients.reduce((acc, ing) => acc + ing.used, 0)} وحدة\n\n` +
      `المشروبات الأكثر مبيعاً:\n` +
      drinks
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 3)
        .map((d) => `- ${d.name}: ${d.sold} وحدة`)
        .join("\n") +
      `\n\nالمكونات منخفضة المخزون:\n` +
      ingredients
        .filter((i) => i.remaining / i.initialStock < 0.2 && i.initialStock > 0)
        .map((i) => `- ${i.name}: ${Math.round((i.remaining / i.initialStock) * 100)}% متبقي`)
        .join("\n")
    )}`;
    
    window.open(reportUrl, "_blank");
    
    toast({
      title: "تم إرسال التقرير",
      description: "تم فتح WhatsApp لإرسال التقرير",
    });
  };

  const handleSendAlert = () => {
    const items = [
      ...drinks.filter(d => d.discrepancy > 0).map(d => `نقص في ${d.name}: ${d.discrepancy} وحدة`),
      ...ingredients
        .filter(i => i.remaining / i.initialStock < 0.2 && i.initialStock > 0)
        .map(i => `${i.name} على وشك النفاد (${Math.round((i.remaining / i.initialStock) * 100)}% متبقي)`)
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
    
    window.open(alertUrl, "_blank");
    
    toast({
      title: "تم إرسال التنبيه",
      description: "تم فتح WhatsApp لإرسال التنبيه",
    });
  };
  
  const handleExportDrinksPDF = () => {
    generateDrinksPDF(drinks);
    toast({
      title: "تم تصدير التقرير",
      description: "تم تحميل تقرير المشروبات بصيغة PDF",
    });
  };
  
  const handleExportIngredientsPDF = () => {
    generateIngredientsPDF(ingredients);
    toast({
      title: "تم تصدير التقرير",
      description: "تم تحميل تقرير المكونات بصيغة PDF",
    });
  };
  
  const handleLoadDummyData = () => {
    const data = loadDummyData();
    onDummyDataLoaded(data);
    toast({
      title: "تم تحميل البيانات التجريبية",
      description: "تم إضافة بيانات تجريبية للمشروبات والمكونات",
    });
  };

  return (
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>إرسال التقارير</Label>
            <div className="flex flex-col gap-2">
              <Button className="w-full" onClick={handleSendReport}>
                إرسال تقرير إلى واتساب
              </Button>
              <Button variant="outline" className="w-full" onClick={handleSendAlert}>
                إرسال التنبيهات إلى واتساب
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>تصدير التقارير (PDF)</Label>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" className="w-full" onClick={handleExportDrinksPDF}>
                تحميل تقرير المشروبات (PDF)
              </Button>
              <Button variant="secondary" className="w-full" onClick={handleExportIngredientsPDF}>
                تحميل تقرير المكونات (PDF)
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={handleLoadDummyData} 
            variant="outline" 
            className="w-full"
          >
            تحميل بيانات تجريبية
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
