
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-card moroccan-pattern">
      <div className="text-center bg-background p-8 rounded-lg shadow-lg border border-border max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl mb-4">عفواً، الصفحة غير موجودة</p>
        <p className="text-muted-foreground mb-6">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Button onClick={() => navigate("/")}>
          العودة إلى الصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
