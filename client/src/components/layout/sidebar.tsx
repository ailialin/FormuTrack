import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  ChartPie, 
  FileText, 
  GitBranch, 
  Factory, 
  Box, 
  Package, 
  Calculator, 
  DollarSign, 
  Users, 
  Settings,
  FlaskConical
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartPie },
  {
    category: "Formulations",
    items: [
      { name: "Master Formulation Sheets", href: "/mfs", icon: FileText },
      { name: "Version Control", href: "/versions", icon: GitBranch },
    ]
  },
  {
    category: "Production",
    items: [
      { name: "Batch Generator", href: "/batch-generator", icon: Factory },
      { name: "Raw Materials", href: "/materials", icon: Box },
      { name: "Packaging", href: "/packaging", icon: Package },
    ]
  },
  {
    category: "Finance",
    items: [
      { name: "Cost Analysis", href: "/cost-analysis", icon: Calculator },
      { name: "Quick Quotes", href: "/quotes", icon: DollarSign },
    ]
  },
  {
    category: "Admin",
    items: [
      { name: "User Management", href: "/users", icon: Users },
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-slate-200">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">CosmetiCraft</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item, index) => {
            if ('category' in item) {
              return (
                <div key={index} className="pt-4">
                  <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {item.category}
                  </div>
                  {item.items?.map((subItem) => {
                    const Icon = subItem.icon;
                    const isActive = location === subItem.href;
                    
                    return (
                      <Link key={subItem.href} href={subItem.href}>
                        <div className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                          isActive 
                            ? "text-primary bg-primary/10" 
                            : "text-slate-700 hover:bg-slate-100"
                        )}>
                          <Icon className="w-5 h-5 mr-3" />
                          {subItem.name}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            } else {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-slate-700 hover:bg-slate-100"
                  )}>
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            }
          })}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-slate-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">JD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-700">John Doe</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
