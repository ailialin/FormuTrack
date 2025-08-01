import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Receipt } from "lucide-react";

export default function CostAnalysis() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cost Analysis</h1>
          <p className="text-slate-600 mt-2">Track and analyze production costs across formulations</p>
        </div>
        <Button>
          <Receipt className="w-4 h-4 mr-2" />
          Generate Quote
        </Button>
      </div>

      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Material Cost</p>
                <p className="text-2xl font-bold text-slate-800">$2.45</p>
                <p className="text-sm text-success mt-1 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -5% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Total Cost</p>
                <p className="text-2xl font-bold text-slate-800">$4.12</p>
                <p className="text-sm text-success mt-1 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -2% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Highest Cost Item</p>
                <p className="text-2xl font-bold text-slate-800">$8.24</p>
                <p className="text-sm text-slate-500 mt-1">Anti-Aging Serum</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Cost Variance</p>
                <p className="text-2xl font-bold text-slate-800">±12%</p>
                <p className="text-sm text-slate-500 mt-1">Across products</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown by Category</CardTitle>
            <CardDescription>Average cost distribution across all formulations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm text-slate-500">Cost Breakdown Chart</p>
                <p className="text-xs text-slate-400">Materials • Labor • Packaging • Overhead</p>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                <span className="text-sm text-slate-600">Materials (65%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                <span className="text-sm text-slate-600">Packaging (20%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
                <span className="text-sm text-slate-600">Labor (10%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-slate-400 rounded-full mr-2"></div>
                <span className="text-sm text-slate-600">Overhead (5%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Trends</CardTitle>
            <CardDescription>Monthly average costs over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm text-slate-500">Cost Trend Chart</p>
                <p className="text-xs text-slate-400">6-month historical data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Cost Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Cost Calculator</CardTitle>
            <CardDescription>Calculate costs for any formulation quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Formulation</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a formulation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serum">Advanced Anti-Aging Serum</SelectItem>
                  <SelectItem value="cream">Vitamin C Brightening Cream</SelectItem>
                  <SelectItem value="cleanser">Gentle Cleansing Foam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
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

            <Button className="w-full">
              <DollarSign className="w-4 h-4 mr-2" />
              Calculate Cost
            </Button>
          </CardContent>
        </Card>

        {/* Cost Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Comparison</CardTitle>
            <CardDescription>Compare costs across different products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Anti-Aging Serum</p>
                  <p className="text-sm text-slate-500">30ml unit</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">$3.24</p>
                  <p className="text-sm text-success">Most expensive</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Vitamin C Cream</p>
                  <p className="text-sm text-slate-500">50ml unit</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">$2.87</p>
                  <p className="text-sm text-slate-500">Mid-range</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Cleansing Foam</p>
                  <p className="text-sm text-slate-500">150ml unit</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">$1.45</p>
                  <p className="text-sm text-success">Most economical</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
