
import { useEffect, useState } from "react";
import { Drink } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DrinkForm from "./DrinkForm";

interface DrinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (drink: Drink) => void;
  drink?: Drink;
  mode: "add" | "edit" | "verify";
}

export default function DrinkDialog({
  isOpen,
  onClose,
  onSave,
  drink,
  mode,
}: DrinkDialogProps) {
  const [formData, setFormData] = useState<Drink>({
    id: "",
    name: "",
    description: "",
    image: "",
    initialStock: 0,
    sold: 0,
    expectedRemaining: 0,
    actualRemaining: 0,
    lastUpdated: new Date().toISOString(),
    discrepancy: 0,
  });

  useEffect(() => {
    if (drink && mode !== "add") {
      setFormData(drink);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        name: "",
        description: "",
        image: "",
        initialStock: 0,
        sold: 0,
        expectedRemaining: 0,
        actualRemaining: 0,
        lastUpdated: new Date().toISOString(),
        discrepancy: 0,
      });
    }
  }, [drink, mode]);

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
              {mode === "add" ? "إضافة مشروب جديد" : mode === "edit" ? "تعديل مشروب" : "التحقق من المخزون"}
            </DialogTitle>
            <DialogDescription>
              {mode === "verify"
                ? "أدخل الكمية المتبقية الفعلية للتحقق من المخزون"
                : "أدخل تفاصيل المشروب هنا. اضغط على حفظ عند الانتهاء."}
            </DialogDescription>
          </DialogHeader>

          <DrinkForm 
            formData={formData}
            mode={mode}
            onChange={setFormData}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">
              {mode === "verify" ? "تأكيد" : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
