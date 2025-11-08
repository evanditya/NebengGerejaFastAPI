import MassCard from '../MassCard';

export default function MassCardExample() {
  const mockMass = {
    id: '1',
    name: 'Misa Minggu Pagi',
    datetime: new Date(2025, 0, 12, 7, 0),
    special: false,
  };

  return (
    <div className="p-4 max-w-md">
      <MassCard 
        mass={mockMass} 
        rideCount={5}
        onViewRides={(id) => console.log('View rides for mass:', id)} 
      />
    </div>
  );
}
