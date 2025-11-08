import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Users } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface BookingCardProps {
  booking: {
    id: string;
    massName: string;
    massDatetime: Date;
    driverName: string;
    pickupPoint?: string;
    seatsRequested: number;
  };
  onCancel?: (bookingId: string) => void;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
  return (
    <Card className="p-4 space-y-3" data-testid={`booking-card-${booking.id}`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-mass-name">
            {booking.massName}
          </h3>
          <Badge variant="secondary" data-testid="badge-seats">
            {booking.seatsRequested} kursi
          </Badge>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span data-testid="text-mass-datetime">
              {format(booking.massDatetime, "EEEE, dd MMM yyyy · HH:mm", { locale: id })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground" data-testid="text-driver-name">Driver: {booking.driverName}</span>
          </div>

          {booking.pickupPoint && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground" data-testid="text-pickup-point">{booking.pickupPoint}</span>
            </div>
          )}
        </div>
      </div>

      {onCancel && (
        <Button
          variant="outline"
          size="default"
          className="w-full"
          onClick={() => onCancel(booking.id)}
          data-testid="button-cancel"
        >
          Batalkan Booking
        </Button>
      )}
    </Card>
  );
}
