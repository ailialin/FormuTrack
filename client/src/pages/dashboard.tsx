import StatsGrid from "@/components/dashboard/stats-grid";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import MfsTable from "@/components/mfs/mfs-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <StatsGrid />
      
      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <QuickActions />
      </div>

      {/* MFS Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Master Formulation Sheets</CardTitle>
              <CardDescription>Manage and track your product formulations</CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="skincare">Skincare</SelectItem>
                  <SelectItem value="haircare">Haircare</SelectItem>
                  <SelectItem value="makeup">Makeup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MfsTable />
        </CardContent>
      </Card>

      {/* Batch Production & Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Production Calculator</CardTitle>
            <CardDescription>Calculate scaled recipes and material requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select MFS</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a formulation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mfs1">Advanced Anti-Aging Serum v2.1</SelectItem>
                  <SelectItem value="mfs2">Vitamin C Brightening Cream v1.3</SelectItem>
                  <SelectItem value="mfs3">Gentle Cleansing Foam v1.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Units</label>
                <input 
                  type="number" 
                  placeholder="1000" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Unit Size (ml)</label>
                <input 
                  type="number" 
                  placeholder="30" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Loss Factor (%)</label>
              <input 
                type="number" 
                placeholder="5" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <Button className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Batch
            </Button>
          </CardContent>
        </Card>

        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>Track and analyze production costs</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Cost Chart Placeholder */}
            <div className="w-full h-48 bg-slate-50 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Cost Breakdown Chart</p>
                <p className="text-xs text-slate-400">Materials • Labor • Packaging • Overhead</p>
              </div>
            </div>

            {/* Cost Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Avg Material Cost</p>
                <p className="text-lg font-bold text-slate-800">$2.45</p>
                <p className="text-xs text-success">per unit</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Avg Total Cost</p>
                <p className="text-lg font-bold text-slate-800">$4.12</p>
                <p className="text-xs text-success">per unit</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <DollarSign className="w-4 h-4 mr-2" />
              Generate Quick Quote
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
