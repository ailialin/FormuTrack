import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, FlaskConical, Factory, DollarSign, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Active Formulations",
    value: "142",
    change: "+12%",
    changeType: "positive",
    icon: FlaskConical,
    iconBg: "bg-primary/10",
    iconColor: "text-primary"
  },
  {
    title: "Batches This Month",
    value: "1,247",
    change: "+8%",
    changeType: "positive",
    icon: Factory,
    iconBg: "bg-success/10",
    iconColor: "text-success"
  },
  {
    title: "Material Cost",
    value: "$24,580",
    change: "-3%",
    changeType: "negative",
    icon: DollarSign,
    iconBg: "bg-warning/10",
    iconColor: "text-warning"
  },
  {
    title: "Efficiency Rate",
    value: "94.2%",
    change: "+2%",
    changeType: "positive",
    icon: TrendingUp,
    iconBg: "bg-success/10",
    iconColor: "text-success"
  }
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.changeType === "positive";
        
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                  <p className={`text-sm mt-1 flex items-center ${
                    isPositive ? "text-success" : "text-error"
                  }`}>
                    {isPositive ? (
                      <ArrowUp className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDown className="w-3 h-3 mr-1" />
                    )}
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
