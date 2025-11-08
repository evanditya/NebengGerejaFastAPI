import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface MassCardProps {
  mass: {
    id: string;
    name: string;
    datetime: Date;
    special: boolean;
  };
  rideCount?: number;
  onViewRides?: (massId: string) => void;
}

export default function MassCard({ mass, rideCount = 0, onViewRides }: MassCardProps) {
  return (
    <Card className="p-3 space-y-3 hover-elevate" data-testid={`mass-card-${mass.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground" data-testid="text-mass-name">
              {mass.name}
            </h3>
            {mass.special && (
              <Badge variant="secondary" className="text-xs">
                Khusus
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span data-testid="text-mass-date">{format(mass.datetime, "dd MMM yyyy", { locale: id })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span data-testid="text-mass-time">{format(mass.datetime, "HH:mm")}</span>
            </div>
          </div>
        </div>
        {rideCount > 0 && (
          <Badge variant="secondary" data-testid="badge-ride-count">
            {rideCount} tumpangan
          </Badge>
        )}
      </div>
      
      {onViewRides && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onViewRides(mass.id)}
          data-testid="button-view-rides"
        >
          Lihat Tumpangan
        </Button>
      )}
    </Card>
  );
}
