import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Calculator, Upload, FileText, ArrowRight } from "lucide-react";

const actions = [
  {
    title: "Create New MFS",
    icon: PlusCircle,
    bgColor: "bg-primary/5 hover:bg-primary/10",
    iconColor: "text-primary"
  },
  {
    title: "Generate Batch",
    icon: Settings,
    bgColor: "bg-slate-50 hover:bg-slate-100",
    iconColor: "text-slate-600"
  },
  {
    title: "Cost Calculator",
    icon: Calculator,
    bgColor: "bg-slate-50 hover:bg-slate-100",
    iconColor: "text-slate-600"
  },
  {
    title: "Import Excel/JSON",
    icon: Upload,
    bgColor: "bg-slate-50 hover:bg-slate-100",
    iconColor: "text-slate-600"
  },
  {
    title: "Export Reports",
    icon: FileText,
    bgColor: "bg-slate-50 hover:bg-slate-100",
    iconColor: "text-slate-600"
  }
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-between p-3 h-auto ${action.bgColor} transition-colors`}
            >
              <div className="flex items-center">
                <Icon className={`w-5 h-5 ${action.iconColor} mr-3`} />
                <span className="text-sm font-medium text-slate-700">{action.title}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
