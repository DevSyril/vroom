import Link from "next/link";
import { Car, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reservationStatusLabels, reservationStatusColors, type ReservationWithRelations } from "../types/reservation.types";

interface ReservationCardProps {
    reservation: ReservationWithRelations;
}

export function ReservationCard({ reservation }: ReservationCardProps) {
    const formatDateRange = (start: Date, end: Date) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        return `${startDate.toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "numeric",
            month: "short",
        })} - ${endDate.toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "numeric",
            month: "short",
        })}`;
    };

    return (
        <Card className="hover-lift">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    {/* Vehicle Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden shrink-0">
                        {reservation.vehicle.imageUrl ? (
                            <img
                                src={reservation.vehicle.imageUrl}
                                alt={`${reservation.vehicle.brand} ${reservation.vehicle.model}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold">
                                    {reservation.vehicle.brand} {reservation.vehicle.model}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {reservation.vehicle.licensePlate}
                                </p>
                            </div>
                            <Badge variant={reservationStatusColors[reservation.status]}>
                                {reservationStatusLabels[reservation.status]}
                            </Badge>
                        </div>

                        <div className="mt-2 space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDateRange(reservation.startDate, reservation.endDate)}</span>
                            </div>
                            {reservation.destination && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{reservation.destination}</span>
                                </div>
                            )}
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
                            {reservation.purpose}
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Link href={`/dashboard/reservations/${reservation.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                        Voir les détails
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
