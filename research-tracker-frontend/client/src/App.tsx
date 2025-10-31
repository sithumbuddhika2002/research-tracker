import { useEffect } from "react";
import { useLocation, Route, Switch } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import Milestones from "./pages/Milestones";
import Documents from "./pages/Documents";
import Admin from "./pages/Admin";

function Router() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ["/login", "/register"];
    const isPublicPath = publicPaths.includes(location);

    // Redirect authenticated users away from login/register
    if (isAuthenticated && isPublicPath) {
      setLocation("/projects");
      return;
    }
    
    // Redirect unauthenticated users to login
    if (!isAuthenticated && !isPublicPath) {
      setLocation("/login");
      return;
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/projects" component={Projects} />
      <Route path="/milestones" component={Milestones} />
      <Route path="/documents" component={Documents} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route>
        {isAuthenticated ? <Projects /> : <Login />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;