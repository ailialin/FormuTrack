import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import MfsPage from "@/pages/mfs";
import BatchGenerator from "@/pages/batch-generator";
import Materials from "@/pages/materials";
import CostAnalysis from "@/pages/cost-analysis";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/mfs" component={MfsPage} />
      <Route path="/batch-generator" component={BatchGenerator} />
      <Route path="/materials" component={Materials} />
      <Route path="/cost-analysis" component={CostAnalysis} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex h-screen overflow-hidden bg-slate-50">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <Router />
            </main>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
