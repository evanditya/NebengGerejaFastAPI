import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, User, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface RideCardProps {
  ride: {
    id: string;
    massName: string;
    massDatetime: Date;
    driverName: string;
    driverPhone: string;
    pickupPoint?: string;
    seatsAvailable: number;
    seatsTotal: number;
    notes?: string;
  };
  onViewDetails?: (rideId: string) => void;
}

export default function RideCard({ ride, onViewDetails }: RideCardProps) {
  const seatPercentage = (ride.seatsAvailable / ride.seatsTotal) * 100;
  const isLowSeats = ride.seatsAvailable <= 2;

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo ${ride.driverName}, saya tertarik dengan tumpangan Anda untuk ${ride.massName} pada ${format(ride.massDatetime, "EEEE, dd MMMM yyyy 'pukul' HH:mm", { locale: id })}`
    );
    window.open(`https://wa.me/${ride.driverPhone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <Card className="p-4 space-y-3 hover-elevate" data-testid={`ride-card-${ride.id}`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground" data-testid="text-mass-name">
              {ride.massName}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span data-testid="text-mass-datetime">
                {format(ride.massDatetime, "EEEE, dd MMM yyyy", { locale: id })} · {format(ride.massDatetime, "HH:mm")}
              </span>
            </div>
          </div>
          <Badge variant={isLowSeats ? "destructive" : "secondary"} data-testid="badge-seats">
            {ride.seatsAvailable}/{ride.seatsTotal} kursi
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {ride.driverName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium" data-testid="text-driver-name">{ride.driverName}</span>
          </div>
        </div>

        {ride.pickupPoint && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground" data-testid="text-pickup-point">{ride.pickupPoint}</span>
          </div>
        )}

        {ride.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid="text-notes">
            {ride.notes}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="default"
          className="flex-1"
          onClick={() => onViewDetails?.(ride.id)}
          data-testid="button-view-details"
        >
          Lihat Detail
        </Button>
        <Button
          size="default"
          className="flex-1 gap-2"
          onClick={handleWhatsApp}
          data-testid="button-whatsapp"
        >
          <MessageCircle className="w-4 h-4" />
          Hubungi
        </Button>
      </div>
    </Card>
  );
}
