import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function PostRidePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    massId: "",
    pickupPoint: "",
    seatsTotal: "1",
    notes: "",
  });

  const { data: massesData } = useQuery({
    queryKey: ["/api/masses"],
    queryFn: async () => {
      const response = await fetch("/api/masses");
      if (!response.ok) throw new Error("Failed to fetch masses");
      return response.json();
    },
  });

  const createRideMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/rides", {
        ...data,
        seatsTotal: parseInt(data.seatsTotal),
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({
        title: "Tumpangan berhasil ditawarkan",
        description: "Penumpang bisa melihat tumpangan Anda sekarang.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menawarkan tumpangan",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const masses = massesData?.masses || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRideMutation.mutate(formData);
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
                  disabled={createRideMutation.isPending}
                >
                  <SelectTrigger id="mass" data-testid="select-mass">
                    <SelectValue placeholder="Pilih jadwal misa" />
                  </SelectTrigger>
                  <SelectContent>
                    {masses.map((mass: any) => (
                      <SelectItem key={mass.id} value={mass.id}>
                        {mass.name} - {format(new Date(mass.datetime), "dd MMM yyyy, HH:mm", { locale: id })}
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
                  disabled={createRideMutation.isPending}
                  data-testid="input-pickup"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Jumlah Kursi Tersedia</Label>
                <Select
                  value={formData.seatsTotal}
                  onValueChange={(value) => setFormData({ ...formData, seatsTotal: value })}
                  disabled={createRideMutation.isPending}
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
                  disabled={createRideMutation.isPending}
                  data-testid="input-notes"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={createRideMutation.isPending}
                data-testid="button-submit"
              >
                {createRideMutation.isPending ? "Loading..." : "Tawarkan Tumpangan"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
