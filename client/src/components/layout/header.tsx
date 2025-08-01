import { useState } from "react";
import { Search, Bell, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateMfsModal from "@/components/mfs/create-mfs-modal";

export default function Header() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="md:hidden text-slate-500 hover:text-slate-700 mr-4">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search formulations..." 
              className="pl-10 w-64 bg-slate-50 focus:bg-white"
            />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative text-slate-500 hover:text-slate-700">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Create Button */}
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New MFS
          </Button>
        </div>
      </header>

      <CreateMfsModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}
