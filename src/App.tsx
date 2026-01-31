import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ActiVote from "./pages/ActiVote";
import WorkshopVote from "./pages/WorkshopVote";
import VoteResults from "./pages/VoteResults";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/beta" element={<ActiVote />} />
        <Route path="/workshopvote/en" element={<WorkshopVote lang="en" />} />
        <Route path="/workshopvote/fr" element={<WorkshopVote lang="fr" />} />
        <Route path="/voteresults/en" element={<VoteResults lang="en" />} />
        <Route path="/voteresults/fr" element={<VoteResults lang="fr" />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </HashRouter>
  );
}

export default App;
