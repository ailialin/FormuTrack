import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertRawMaterialSchema, type RawMaterial } from "@shared/schema";

export default function Materials() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: materials = [], isLoading } = useQuery<RawMaterial[]>({
    queryKey: ["/api/materials"],
  });

  const form = useForm({
    resolver: zodResolver(insertRawMaterialSchema),
    defaultValues: {
      name: "",
      casNumber: "",
      supplier: "",
      unitOfMeasure: "g",
      costPerUnit: "0",
      category: "",
      description: "",
    },
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/materials", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Raw material created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create material",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createMaterialMutation.mutate(data);
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Raw Materials</h1>
          <p className="text-slate-600 mt-2">Manage your ingredient inventory and costs</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Raw Material</DialogTitle>
              <DialogDescription>
                Add a new ingredient to your materials database.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Hyaluronic Acid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="casNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CAS Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 9004-61-9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="Supplier name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Active, Emulsifier" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="costPerUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Per Unit ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unitOfMeasure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit of Measure</FormLabel>
                        <FormControl>
                          <Input placeholder="g, kg, ml, L" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the material" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMaterialMutation.isPending}>
                    {createMaterialMutation.isPending ? "Adding..." : "Add Material"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {searchTerm ? "No materials found" : "No materials yet"}
              </h3>
              <p className="text-slate-500 mb-4">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Get started by adding your first raw material."
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>CAS Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900">{material.name}</div>
                          {material.description && (
                            <div className="text-sm text-slate-500">{material.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-700">
                        {material.casNumber || "—"}
                      </TableCell>
                      <TableCell>
                        {material.category && (
                          <Badge variant="secondary">{material.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-700">
                        {material.supplier || "—"}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${parseFloat(material.costPerUnit).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-700">
                        {material.unitOfMeasure}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
