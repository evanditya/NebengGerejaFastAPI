import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingCard from "@/components/BookingCard";
import RideCard from "@/components/RideCard";
import { User, Settings, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [view, setView] = useState<string>("bookings");

  //todo: remove mock functionality
  const mockUser = {
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "081234567890",
    lingkungan: "Lingkungan St. Petrus",
    role: "driver",
  };

  const mockBookings = [
    {
      id: '1',
      massName: 'Misa Minggu Pagi',
      massDatetime: new Date(2025, 0, 12, 7, 0),
      driverName: 'Maria Wijaya',
      pickupPoint: 'Cibitung, Perumahan Grand Cikarang',
      seatsRequested: 2,
    },
  ];

  const mockMyRides = [
    {
      id: '1',
      massName: 'Misa Minggu Pagi',
      massDatetime: new Date(2025, 0, 12, 7, 0),
      driverName: 'Budi Santoso',
      driverPhone: '081234567890',
      pickupPoint: 'Lippo Cikarang, depan Supermal',
      seatsAvailable: 3,
      seatsTotal: 5,
      notes: 'Berangkat jam 6:30 pagi. Mohon konfirmasi H-1.',
    },
  ];

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
                {mockUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold" data-testid="text-user-name">{mockUser.name}</h2>
              <p className="text-sm text-muted-foreground" data-testid="text-user-email">{mockUser.email}</p>
              <p className="text-sm text-muted-foreground" data-testid="text-user-phone">{mockUser.phone}</p>
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-user-lingkungan">{mockUser.lingkungan}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {mockUser.role === 'driver' ? 'Driver' : 'Penumpang'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" size="default" className="flex-1 gap-2" data-testid="button-settings">
              <Settings className="w-4 h-4" />
              Pengaturan
            </Button>
            <Button variant="outline" size="default" className="flex-1 gap-2" data-testid="button-logout">
              <LogOut className="w-4 h-4" />
              Keluar
            </Button>
          </div>
        </Card>

        <Tabs value={view} onValueChange={setView}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="bookings" data-testid="tab-bookings">Booking Saya</TabsTrigger>
            {mockUser.role === 'driver' && (
              <TabsTrigger value="rides" data-testid="tab-rides">Tumpangan Saya</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="bookings" className="mt-4 space-y-3">
            {mockBookings.length > 0 ? (
              mockBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking}
                  onCancel={(id) => console.log('Cancel booking:', id)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-bookings">
                Belum ada booking
              </div>
            )}
          </TabsContent>

          {mockUser.role === 'driver' && (
            <TabsContent value="rides" className="mt-4 space-y-3">
              {mockMyRides.length > 0 ? (
                mockMyRides.map(ride => (
                  <RideCard 
                    key={ride.id} 
                    ride={ride}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                ))
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
