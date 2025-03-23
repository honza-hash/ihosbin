import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Paste from "@/pages/paste";
import Trending from "@/pages/trending";
import Api from "@/pages/api";
import Support from "@/pages/support";
import About from "@/pages/about";
import Terms from "@/pages/terms";
import AllPastes from "@/pages/AllPastes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/paste/:id" component={Paste} />
      <Route path="/trending" component={Trending} />
      <Route path="/pastes" component={AllPastes} />
      <Route path="/api" component={Api} />
      <Route path="/support" component={Support} />
      <Route path="/about" component={About} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
