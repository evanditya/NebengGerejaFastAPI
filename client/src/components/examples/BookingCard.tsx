import BookingCard from '../BookingCard';

export default function BookingCardExample() {
  const mockBooking = {
    id: '1',
    massName: 'Misa Minggu Pagi',
    massDatetime: new Date(2025, 0, 12, 7, 0),
    driverName: 'Budi Santoso',
    pickupPoint: 'Lippo Cikarang, depan Supermal',
    seatsRequested: 2,
  };

  return (
    <div className="p-4 max-w-md">
      <BookingCard 
        booking={mockBooking} 
        onCancel={(id) => console.log('Cancel booking:', id)} 
      />
    </div>
  );
}
