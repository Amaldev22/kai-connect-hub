import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "./components/Navbar";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Forum from "./pages/Forum";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(profileData);

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roleData);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {user && <Navbar user={user} profile={profile} isAdmin={isAdmin} />}
          <Routes>
            <Route
              path="/auth"
              element={!user ? <Auth /> : <Navigate to="/" replace />}
            />
            <Route
              path="/"
              element={
                user ? (
                  <Dashboard user={user} profile={profile} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/booking"
              element={
                user ? (
                  <Booking />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/forum"
              element={
                user ? (
                  <Forum />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                user ? (
                  <Profile user={user} profile={profile} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            {isAdmin && (
              <Route
                path="/admin"
                element={
                  <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                  </div>
                }
              />
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
