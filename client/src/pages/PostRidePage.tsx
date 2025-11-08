import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

export default function PostRidePage() {
  const [formData, setFormData] = useState({
    massId: "",
    pickupPoint: "",
    seatsTotal: "1",
    notes: "",
  });

  //todo: remove mock functionality
  const mockMasses = [
    { id: '1', name: 'Misa Minggu Pagi - 12 Jan 2025, 07:00' },
    { id: '2', name: 'Misa Sabtu Sore - 11 Jan 2025, 18:00' },
    { id: '3', name: 'Misa Kamis Putih - 17 Apr 2025, 19:00' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Post ride:', formData);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <header className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold" data-testid="text-page-title">Tawarkan Tumpangan</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-md mx-auto pt-6">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mass">Jadwal Misa</Label>
                <Select
                  value={formData.massId}
                  onValueChange={(value) => setFormData({ ...formData, massId: value })}
                >
                  <SelectTrigger id="mass" data-testid="select-mass">
                    <SelectValue placeholder="Pilih jadwal misa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMasses.map((mass) => (
                      <SelectItem key={mass.id} value={mass.id}>
                        {mass.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup">Titik Kumpul</Label>
                <Input
                  id="pickup"
                  placeholder="Contoh: Lippo Cikarang, depan Supermal"
                  value={formData.pickupPoint}
                  onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
                  data-testid="input-pickup"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Jumlah Kursi Tersedia</Label>
                <Select
                  value={formData.seatsTotal}
                  onValueChange={(value) => setFormData({ ...formData, seatsTotal: value })}
                >
                  <SelectTrigger id="seats" data-testid="select-seats">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} kursi
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Informasi tambahan seperti waktu berangkat, lokasi detail, dll."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  data-testid="input-notes"
                />
              </div>

              <Button type="submit" className="w-full" data-testid="button-submit">
                Tawarkan Tumpangan
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
