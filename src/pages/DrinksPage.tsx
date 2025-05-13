
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
import { Plus } from "lucide-react";

export default function DrinksPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | undefined>();
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "verify">("add");
  const { toast } = useToast();

  useEffect(() => {
    loadDrinks();
  }, []);

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
        description: `هناك نقص في مخزون ${drink.nameAr || drink.name} بمقدار ${drink.discrepancy} وحدة`,
        variant: "destructive",
      });
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
            className="shadow-lg"
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
