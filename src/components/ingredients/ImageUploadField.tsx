
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { fileToBase64, isImageFile } from "@/utils/fileUtils";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Image, Camera } from "lucide-react";

interface ImageUploadFieldProps {
  currentImage: string;
  onChange: (base64Image: string) => void;
  label?: string;
}

export default function ImageUploadField({
  currentImage,
  onChange,
  label = "الصورة"
}: ImageUploadFieldProps) {
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file)) {
      setError("يرجى اختيار صورة صالحة");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError("حجم الصورة كبير جداً. الحد الأقصى هو 5 ميجابايت");
      return;
    }

    try {
      setError(null);
      const base64 = await fileToBase64(file);
      onChange(base64);
    } catch (err) {
      setError("حدث خطأ أثناء معالجة الصورة");
      console.error("Image processing error:", err);
    }
  };

  const captureImage = () => {
    // Trigger the file input but specifically for camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use 'user' for front camera, 'environment' for back camera
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        setError(null);
        const base64 = await fileToBase64(file);
        onChange(base64);
      } catch (err) {
        setError("حدث خطأ أثناء التقاط الصورة");
        console.error("Camera capture error:", err);
      }
    };
    
    input.click();
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="image" className="text-left">
        {label}
      </Label>
      <div className="col-span-3 space-y-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-1/2"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <Image className="mr-2 h-4 w-4" />
            اختر صورة
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-1/2"
            onClick={captureImage}
          >
            <Camera className="mr-2 h-4 w-4" />
            التقاط صورة
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        
        {error && <p className="text-sm text-destructive">{error}</p>}
        
        {currentImage && (
          <div className="border rounded-md overflow-hidden w-full max-w-[200px]">
            <AspectRatio ratio={1 / 1}>
              <img 
                src={currentImage} 
                alt="Product"
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        )}
      </div>
    </div>
  );
}
