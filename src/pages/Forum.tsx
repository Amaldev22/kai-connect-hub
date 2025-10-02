import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Repeat2, Send, TrendingUp } from "lucide-react";

export default function Forum() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Forum Komunitas KAI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Bagikan pengalaman atau tanyakan sesuatu..."
                  className="min-h-24"
                />
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Posting
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sample Posts */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback className="bg-secondary text-white">A</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Ahmad Rizki</span>
                    <Badge variant="outline" className="text-xs">
                      12 trip
                    </Badge>
                    <span className="text-xs text-muted-foreground">2 jam lalu</span>
                  </div>
                  <p className="text-sm">
                    Perjalanan Argo Parahyangan hari ini sangat nyaman! Pelayanan memuaskan dan tepat waktu. Recommended! 👍
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Heart className="h-4 w-4" />
                      <span>24</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>5</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Repeat2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-white">S</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Siti Nurhaliza</span>
                    <Badge variant="outline" className="text-xs">
                      8 trip
                    </Badge>
                    <span className="text-xs text-muted-foreground">4 jam lalu</span>
                  </div>
                  <p className="text-sm">
                    Ada yang tahu rute alternatif Jakarta-Bandung selain Argo Parahyangan? Butuh opsi lebih ekonomis.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Heart className="h-4 w-4" />
                      <span>12</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>8</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Repeat2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                Topik Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">#ArgoParahyangan</div>
                <div className="text-xs text-muted-foreground">245 diskusi</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">#RefundCepat</div>
                <div className="text-xs text-muted-foreground">189 diskusi</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">#TipsPerjalanan</div>
                <div className="text-xs text-muted-foreground">156 diskusi</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">#JadwalKereta</div>
                <div className="text-xs text-muted-foreground">134 diskusi</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-secondary text-white">
            <CardHeader>
              <CardTitle className="text-white text-base">Pengumuman Resmi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/90">
                Pembaruan jadwal kereta untuk jalur Jabodetabek berlaku mulai minggu depan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
