
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
  discrepancy,
  lastUpdated,
  onEdit,
  onDelete,
}: CardItemProps) {
  // Calculate percentage for progress indicator
  const percentage = stock > 0 ? (remaining / stock) * 100 : 0;
  
  // Calculate actual discrepancy if it's not provided
  const calculatedDiscrepancy = stock - remaining;
  const displayDiscrepancy = discrepancy !== undefined ? discrepancy : calculatedDiscrepancy;
  
  return (
    <Card className="w-full overflow-hidden border border-border bg-card transition-all duration-200 hover:shadow-md">
      <div className="relative h-40">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="moroccan-pattern w-full h-full opacity-50 flex items-center justify-center">
              <span className="text-foreground font-bold text-xl">{title.substring(0, 2)}</span>
            </div>
          </div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-2 bg-gradient-to-r from-moroccan-accent/10 to-transparent">
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
          <Badge variant={percentage < 20 ? "destructive" : percentage < 50 ? "secondary" : "outline"}>
            {remaining}
          </Badge>
        </div>
        
        {/* Progress bar indicator */}
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full",
              percentage < 20 ? "bg-destructive" : percentage < 50 ? "bg-moroccan-accent" : "bg-primary"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">الفرق:</span>
          <Badge variant={calculatedDiscrepancy > 0 ? "destructive" : "outline"}>
            {calculatedDiscrepancy === 0 ? "لا يوجد" : calculatedDiscrepancy > 0 ? `${calculatedDiscrepancy}` : `+${Math.abs(calculatedDiscrepancy)}`}
          </Badge>
        </div>
        
        {lastUpdated && (
          <div className="text-xs text-muted-foreground text-center mt-2">
            آخر تحديث: {lastUpdated}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex justify-between border-t border-border/20">
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
