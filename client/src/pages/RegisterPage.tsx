import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    lingkungan: "",
    role: "passenger",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { data: environmentsData } = useQuery({
    queryKey: ["/api/environments"],
    queryFn: async () => {
      const response = await fetch("/api/environments");
      if (!response.ok) throw new Error("Failed to fetch environments");
      return response.json();
    },
  });

  const environments = environmentsData?.environments || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(formData);
      toast({
        title: "Registrasi berhasil",
        description: "Akun Anda telah dibuat!",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Registrasi gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-6">
      <header className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold" data-testid="text-page-title">Daftar Akun</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-md mx-auto pt-6">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="Nama lengkap Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor HP (WhatsApp)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={isLoading}
                  data-testid="input-phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lingkungan">Lingkungan</Label>
                <Select
                  value={formData.lingkungan}
                  onValueChange={(value) => setFormData({ ...formData, lingkungan: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="lingkungan" data-testid="select-lingkungan">
                    <SelectValue placeholder="Pilih lingkungan" />
                  </SelectTrigger>
                  <SelectContent>
                    {environments.map((env: any) => (
                      <SelectItem key={env.id} value={env.name}>
                        {env.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="role" data-testid="select-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passenger">Penumpang</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  data-testid="input-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-submit">
                {isLoading ? "Loading..." : "Daftar"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login">
                <button className="text-primary font-medium hover:underline" data-testid="link-login">
                  Masuk di sini
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
