import RideCard from '../RideCard';

export default function RideCardExample() {
  const mockRide = {
    id: '1',
    massName: 'Misa Minggu Pagi',
    massDatetime: new Date(2025, 0, 12, 7, 0),
    driverName: 'Budi Santoso',
    driverPhone: '081234567890',
    pickupPoint: 'Lippo Cikarang, depan Supermal',
    seatsAvailable: 3,
    seatsTotal: 5,
    notes: 'Berangkat jam 6:30 pagi. Mohon konfirmasi H-1.',
  };

  return (
    <div className="p-4 max-w-md">
      <RideCard 
        ride={mockRide} 
        onViewDetails={(id) => console.log('View details:', id)} 
      />
    </div>
  );
}
