import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Train, Edit } from "lucide-react";

interface ProfileProps {
  user: any;
  profile: any;
}

export default function Profile({ user, profile }: ProfileProps) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi dan preferensi akun Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-4xl">
                  {profile?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{profile?.name || "User"}</h2>
                <Badge variant="secondary" className="text-sm">
                  <Train className="mr-1 h-3 w-3" />
                  {profile?.trip_count || 0} Perjalanan
                </Badge>
              </div>
              <Button className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  <p className="font-medium">{profile?.name || "Belum diatur"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bergabung Sejak</p>
                  <p className="font-medium">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Tidak diketahui"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Perjalanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-3xl font-bold text-primary">{profile?.trip_count || 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Perjalanan</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-3xl font-bold text-secondary">0</p>
                  <p className="text-sm text-muted-foreground mt-1">Trip Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pemesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Belum ada riwayat pemesanan</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
