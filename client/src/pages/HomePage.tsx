import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MassCard from "@/components/MassCard";
import RideCard from "@/components/RideCard";
import heroImage from "@assets/generated_images/Church_community_carpooling_hero_3e826d8b.png";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  const [user] = useState<any>(null);

  //todo: remove mock functionality
  const mockMasses = [
    {
      id: '1',
      name: 'Misa Minggu Pagi',
      datetime: new Date(2025, 0, 12, 7, 0),
      special: false,
    },
    {
      id: '2',
      name: 'Misa Sabtu Sore',
      datetime: new Date(2025, 0, 11, 18, 0),
      special: false,
    },
    {
      id: '3',
      name: 'Misa Kamis Putih',
      datetime: new Date(2025, 3, 17, 19, 0),
      special: true,
    },
  ];

  const mockRecentRides = [
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
    {
      id: '2',
      massName: 'Misa Sabtu Sore',
      massDatetime: new Date(2025, 0, 11, 18, 0),
      driverName: 'Maria Wijaya',
      driverPhone: '082345678901',
      pickupPoint: 'Cibitung, Perumahan Grand Cikarang',
      seatsAvailable: 2,
      seatsTotal: 4,
    },
  ];

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
            {mockMasses.map(mass => (
              <MassCard 
                key={mass.id} 
                mass={mass} 
                rideCount={mass.id === '1' ? 5 : mass.id === '2' ? 3 : 0}
                onViewRides={(id) => console.log('View rides for mass:', id)}
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
            {mockRecentRides.map(ride => (
              <RideCard 
                key={ride.id} 
                ride={ride}
                onViewDetails={(id) => console.log('View details:', id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
