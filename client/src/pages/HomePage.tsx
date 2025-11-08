import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import MassCard from "@/components/MassCard";
import RideCard from "@/components/RideCard";
import heroImage from "@assets/generated_images/Church_community_carpooling_hero_3e826d8b.png";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function HomePage() {
  const { user } = useAuth();

  const { data: massesData } = useQuery({
    queryKey: ["/api/masses"],
    queryFn: async () => {
      const response = await fetch("/api/masses");
      if (!response.ok) throw new Error("Failed to fetch masses");
      return response.json();
    },
  });

  const { data: ridesData } = useQuery({
    queryKey: ["/api/rides"],
    queryFn: async () => {
      const response = await fetch("/api/rides");
      if (!response.ok) throw new Error("Failed to fetch rides");
      return response.json();
    },
  });

  const masses = massesData?.masses || [];
  const rides = ridesData?.rides || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Komunitas Gereja" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold text-white mb-2" data-testid="text-hero-title">
            Nebeng Gereja
          </h1>
          <p className="text-sm text-white/90" data-testid="text-hero-subtitle">
            Berbagi Perjalanan, Berbagi Berkat
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {!user && (
          <div className="flex gap-3">
            <Link href="/login" className="flex-1">
              <Button variant="outline" size="default" className="w-full" data-testid="button-login">
                Masuk
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button size="default" className="w-full" data-testid="button-register">
                Daftar
              </Button>
            </Link>
          </div>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" data-testid="text-section-masses">
              Jadwal Misa
            </h2>
            <Link href="/rides">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-masses">
                Lihat Semua
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {masses.slice(0, 3).map((mass: any) => (
              <MassCard 
                key={mass.id} 
                mass={{
                  ...mass,
                  datetime: new Date(mass.datetime),
                }} 
                rideCount={rides.filter((r: any) => r.massId === mass.id).length}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" data-testid="text-section-rides">
              Tumpangan Terbaru
            </h2>
            <Link href="/rides">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-rides">
                Lihat Semua
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {rides.slice(0, 3).map((ride: any) => {
              const mass = masses.find((m: any) => m.id === ride.massId);
              if (!mass) return null;
              
              return (
                <RideCard 
                  key={ride.id} 
                  ride={{
                    id: ride.id,
                    massName: mass.name,
                    massDatetime: new Date(mass.datetime),
                    driverName: "Driver",
                    driverPhone: "08123456789",
                    pickupPoint: ride.pickupPoint,
                    seatsAvailable: ride.seatsAvailable,
                    seatsTotal: ride.seatsTotal,
                    notes: ride.notes,
                  }}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
