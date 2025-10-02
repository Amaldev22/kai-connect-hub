import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";

export default function Booking() {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching:", searchData);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Pemesanan Tiket</h1>
        <p className="text-muted-foreground">
          Temukan dan pesan tiket kereta api untuk perjalanan Anda
        </p>
      </div>

      {/* Search Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Cari Jadwal Kereta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Stasiun Asal
                </Label>
                <Input
                  id="from"
                  placeholder="Contoh: Gambir"
                  value={searchData.from}
                  onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Stasiun Tujuan
                </Label>
                <Input
                  id="to"
                  placeholder="Contoh: Bandung"
                  value={searchData.to}
                  onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Tanggal Keberangkatan
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Jumlah Penumpang
                </Label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="8"
                  value={searchData.passengers}
                  onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Cari Jadwal
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Hasil Pencarian</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12 text-muted-foreground">
          <p>Masukkan detail perjalanan Anda untuk melihat jadwal yang tersedia</p>
        </CardContent>
      </Card>
    </div>
  );
}
