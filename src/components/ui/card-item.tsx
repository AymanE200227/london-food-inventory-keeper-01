
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardItemProps {
  title: string;
  description?: string;
  image?: string;
  stock: number;
  remaining: number;
  discrepancy?: number;
  lastUpdated?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function CardItem({
  title,
  description,
  image,
  stock,
  remaining,
  discrepancy = 0,
  lastUpdated,
  onEdit,
  onDelete,
}: CardItemProps) {
  return (
    <Card className="w-full overflow-hidden border border-border bg-card">
      <div className="relative h-36">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-english">{title}</CardTitle>
        {description && <CardDescription className="text-sm">{description}</CardDescription>}
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">المخزون الأصلي:</span>
          <Badge variant="outline">{stock}</Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">المتبقي:</span>
          <Badge variant="outline">{remaining}</Badge>
        </div>
        
        {discrepancy !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">الفرق:</span>
            <Badge variant={discrepancy > 0 ? "destructive" : "outline"}>
              {discrepancy === 0 ? "لا يوجد" : discrepancy}
            </Badge>
          </div>
        )}
        
        {lastUpdated && (
          <div className="text-xs text-muted-foreground text-center mt-2">
            آخر تحديث: {lastUpdated}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex justify-between">
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4 ml-2" />
          تعديل
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 ml-2" />
          حذف
        </Button>
      </CardFooter>
    </Card>
  );
}
