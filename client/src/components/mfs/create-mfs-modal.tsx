import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertMfsSchema, type RawMaterial, type FormulationData, type Ingredient } from "@shared/schema";

const createMfsFormSchema = insertMfsSchema.extend({
  ingredients: z.array(z.object({
    materialId: z.string().min(1, "Material is required"),
    percentage: z.number().min(0.01, "Percentage must be greater than 0").max(100, "Percentage cannot exceed 100"),
    function: z.string().min(1, "Function is required"),
  })).min(1, "At least one ingredient is required"),
  instructions: z.string().min(1, "Instructions are required"),
  qcParameters: z.string().min(1, "QC Parameters are required"),
});

type CreateMfsForm = z.infer<typeof createMfsFormSchema>;

interface CreateMfsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateMfsModal({ open, onOpenChange }: CreateMfsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: materials = [] } = useQuery<RawMaterial[]>({
    queryKey: ["/api/materials"],
  });

  const form = useForm<CreateMfsForm>({
    resolver: zodResolver(createMfsFormSchema),
    defaultValues: {
      name: "",
      code: "",
      category: "",
      version: "v1.0",
      status: "draft",
      ingredients: [{ materialId: "", percentage: 0, function: "" }],
      instructions: "",
      qcParameters: "",
    },
  });

  const createMfsMutation = useMutation({
    mutationFn: async (data: CreateMfsForm) => {
      const { ingredients, instructions, qcParameters, ...mfsData } = data;
      
      const formulation: FormulationData = {
        ingredients: ingredients as Ingredient[],
        instructions,
        qcParameters,
      };

      const payload = {
        ...mfsData,
        formulation,
        createdBy: "admin-user-id", // TODO: Get from auth context
      };

      const response = await apiRequest("POST", "/api/mfs", payload);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Master Formulation Sheet created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/mfs"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create MFS",
        variant: "destructive",
      });
    },
  });

  const addIngredient = () => {
    const currentIngredients = form.getValues("ingredients");
    form.setValue("ingredients", [...currentIngredients, { materialId: "", percentage: 0, function: "" }]);
  };

  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues("ingredients");
    if (currentIngredients.length > 1) {
      form.setValue("ingredients", currentIngredients.filter((_, i) => i !== index));
    }
  };

  const onSubmit = (data: CreateMfsForm) => {
    // Validate total percentage
    const totalPercentage = data.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      toast({
        title: "Validation Error",
        description: `Total percentage must equal 100%. Current total: ${totalPercentage.toFixed(2)}%`,
        variant: "destructive",
      });
      return;
    }

    createMfsMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Master Formulation Sheet</DialogTitle>
          <DialogDescription>
            Create a new formulation with ingredients, instructions, and quality control parameters.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Advanced Anti-Aging Serum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MFS-2024-001" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="skincare">Skincare</SelectItem>
                        <SelectItem value="haircare">Haircare</SelectItem>
                        <SelectItem value="makeup">Makeup</SelectItem>
                        <SelectItem value="fragrance">Fragrance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Version</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ingredients Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Ingredients</h3>
                <Button type="button" onClick={addIngredient} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Ingredient
                </Button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingredient</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Function</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.watch("ingredients").map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`ingredients.${index}.materialId`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select ingredient" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {materials.map((material) => (
                                      <SelectItem key={material.id} value={material.id}>
                                        {material.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`ingredients.${index}.percentage`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`ingredients.${index}.function`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="e.g., Active ingredient" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIngredient(index)}
                            disabled={form.watch("ingredients").length === 1}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Instructions */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturing Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Enter detailed manufacturing instructions..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* QC Parameters */}
            <FormField
              control={form.control}
              name="qcParameters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QC Parameters</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Quality control parameters and specifications..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMfsMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {createMfsMutation.isPending ? "Saving..." : "Save MFS"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
