import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingCard from "@/components/BookingCard";
import RideCard from "@/components/RideCard";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<string>("bookings");

  const { data: bookingsData } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const response = await fetch("/api/bookings");
      if (!response.ok) {
        if (response.status === 401) {
          setLocation("/login");
          return { bookings: [] };
        }
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
    enabled: !!user,
  });

  const { data: ridesData } = useQuery({
    queryKey: ["/api/rides"],
    queryFn: async () => {
      const response = await fetch("/api/rides");
      if (!response.ok) throw new Error("Failed to fetch rides");
      return response.json();
    },
    enabled: !!user && (user.role === "driver" || user.role === "admin"),
  });

  const { data: massesData } = useQuery({
    queryKey: ["/api/masses"],
    queryFn: async () => {
      const response = await fetch("/api/masses");
      if (!response.ok) throw new Error("Failed to fetch masses");
      return response.json();
    },
    enabled: !!user,
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await apiRequest("DELETE", `/api/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({
        title: "Booking dibatalkan",
        description: "Booking Anda telah dibatalkan.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal membatalkan booking",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout berhasil",
        description: "Sampai jumpa kembali!",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Logout gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    setLocation("/login");
    return null;
  }

  const bookings = bookingsData?.bookings || [];
  const rides = ridesData?.rides || [];
  const masses = massesData?.masses || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border p-4 bg-card">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold" data-testid="text-page-title">Profil</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold" data-testid="text-user-name">{user.name}</h2>
              <p className="text-sm text-muted-foreground" data-testid="text-user-email">{user.email}</p>
              <p className="text-sm text-muted-foreground" data-testid="text-user-phone">{user.phone}</p>
              {user.lingkungan && (
                <p className="text-sm text-muted-foreground mt-1" data-testid="text-user-lingkungan">{user.lingkungan}</p>
              )}
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {user.role === 'driver' ? 'Driver' : user.role === 'admin' ? 'Admin' : 'Penumpang'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" size="default" className="flex-1 gap-2" data-testid="button-settings">
              <Settings className="w-4 h-4" />
              Pengaturan
            </Button>
            <Button 
              variant="outline" 
              size="default" 
              className="flex-1 gap-2" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </Button>
          </div>
        </Card>

        <Tabs value={view} onValueChange={setView}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="bookings" data-testid="tab-bookings">Booking Saya</TabsTrigger>
            {(user.role === 'driver' || user.role === 'admin') && (
              <TabsTrigger value="rides" data-testid="tab-rides">Tumpangan Saya</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="bookings" className="mt-4 space-y-3">
            {bookings.length > 0 ? (
              bookings.map((booking: any) => {
                const ride = rides.find((r: any) => r.id === booking.rideId);
                const mass = masses.find((m: any) => m.id === ride?.massId);
                if (!mass || !ride) return null;

                return (
                  <BookingCard 
                    key={booking.id} 
                    booking={{
                      id: booking.id,
                      massName: mass.name,
                      massDatetime: new Date(mass.datetime),
                      driverName: "Driver",
                      pickupPoint: ride.pickupPoint,
                      seatsRequested: booking.seatsRequested,
                    }}
                    onCancel={(id) => cancelBookingMutation.mutate(id)}
                  />
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-bookings">
                Belum ada booking
              </div>
            )}
          </TabsContent>

          {(user.role === 'driver' || user.role === 'admin') && (
            <TabsContent value="rides" className="mt-4 space-y-3">
              {rides.length > 0 ? (
                rides.map((ride: any) => {
                  const mass = masses.find((m: any) => m.id === ride.massId);
                  if (!mass) return null;

                  return (
                    <RideCard 
                      key={ride.id} 
                      ride={{
                        id: ride.id,
                        massName: mass.name,
                        massDatetime: new Date(mass.datetime),
                        driverName: user.name,
                        driverPhone: user.phone,
                        pickupPoint: ride.pickupPoint,
                        seatsAvailable: ride.seatsAvailable,
                        seatsTotal: ride.seatsTotal,
                        notes: ride.notes,
                      }}
                    />
                  );
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-rides">
                  Belum ada tumpangan yang ditawarkan
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
