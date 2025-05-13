
import { useEffect, useState } from "react";
import { Ingredient } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import IngredientForm from "./IngredientForm";

interface IngredientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ingredient: Ingredient) => void;
  ingredient?: Ingredient;
  mode: "add" | "edit" | "update";
}

export default function IngredientDialog({
  isOpen,
  onClose,
  onSave,
  ingredient,
  mode,
}: IngredientDialogProps) {
  const [formData, setFormData] = useState<Ingredient>({
    id: "",
    name: "",
    description: "",
    image: "",
    initialStock: 0,
    used: 0,
    remaining: 0,
    unit: "kg",
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    if (ingredient && mode !== "add") {
      setFormData(ingredient);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        name: "",
        description: "",
        image: "",
        initialStock: 0,
        used: 0,
        remaining: 0,
        unit: "kg",
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [ingredient, mode]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      ...formData,
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" 
                ? "إضافة مكون جديد" 
                : mode === "edit" 
                ? "تعديل مكون" 
                : "تحديث المخزون"}
            </DialogTitle>
            <DialogDescription>
              {mode === "update"
                ? "أدخل الكمية المستخدمة لتحديث المخزون"
                : "أدخل تفاصيل المكون هنا. اضغط على حفظ عند الانتهاء."}
            </DialogDescription>
          </DialogHeader>

          <IngredientForm 
            formData={formData}
            mode={mode}
            onChange={setFormData}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">حفظ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
