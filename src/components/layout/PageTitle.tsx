
import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageTitle({ title, description, action }: PageTitleProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-border">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </div>
  );
}
