
import { useState } from "react";
import { Drink } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadField from "../ingredients/ImageUploadField";
import { Switch } from "@/components/ui/switch";

interface DrinkFormProps {
  formData: Drink;
  mode: "add" | "edit" | "verify";
  onChange: (updatedData: Drink) => void;
}

export default function DrinkForm({
  formData,
  mode,
  onChange,
}: DrinkFormProps) {
  const [isArabic, setIsArabic] = useState<boolean>(!!formData.nameAr);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "initialStock" || name === "sold") {
      const numValue = parseInt(value, 10) || 0;
      
      if (name === "initialStock") {
        const expectedRemaining = numValue - formData.sold;
        const actualRemaining = expectedRemaining; // Auto-calculate actual remaining
        const discrepancy = expectedRemaining - actualRemaining;
        
        onChange({
          ...formData,
          initialStock: numValue,
          expectedRemaining,
          actualRemaining,
          discrepancy
        });
      } else if (name === "sold") {
        const expectedRemaining = formData.initialStock - numValue;
        const actualRemaining = expectedRemaining; // Auto-calculate actual remaining
        const discrepancy = expectedRemaining - actualRemaining;
        
        onChange({
          ...formData,
          sold: numValue,
          expectedRemaining,
          actualRemaining,
          discrepancy
        });
      }
    } else if (name === "name") {
      if (isArabic) {
        onChange({
          ...formData,
          nameAr: value,
          name: formData.name, // Maintain existing English name
        });
      } else {
        onChange({
          ...formData,
          name: value,
          nameAr: formData.nameAr, // Maintain existing Arabic name
        });
      }
    } else {
      onChange({
        ...formData,
        [name]: value,
      });
    }
  };

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  const handleImageChange = (base64Image: string) => {
    onChange({
      ...formData,
      image: base64Image
    });
  };

  return (
    <div className="grid gap-4 py-4">
      {(mode === "add" || mode === "edit") && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              الاسم
            </Label>
            <div className="col-span-3 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={!isArabic ? "font-bold text-primary" : "text-muted-foreground"}>English</span>
                  <Switch
                    checked={isArabic}
                    onCheckedChange={toggleLanguage}
                  />
                  <span className={isArabic ? "font-bold text-primary mr-2" : "text-muted-foreground mr-2"}>العربية</span>
                </div>
              </div>
              <Input
                id="name"
                name="name"
                className="dir-auto"
                dir={isArabic ? "rtl" : "ltr"}
                placeholder={isArabic ? "اسم المشروب بالعربية" : "Drink name in English"}
                value={isArabic ? formData.nameAr || "" : formData.name}
                onChange={handleChange}
                required
              />
            </div>
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

          <ImageUploadField
            currentImage={formData.image || ""}
            onChange={handleImageChange}
          />

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

      {(mode === "verify") && (
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
            onChange={(e) => {
              const numValue = parseInt(e.target.value, 10) || 0;
              const discrepancy = formData.expectedRemaining - numValue;
              onChange({
                ...formData,
                actualRemaining: numValue,
                discrepancy
              });
            }}
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
  );
}
