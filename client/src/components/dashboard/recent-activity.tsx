import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    title: "Advanced Anti-Aging Serum v2.1",
    description: "Updated hyaluronic acid concentration to 2.5%",
    author: "Dr. Sarah Chen",
    time: "2 hours ago",
    department: "R&D",
    color: "bg-primary"
  },
  {
    title: "Vitamin C Brightening Cream v1.3",
    description: "Batch testing completed - ready for production",
    author: "Mike Rodriguez",
    time: "5 hours ago",
    department: "Production",
    color: "bg-success"
  },
  {
    title: "Gentle Cleansing Foam v1.0",
    description: "Cost analysis updated - material cost reduced by 8%",
    author: "Jessica Wong",
    time: "1 day ago",
    department: "Finance",
    color: "bg-warning"
  }
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent MFS Updates</CardTitle>
          <a href="/mfs" className="text-primary hover:text-blue-600 text-sm font-medium">
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                <div className="flex items-center mt-2 text-xs text-slate-500">
                  <span>{activity.author}</span>
                  <span className="mx-2">•</span>
                  <span>{activity.time}</span>
                  <span className="mx-2">•</span>
                  <Badge variant="secondary" className="text-xs">
                    {activity.department}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
