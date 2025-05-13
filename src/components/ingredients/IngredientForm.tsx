
import { useState, useEffect } from "react";
import { Ingredient } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadField from "./ImageUploadField";

interface IngredientFormProps {
  formData: Ingredient;
  mode: "add" | "edit" | "update";
  onChange: (updatedData: Ingredient) => void;
}

export default function IngredientForm({
  formData,
  mode,
  onChange,
}: IngredientFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "initialStock" || name === "used" || name === "remaining") {
      const numValue = parseFloat(value) || 0;
      
      if (name === "initialStock") {
        const remaining = numValue - formData.used;
        onChange({
          ...formData,
          initialStock: numValue,
          remaining
        });
      } else if (name === "used") {
        const remaining = formData.initialStock - numValue;
        onChange({
          ...formData,
          used: numValue,
          remaining
        });
      } else {
        onChange({
          ...formData,
          [name]: numValue,
        });
      }
    } else {
      onChange({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUnitChange = (value: string) => {
    onChange({
      ...formData,
      unit: value,
    });
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
            <Input
              id="name"
              name="name"
              className="col-span-3"
              placeholder="اسم المكون (مثال: بيض/Eggs)"
              value={formData.name}
              onChange={handleChange}
              required
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
  );
}
