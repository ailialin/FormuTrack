import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calculator, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MasterFormulationSheet } from "@shared/schema";

interface BatchCalculation {
  totalVolume: number;
  materialCost: number;
  packagingCost: number;
  totalCost: number;
  costPerUnit: number;
  scaledIngredients?: any[];
}

export default function BatchGenerator() {
  const { toast } = useToast();
  const [selectedMfs, setSelectedMfs] = useState("");
  const [targetUnits, setTargetUnits] = useState(1000);
  const [unitSize, setUnitSize] = useState(30);
  const [lossFactor, setLossFactor] = useState(5);
  const [calculation, setCalculation] = useState<BatchCalculation | null>(null);

  const { data: mfsList = [] } = useQuery<MasterFormulationSheet[]>({
    queryKey: ["/api/mfs"],
  });

  const calculateBatchMutation = useMutation({
    mutationFn: async (params: {
      mfsId: string;
      targetUnits: number;
      unitSize: number;
      lossFactor: number;
    }) => {
      const response = await apiRequest("POST", "/api/batches/calculate", params);
      return response.json();
    },
    onSuccess: (data: BatchCalculation) => {
      setCalculation(data);
      toast({
        title: "Calculation Complete",
        description: "Batch requirements calculated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: error.message || "Failed to calculate batch requirements",
        variant: "destructive",
      });
    },
  });

  const handleCalculate = () => {
    if (!selectedMfs) {
      toast({
        title: "Validation Error",
        description: "Please select an MFS",
        variant: "destructive",
      });
      return;
    }

    calculateBatchMutation.mutate({
      mfsId: selectedMfs,
      targetUnits,
      unitSize,
      lossFactor,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Batch Production Generator</h1>
        <p className="text-slate-600 mt-2">Calculate scaled recipes and material requirements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Production Parameters</CardTitle>
            <CardDescription>Configure your batch production requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mfs-select">Select MFS</Label>
              <Select value={selectedMfs} onValueChange={setSelectedMfs}>
                <SelectTrigger id="mfs-select">
                  <SelectValue placeholder="Choose a formulation" />
                </SelectTrigger>
                <SelectContent>
                  {mfsList.map((mfs) => (
                    <SelectItem key={mfs.id} value={mfs.id}>
                      {mfs.name} {mfs.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target-units">Target Units</Label>
                <Input 
                  id="target-units"
                  type="number" 
                  value={targetUnits}
                  onChange={(e) => setTargetUnits(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="unit-size">Unit Size (ml)</Label>
                <Input 
                  id="unit-size"
                  type="number" 
                  value={unitSize}
                  onChange={(e) => setUnitSize(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="loss-factor">Loss Factor (%)</Label>
              <Input 
                id="loss-factor"
                type="number" 
                step="0.1"
                value={lossFactor}
                onChange={(e) => setLossFactor(parseFloat(e.target.value) || 0)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleCalculate}
              disabled={calculateBatchMutation.isPending}
            >
              <Calculator className="w-4 h-4 mr-2" />
              {calculateBatchMutation.isPending ? "Calculating..." : "Calculate Batch"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Requirements</CardTitle>
            <CardDescription>Calculated production requirements and costs</CardDescription>
          </CardHeader>
          <CardContent>
            {calculation ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Volume:</span>
                      <span className="font-medium">{calculation.totalVolume.toFixed(1)} L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Material Cost:</span>
                      <span className="font-medium">${calculation.materialCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Packaging Cost:</span>
                      <span className="font-medium">${calculation.packagingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-3">
                      <span className="text-slate-800 font-semibold">Total Cost:</span>
                      <span className="font-bold text-primary">${calculation.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cost Per Unit:</span>
                      <span className="font-medium">${calculation.costPerUnit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button className="flex-1">
                    Create Batch
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Configure parameters and calculate to see batch requirements</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
