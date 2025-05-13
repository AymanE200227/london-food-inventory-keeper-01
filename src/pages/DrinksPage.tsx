
import { useState, useEffect } from "react";
import { Drink } from "@/types";
import { getDrinks, saveDrink, deleteDrink } from "@/utils/localStorage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CardItem } from "@/components/ui/card-item";
import DrinkDialog from "@/components/drinks/DrinkDialog";
import PageTitle from "@/components/layout/PageTitle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function DrinksPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | undefined>();
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "verify">("add");
  const [autoReport, setAutoReport] = useState(() => {
    const saved = localStorage.getItem("auto-report-whatsapp");
    return saved ? JSON.parse(saved) : false;
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDrinks();
  }, []);

  useEffect(() => {
    localStorage.setItem("auto-report-whatsapp", JSON.stringify(autoReport));
  }, [autoReport]);

  const loadDrinks = () => {
    setDrinks(getDrinks());
  };

  const handleAddDrink = () => {
    setSelectedDrink(undefined);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEditDrink = (drink: Drink) => {
    setSelectedDrink(drink);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleVerifyDrink = (drink: Drink) => {
    setSelectedDrink(drink);
    setDialogMode("verify");
    setDialogOpen(true);
  };

  const handleDeleteClick = (drink: Drink) => {
    setSelectedDrink(drink);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDrink) {
      deleteDrink(selectedDrink.id);
      loadDrinks();
      toast({
        description: `تم حذف ${selectedDrink.nameAr || selectedDrink.name} بنجاح`,
      });
      setDeleteDialogOpen(false);
    }
  };

  const sendToWhatsApp = (drink: Drink) => {
    const phoneNumber = "+212760834914"; // Default number from reports page
    const message = `تنبيه: هناك نقص في مخزون ${drink.nameAr || drink.name} بمقدار ${drink.discrepancy} وحدة من أصل ${drink.initialStock} وحدة`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber.replace("+", "")}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSaveDrink = (drink: Drink) => {
    saveDrink(drink);
    loadDrinks();
    setDialogOpen(false);
    toast({
      description: dialogMode === "verify" 
        ? `تم تحديث مخزون ${drink.nameAr || drink.name} بنجاح` 
        : dialogMode === "add" 
        ? `تمت إضافة ${drink.nameAr || drink.name} بنجاح` 
        : `تم تعديل ${drink.nameAr || drink.name} بنجاح`,
    });
    
    // Show alert if discrepancy found
    if (dialogMode === "verify" && drink.discrepancy > 0) {
      toast({
        title: "تنبيه",
        description: `هناك نقص في مخزون ${drink.nameAr || drink.name} بمقدار ${drink.discrepancy} وحدة من أصل ${drink.initialStock} وحدة`,
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => sendToWhatsApp(drink)}
            className="bg-white text-destructive"
          >
            <Send className="h-4 w-4 mr-2" />
            إرسال تنبيه
          </Button>
        )
      });
      
      // Auto-send to WhatsApp if enabled
      if (autoReport) {
        sendToWhatsApp(drink);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="إدارة المشروبات"
        description="إضافة وتعديل ومراقبة مخزون المشروبات"
        action={
          <Button onClick={handleAddDrink}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مشروب
          </Button>
        }
      />
      
      <div className="my-4 p-4 bg-moroccan-accent/10 rounded-lg flex items-center justify-between border border-moroccan-accent/30">
        <div className="flex items-center">
          <div className="mr-4 p-2 bg-moroccan-accent/20 rounded-full">
            <Send className="h-5 w-5 text-moroccan-accent" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">التقارير التلقائية</h3>
            <p className="text-sm text-muted-foreground">إرسال تنبيهات تلقائية عبر واتساب عند اكتشاف نقص</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-report"
            checked={autoReport}
            onCheckedChange={setAutoReport}
          />
          <Label htmlFor="auto-report" className="mr-2">
            {autoReport ? "مفعل" : "معطل"}
          </Label>
        </div>
      </div>

      {drinks.length === 0 ? (
        <div className="text-center py-12 moroccan-pattern rounded-lg">
          <h3 className="text-xl font-bold mb-2">لا توجد مشروبات</h3>
          <p className="text-muted-foreground mb-6">
            قم بإضافة مشروبات لبدء إدارة المخزون
          </p>
          <Button onClick={handleAddDrink}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مشروب جديد
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drinks.map((drink) => (
            <CardItem
              key={drink.id}
              title={drink.nameAr || drink.name}
              description={drink.description}
              image={drink.image}
              stock={drink.initialStock}
              remaining={drink.actualRemaining}
              discrepancy={drink.discrepancy}
              lastUpdated={new Date(drink.lastUpdated).toLocaleDateString("ar-MA")}
              onEdit={() => handleEditDrink(drink)}
              onDelete={() => handleDeleteClick(drink)}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-4 left-4 md:left-auto md:right-4 md:bottom-4 flex flex-col gap-2">
        {drinks.length > 0 && (
          <Button 
            size="lg" 
            className="shadow-lg bg-moroccan-accent hover:bg-moroccan-accent/80 text-moroccan-black"
            onClick={() => {
              const lastDrink = drinks[drinks.length - 1];
              handleVerifyDrink(lastDrink);
            }}
          >
            التحقق من المخزون
          </Button>
        )}
      </div>

      {selectedDrink && (
        <>
          <DrinkDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSave={handleSaveDrink}
            drink={selectedDrink}
            mode={dialogMode}
          />

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                <AlertDialogDescription>
                  سيتم حذف {selectedDrink.nameAr || selectedDrink.name} بشكل نهائي.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>حذف</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {dialogMode === "add" && (
        <DrinkDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveDrink}
          drink={undefined}
          mode="add"
        />
      )}
    </div>
  );
}
