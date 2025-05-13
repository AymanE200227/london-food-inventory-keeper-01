
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDrinksPDF, generateIngredientsPDF } from "@/utils/pdfUtils";
import { Drink, Ingredient } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Send, FileText } from "lucide-react";

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
  const [phoneNumber, setPhoneNumber] = useState<string>(() => {
    return localStorage.getItem("whatsapp-number") || "+212760834914";
  });
  const [autoReport, setAutoReport] = useState(() => {
    const saved = localStorage.getItem("auto-report-whatsapp");
    return saved ? JSON.parse(saved) : false;
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("whatsapp-number", phoneNumber);
    localStorage.setItem("auto-report-whatsapp", JSON.stringify(autoReport));
  }, [phoneNumber, autoReport]);

  const handleSendReport = async () => {
    try {
      // Format date based on period
      let dateLabel = "اليوم";
      if (period === "weekly") {
        dateLabel = "الأسبوع";
      } else if (period === "monthly") {
        dateLabel = "الشهر";
      }
      
      // Format the report message in Arabic
      const reportMessage = `
*تقرير ${dateLabel}*

*ملخص المبيعات:*
- إجمالي المشروبات المباعة: ${drinks.reduce((acc, drink) => acc + drink.sold, 0)} وحدة
- إجمالي المواد المستخدمة: ${ingredients.reduce((acc, ing) => acc + ing.used, 0)} وحدة

*أفضل المشروبات مبيعاً:*
${drinks
  .sort((a, b) => b.sold - a.sold)
  .slice(0, 3)
  .map((d) => `- ${d.nameAr || d.name}: ${d.sold} وحدة`)
  .join('\n')}

*المواد منخفضة المخزون:*
${ingredients
  .filter((i) => i.remaining / i.initialStock < 0.2 && i.initialStock > 0)
  .map((i) => `- ${i.nameAr || i.name}: ${Math.round((i.remaining / i.initialStock) * 100)}% متبقي`)
  .join('\n') || 'لا توجد مواد منخفضة المخزون'}

*فروقات المخزون:*
${drinks
  .filter(d => d.discrepancy > 0)
  .map(d => `- ${d.nameAr || d.name}: نقص ${d.discrepancy} وحدة من أصل ${d.initialStock}`)
  .join('\n') || 'لا توجد فروقات في المخزون'}
      `;
      
      // Open WhatsApp with the report
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber.replace(/[+\s]/g, '')}&text=${encodeURIComponent(reportMessage)}`;
      window.open(whatsappUrl, "_blank");
      
      toast({
        title: "تم إعداد التقرير",
        description: "تم فتح واتساب لإرسال التقرير",
      });
    } catch (error) {
      console.error("Error sending report:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال التقرير",
        variant: "destructive"
      });
    }
  };

  const handleSendAlert = async () => {
    try {
      const items = [
        ...drinks.filter(d => d.discrepancy > 0).map(d => `نقص في ${d.nameAr || d.name}: ${d.discrepancy} وحدة من أصل ${d.initialStock} وحدة`),
        ...ingredients
          .filter(i => i.remaining / i.initialStock < 0.2 && i.initialStock > 0)
          .map(i => `${i.nameAr || i.name} على وشك النفاد (${Math.round((i.remaining / i.initialStock) * 100)}% متبقي)`)
      ];
      
      if (items.length === 0) {
        toast({
          description: "لا توجد تنبيهات للإرسال",
        });
        return;
      }

      // Format the alert message in Arabic
      const alertMessage = `
*تنبيه مخزون*

${items.join('\n')}
      `;
      
      // Open WhatsApp with the alert message
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber.replace(/[+\s]/g, '')}&text=${encodeURIComponent(alertMessage)}`;
      window.open(whatsappUrl, "_blank");
      
      toast({
        title: "تم إرسال التنبيه",
        description: "تم فتح واتساب لإرسال التنبيه",
      });
    } catch (error) {
      console.error("Error sending alert:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال التنبيه",
        variant: "destructive"
      });
    }
  };
  
  const handleExportDrinksPDF = () => {
    try {
      generateDrinksPDF(drinks);
      toast({
        title: "تم تصدير التقرير",
        description: "تم تحميل تقرير المشروبات بصيغة PDF",
      });
    } catch (error) {
      console.error("Error exporting drinks PDF:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تصدير تقرير المشروبات",
        variant: "destructive"
      });
    }
  };
  
  const handleExportIngredientsPDF = () => {
    try {
      generateIngredientsPDF(ingredients);
      toast({
        title: "تم تصدير التقرير",
        description: "تم تحميل تقرير المواد الأولية بصيغة PDF",
      });
    } catch (error) {
      console.error("Error exporting ingredients PDF:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تصدير تقرير المواد الأولية",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-moroccan-accent/30">
      <CardHeader className="bg-moroccan-accent/10 border-b border-moroccan-accent/20">
        <CardTitle className="flex items-center">
          <Send className="mr-2 h-5 w-5 text-moroccan-accent" />
          إعدادات التقارير
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
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
        
        <div className="p-4 bg-moroccan-accent/10 rounded-lg flex items-center justify-between border border-moroccan-accent/30">
          <div>
            <h3 className="font-bold text-foreground">التقارير التلقائية</h3>
            <p className="text-sm text-muted-foreground">إرسال تنبيهات تلقائية عند اكتشاف نقص</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-report-settings"
              checked={autoReport}
              onCheckedChange={setAutoReport}
            />
            <Label htmlFor="auto-report-settings" className="mr-2">
              {autoReport ? "مفعل" : "معطل"}
            </Label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>إرسال التقارير</Label>
            <div className="flex flex-col gap-2">
              <Button className="w-full" onClick={handleSendReport}>
                <Send className="ml-2 h-4 w-4" />
                إرسال تقرير
              </Button>
              <Button variant="outline" className="w-full" onClick={handleSendAlert}>
                <Send className="ml-2 h-4 w-4" />
                إرسال التنبيهات
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>تصدير التقارير (PDF)</Label>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" className="w-full" onClick={handleExportDrinksPDF}>
                <FileText className="ml-2 h-4 w-4" />
                تحميل تقرير المشروبات (PDF)
              </Button>
              <Button variant="secondary" className="w-full" onClick={handleExportIngredientsPDF}>
                <FileText className="ml-2 h-4 w-4" />
                تحميل تقرير المواد الأولية (PDF)
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
