import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Train, AlertCircle, Calendar, ArrowRight, MessageSquare, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  user: any;
  profile: any;
}

export default function Dashboard({ user, profile }: DashboardProps) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load recent orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select(`
          *,
          schedule:train_schedules (
            *,
            train:trains (*),
            from_station:from_station_id (name, code),
            to_station:to_station_id (name, code)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      setOrders(ordersData || []);

      // Load refunds
      const { data: refundsData } = await supabase
        .from("refunds")
        .select("*, order:orders (*)")
        .in(
          "order_id",
          ordersData?.map((o) => o.id) || []
        )
        .order("created_at", { ascending: false });

      setRefunds(refundsData || []);

      // Load recent notifications
      const { data: notifData } = await supabase
        .from("route_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setNotifications(notifData || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingTrips = orders.filter(
    (order) =>
      order.schedule?.departure_time &&
      new Date(order.schedule.departure_time) > new Date()
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Profile Section */}
      <Card className="bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-white text-primary text-2xl">
                {profile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile?.name || "User"}</h2>
              <p className="text-white/90">{user?.email}</p>
              <div className="mt-2 flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Train className="mr-1 h-3 w-3" />
                  {profile?.trip_count || 0} Perjalanan
                </Badge>
              </div>
            </div>
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/booking")}
            >
              Lihat Pemesanan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Refund Aktif
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refunds.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {refunds.filter((r) => r.status === "requested").length} menunggu
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Notifikasi Baru
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Perubahan jadwal</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trip Mendatang
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTrips.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Siap berangkat</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/forum")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Forum
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aktif</div>
            <p className="text-xs text-muted-foreground mt-1">Diskusi komunitas</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => navigate("/booking")}
          >
            <Search className="mr-3 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Cari Rute</div>
              <div className="text-xs text-muted-foreground">Temukan perjalanan terbaik</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => navigate("/forum")}
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Buka Forum</div>
              <div className="text-xs text-muted-foreground">Bergabung dengan diskusi</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
          >
            <Train className="mr-3 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">AI Chatbot</div>
              <div className="text-xs text-muted-foreground">Bantuan instan</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notifikasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <AlertCircle className="h-5 w-5 text-highlight mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{notif.title}</p>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                  {notif.delay_minutes && (
                    <Badge variant="outline" className="mt-1">
                      Keterlambatan {notif.delay_minutes} menit
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
