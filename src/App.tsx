import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ActiVote from "./pages/ActiVote";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/beta" element={<ActiVote />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </HashRouter>
  );
}

export default App;
