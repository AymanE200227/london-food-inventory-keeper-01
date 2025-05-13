
import { useState, useEffect } from "react";
import { Ingredient } from "@/types";
import { getIngredients, saveIngredient, deleteIngredient } from "@/utils/localStorage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CardItem } from "@/components/ui/card-item";
import IngredientDialog from "@/components/ingredients/IngredientDialog";
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

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | undefined>();
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "update">("add");
  const { toast } = useToast();

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = () => {
    setIngredients(getIngredients());
  };

  const handleAddIngredient = () => {
    setSelectedIngredient(undefined);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleUpdateStock = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setDialogMode("update");
    setDialogOpen(true);
  };

  const handleDeleteClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedIngredient) {
      deleteIngredient(selectedIngredient.id);
      loadIngredients();
      toast({
        description: `تم حذف ${selectedIngredient.nameAr || selectedIngredient.name} بنجاح`,
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveIngredient = (ingredient: Ingredient) => {
    saveIngredient(ingredient);
    loadIngredients();
    setDialogOpen(false);
    toast({
      description: dialogMode === "update" 
        ? `تم تحديث مخزون ${ingredient.nameAr || ingredient.name} بنجاح` 
        : dialogMode === "add" 
        ? `تمت إضافة ${ingredient.nameAr || ingredient.name} بنجاح` 
        : `تم تعديل ${ingredient.nameAr || ingredient.name} بنجاح`,
    });
    
    // Show alert if stock is low (less than 20% remaining)
    const ratio = ingredient.remaining / ingredient.initialStock;
    if (dialogMode === "update" && ratio < 0.2 && ingredient.initialStock > 0) {
      toast({
        title: "تنبيه",
        description: `المكون ${ingredient.nameAr || ingredient.name} على وشك النفاد (${Math.round(ratio * 100)}% متبقي)`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="إدارة المكونات"
        description="إضافة وتعديل ومراقبة مخزون المكونات الأولية"
        action={
          <Button onClick={handleAddIngredient}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مكون
          </Button>
        }
      />

      {ingredients.length === 0 ? (
        <div className="text-center py-12 moroccan-pattern rounded-lg">
          <h3 className="text-xl font-bold mb-2">لا توجد مكونات</h3>
          <p className="text-muted-foreground mb-6">
            قم بإضافة مكونات لبدء إدارة المخزون
          </p>
          <Button onClick={handleAddIngredient}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مكون جديد
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ingredients.map((ingredient) => (
            <CardItem
              key={ingredient.id}
              title={ingredient.nameAr || ingredient.name}
              description={ingredient.description}
              image={ingredient.image}
              stock={ingredient.initialStock}
              remaining={ingredient.remaining}
              lastUpdated={new Date(ingredient.lastUpdated).toLocaleDateString("ar-MA")}
              onEdit={() => handleEditIngredient(ingredient)}
              onDelete={() => handleDeleteClick(ingredient)}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-4 left-4 md:left-auto md:right-4 md:bottom-4 flex flex-col gap-2">
        {ingredients.length > 0 && (
          <Button 
            size="lg" 
            className="shadow-lg"
            onClick={() => {
              const lastIngredient = ingredients[ingredients.length - 1];
              handleUpdateStock(lastIngredient);
            }}
          >
            تحديث المخزون
          </Button>
        )}
      </div>

      {selectedIngredient && (
        <>
          <IngredientDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSave={handleSaveIngredient}
            ingredient={selectedIngredient}
            mode={dialogMode}
          />

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                <AlertDialogDescription>
                  سيتم حذف {selectedIngredient.nameAr || selectedIngredient.name} بشكل نهائي.
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
        <IngredientDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveIngredient}
          ingredient={undefined}
          mode="add"
        />
      )}
    </div>
  );
}
