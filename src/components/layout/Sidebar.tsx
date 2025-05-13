
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard, Wine, Carrot, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    path: "/",
    name: "لوحة التحكم",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    path: "/drinks",
    name: "المشروبات",
    icon: <Wine className="w-5 h-5" />,
  },
  {
    path: "/ingredients",
    name: "المكونات",
    icon: <Carrot className="w-5 h-5" />,
  },
  {
    path: "/reports",
    name: "التقارير",
    icon: <BarChart2 className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 p-2 bg-moroccan-black rounded-full md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-64 bg-sidebar transition-transform duration-300 ease-in-out transform md:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
            <h1 className="text-2xl font-bold text-primary">London Food</h1>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-sidebar-accent"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                <span className="ml-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-sidebar-border text-center">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} London Food</p>
          </div>
        </div>
      </aside>

      <div className="md:pr-64">
        {/* Placeholder for the sidebar in desktop view */}
      </div>
    </>
  );
}
