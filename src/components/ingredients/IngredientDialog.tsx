
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "initialStock" || name === "used" || name === "remaining") {
      const numValue = parseFloat(value) || 0;
      
      if (name === "initialStock") {
        const remaining = numValue - formData.used;
        setFormData({
          ...formData,
          initialStock: numValue,
          remaining
        });
      } else if (name === "used") {
        const remaining = formData.initialStock - numValue;
        setFormData({
          ...formData,
          used: numValue,
          remaining
        });
      } else {
        setFormData({
          ...formData,
          [name]: numValue,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUnitChange = (value: string) => {
    setFormData({
      ...formData,
      unit: value,
    });
  };

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

          <div className="grid gap-4 py-4">
            {(mode === "add" || mode === "edit") && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-left">
                    الاسم (بالإنجليزية)
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="col-span-3 font-english"
                    placeholder="Eggs"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nameAr" className="text-left">
                    الاسم (بالعربية)
                  </Label>
                  <Input
                    id="nameAr"
                    name="nameAr"
                    className="col-span-3"
                    placeholder="بيض"
                    value={formData.nameAr || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-left">
                    الوصف
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="col-span-3"
                    placeholder="وصف المكون"
                    value={formData.description || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-left">
                    رابط الصورة
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    className="col-span-3"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="initialStock" className="text-left">
                    المخزون الأصلي
                  </Label>
                  <Input
                    id="initialStock"
                    name="initialStock"
                    type="number"
                    min="0"
                    step="0.01"
                    className="col-span-2"
                    value={formData.initialStock}
                    onChange={handleChange}
                    required
                  />
                  <Select
                    value={formData.unit}
                    onValueChange={handleUnitChange}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="وحدة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">كجم</SelectItem>
                      <SelectItem value="g">جم</SelectItem>
                      <SelectItem value="l">لتر</SelectItem>
                      <SelectItem value="pcs">قطعة</SelectItem>
                      <SelectItem value="box">علبة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {mode === "update" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="used" className="text-left">
                    المستخدم
                  </Label>
                  <Input
                    id="used"
                    name="used"
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.initialStock}
                    className="col-span-2"
                    value={formData.used}
                    onChange={handleChange}
                    required
                  />
                  <div className="w-[80px] text-center">
                    {formData.unit}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="remaining" className="text-left">
                    المتبقي
                  </Label>
                  <Input
                    id="remaining"
                    name="remaining"
                    type="number"
                    step="0.01"
                    className="col-span-2"
                    value={formData.remaining}
                    readOnly
                  />
                  <div className="w-[80px] text-center">
                    {formData.unit}
                  </div>
                </div>
              </>
            )}
          </div>

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
