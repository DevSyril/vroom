import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReservationConflict } from "../types/reservation.types";

interface ConflictAlertProps {
    conflict: ReservationConflict;
}

export function ConflictAlert({ conflict }: ConflictAlertProps) {
    if (!conflict.hasConflict) return null;

    return (
        <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <CardTitle className="text-destructive text-lg">Conflit de réservation</CardTitle>
                </div>
                <CardDescription className="text-destructive/80">
                    {conflict.message}
                </CardDescription>
            </CardHeader>
            {conflict.conflictingReservations && conflict.conflictingReservations.length > 0 && (
                <CardContent className="pt-0">
                    <div className="space-y-2">
                        {conflict.conflictingReservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg text-sm"
                            >
                                <div>
                                    <p className="font-medium">{reservation.user.name}</p>
                                    <p className="text-muted-foreground">
                                        {new Date(reservation.startDate).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                        {" - "}
                                        {new Date(reservation.endDate).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
