
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "initialStock" || name === "sold" || name === "actualRemaining") {
      const numValue = parseInt(value, 10) || 0;
      
      if (name === "initialStock") {
        const expectedRemaining = numValue - formData.sold;
        const discrepancy = expectedRemaining - formData.actualRemaining;
        
        setFormData({
          ...formData,
          initialStock: numValue,
          expectedRemaining,
          discrepancy
        });
      } else if (name === "sold") {
        const expectedRemaining = formData.initialStock - numValue;
        const discrepancy = expectedRemaining - formData.actualRemaining;
        
        setFormData({
          ...formData,
          sold: numValue,
          expectedRemaining,
          discrepancy
        });
      } else if (name === "actualRemaining") {
        const discrepancy = formData.expectedRemaining - numValue;
        
        setFormData({
          ...formData,
          actualRemaining: numValue,
          discrepancy
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
              {mode === "add" ? "إضافة مشروب جديد" : mode === "edit" ? "تعديل مشروب" : "التحقق من المخزون"}
            </DialogTitle>
            <DialogDescription>
              {mode === "verify"
                ? "أدخل الكمية المتبقية الفعلية للتحقق من المخزون"
                : "أدخل تفاصيل المشروب هنا. اضغط على حفظ عند الانتهاء."}
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
                    placeholder="Coca Cola"
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
                    placeholder="كوكا كولا"
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
                    placeholder="وصف المشروب"
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
                    className="col-span-3"
                    value={formData.initialStock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sold" className="text-left">
                    المبيعات
                  </Label>
                  <Input
                    id="sold"
                    name="sold"
                    type="number"
                    min="0"
                    max={formData.initialStock}
                    className="col-span-3"
                    value={formData.sold}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {(mode === "verify" || mode === "add" || mode === "edit") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="actualRemaining"
                  className="text-left"
                >
                  المتبقي الفعلي
                </Label>
                <Input
                  id="actualRemaining"
                  name="actualRemaining"
                  type="number"
                  min="0"
                  className="col-span-3"
                  value={formData.actualRemaining}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {(mode === "verify" || mode === "edit") && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="expectedRemaining"
                    className="text-left"
                  >
                    المتبقي المتوقع
                  </Label>
                  <Input
                    id="expectedRemaining"
                    name="expectedRemaining"
                    type="number"
                    className="col-span-3"
                    value={formData.expectedRemaining}
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discrepancy" className="text-left">
                    الفرق
                  </Label>
                  <div
                    className={`col-span-3 text-center p-2 rounded ${
                      formData.discrepancy > 0
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted"
                    }`}
                  >
                    {formData.discrepancy === 0
                      ? "لا يوجد فرق"
                      : formData.discrepancy > 0
                      ? `نقص ${formData.discrepancy} وحدة`
                      : `زيادة ${Math.abs(formData.discrepancy)} وحدة`}
                  </div>
                </div>
              </>
            )}
          </div>

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
