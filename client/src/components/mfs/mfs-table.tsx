import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Copy, Trash2, FlaskConical } from "lucide-react";
import { MasterFormulationSheet } from "@shared/schema";

export default function MfsTable() {
  const { data: mfsList = [], isLoading } = useQuery<MasterFormulationSheet[]>({
    queryKey: ["/api/mfs"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (mfsList.length === 0) {
    return (
      <div className="text-center py-12">
        <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No formulations found</h3>
        <p className="text-slate-500 mb-4">Get started by creating your first Master Formulation Sheet.</p>
        <Button>Create New MFS</Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Formulation</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Cost/Unit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mfsList.map((mfs) => (
            <TableRow key={mfs.id} className="hover:bg-slate-50">
              <TableCell>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <FlaskConical className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{mfs.name}</div>
                    <div className="text-sm text-slate-500">{mfs.code}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{mfs.version}</Badge>
              </TableCell>
              <TableCell className="capitalize">{mfs.category}</TableCell>
              <TableCell>
                <Badge 
                  variant={mfs.status === "active" ? "default" : "secondary"}
                  className={mfs.status === "active" ? "bg-green-100 text-green-800" : ""}
                >
                  {mfs.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-slate-900">
                {new Date(mfs.updatedAt || mfs.createdAt || Date.now()).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm text-slate-900">$0.00</TableCell>
              <TableCell>
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="sm" title="View">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Edit">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Delete" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-slate-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{mfsList.length}</span> of{" "}
          <span className="font-medium">{mfsList.length}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="default" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
