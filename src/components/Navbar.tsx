import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Train, Bell, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user: any;
  profile: any;
  isAdmin: boolean;
}

export function Navbar({ user, profile, isAdmin }: NavbarProps) {
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Berhasil keluar",
      description: "Sampai jumpa lagi!",
    });
  };

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/booking", label: "Pemesanan Tiket" },
    { path: "/forum", label: "Forum" },
    { path: "/profile", label: "Profil" },
  ];

  if (isAdmin) {
    navItems.push({ path: "/admin", label: "Admin Dashboard" });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Train className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">KAI Access</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="font-medium"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-highlight"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-secondary text-white">
                    {profile?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{profile?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profil Saya
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="flex md:hidden border-t">
        <div className="container mx-auto flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                size="sm"
                className="text-xs"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
