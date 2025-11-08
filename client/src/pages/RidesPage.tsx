import { useState } from "react";
import RideCard from "@/components/RideCard";
import MassCard from "@/components/MassCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function RidesPage() {
  const [selectedMass, setSelectedMass] = useState<string>("all");
  const [view, setView] = useState<string>("rides");

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

  const mockRides = [
    {
      id: '1',
      massId: '1',
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
      massId: '2',
      massName: 'Misa Sabtu Sore',
      massDatetime: new Date(2025, 0, 11, 18, 0),
      driverName: 'Maria Wijaya',
      driverPhone: '082345678901',
      pickupPoint: 'Cibitung, Perumahan Grand Cikarang',
      seatsAvailable: 2,
      seatsTotal: 4,
    },
    {
      id: '3',
      massId: '1',
      massName: 'Misa Minggu Pagi',
      massDatetime: new Date(2025, 0, 12, 7, 0),
      driverName: 'Yohanes Tan',
      driverPhone: '083456789012',
      pickupPoint: 'Jababeka, dekat Gate Utama',
      seatsAvailable: 1,
      seatsTotal: 3,
      notes: 'Siap jemput di area Jababeka.',
    },
  ];

  const filteredRides = selectedMass === "all" 
    ? mockRides 
    : mockRides.filter(ride => ride.massId === selectedMass);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border p-4 bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold mb-4" data-testid="text-page-title">
            Tumpangan
          </h1>
          
          <Tabs value={view} onValueChange={setView}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="rides" data-testid="tab-rides">Tumpangan</TabsTrigger>
              <TabsTrigger value="masses" data-testid="tab-masses">Jadwal Misa</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {view === "rides" && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter berdasarkan Misa</label>
              <Select value={selectedMass} onValueChange={setSelectedMass}>
                <SelectTrigger data-testid="select-mass-filter">
                  <SelectValue placeholder="Semua Misa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Misa</SelectItem>
                  {mockMasses.map((mass) => (
                    <SelectItem key={mass.id} value={mass.id}>
                      {mass.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredRides.length > 0 ? (
                filteredRides.map(ride => (
                  <RideCard 
                    key={ride.id} 
                    ride={ride}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-state">
                  Belum ada tumpangan untuk misa ini
                </div>
              )}
            </div>
          </>
        )}

        {view === "masses" && (
          <div className="space-y-3">
            {mockMasses.map(mass => {
              const rideCount = mockRides.filter(r => r.massId === mass.id).length;
              return (
                <MassCard 
                  key={mass.id} 
                  mass={mass} 
                  rideCount={rideCount}
                  onViewRides={(id) => {
                    setSelectedMass(id);
                    setView("rides");
                  }}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
