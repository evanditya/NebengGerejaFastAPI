import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RideCard from "@/components/RideCard";
import MassCard from "@/components/MassCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function RidesPage() {
  const [selectedMass, setSelectedMass] = useState<string>("all");
  const [view, setView] = useState<string>("rides");

  const { data: massesData } = useQuery({
    queryKey: ["/api/masses"],
    queryFn: async () => {
      const response = await fetch("/api/masses");
      if (!response.ok) throw new Error("Failed to fetch masses");
      return response.json();
    },
  });

  const { data: ridesData } = useQuery({
    queryKey: ["/api/rides", selectedMass],
    queryFn: async () => {
      const url = selectedMass === "all" ? "/api/rides" : `/api/rides?massId=${selectedMass}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch rides");
      return response.json();
    },
  });

  const masses = massesData?.masses || [];
  const rides = ridesData?.rides || [];

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
                  {masses.map((mass: any) => (
                    <SelectItem key={mass.id} value={mass.id}>
                      {mass.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
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
                        driverName: "Driver",
                        driverPhone: "08123456789",
                        pickupPoint: ride.pickupPoint,
                        seatsAvailable: ride.seatsAvailable,
                        seatsTotal: ride.seatsTotal,
                        notes: ride.notes,
                      }}
                    />
                  );
                })
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
            {masses.map((mass: any) => {
              const rideCount = rides.filter((r: any) => r.massId === mass.id).length;
              return (
                <MassCard 
                  key={mass.id} 
                  mass={{
                    ...mass,
                    datetime: new Date(mass.datetime),
                  }} 
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
