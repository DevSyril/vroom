import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Car, MapPin, User, FileText, Clock } from "lucide-react";
import { getReservationById, cancelReservation, updateReservationStatus } from "@/features/reservations/actions/reservation.actions";
import { reservationStatusLabels, reservationStatusColors } from "@/features/reservations/types/reservation.types";
import { vehicleTypeLabels, fuelTypeLabels, transmissionLabels } from "@/features/vehicles/types/vehicle.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { CancelReservationButton, ApproveRejectButtons } from "./actions";

export default async function ReservationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();
    const reservation = await getReservationById(id);

    if (!reservation) {
        notFound();
    }

    const isOwner = reservation.userId === session?.user?.id;
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";
    const canCancel = isOwner && (reservation.status === "PENDING" || reservation.status === "APPROVED");
    const canApprove = isAdmin && reservation.status === "PENDING";

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/reservations">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Réservation #{reservation.id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-muted-foreground">
                            Créée le {new Date(reservation.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                    </div>
                </div>
                <Badge
                    variant={reservationStatusColors[reservation.status]}
                    className="text-sm px-4 py-1"
                >
                    {reservationStatusLabels[reservation.status]}
                </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Période de réservation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/50 rounded-xl">
                                    <p className="text-sm text-muted-foreground mb-1">Début</p>
                                    <p className="font-medium">{formatDate(reservation.startDate)}</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-xl">
                                    <p className="text-sm text-muted-foreground mb-1">Fin</p>
                                    <p className="font-medium">{formatDate(reservation.endDate)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vehicle */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="w-5 h-5 text-primary" />
                                Véhicule réservé
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <div className="w-32 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden shrink-0">
                                    {reservation.vehicle.imageUrl ? (
                                        <img
                                            src={reservation.vehicle.imageUrl}
                                            alt={`${reservation.vehicle.brand} ${reservation.vehicle.model}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Car className="w-10 h-10 text-muted-foreground/50" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {reservation.vehicle.brand} {reservation.vehicle.model}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {reservation.vehicle.licensePlate}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">{vehicleTypeLabels[reservation.vehicle.type]}</Badge>
                                        <Badge variant="outline">{fuelTypeLabels[reservation.vehicle.fuelType]}</Badge>
                                        <Badge variant="outline">{reservation.vehicle.seats} places</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mission Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Détails de la mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Motif</p>
                                <p className="font-medium">{reservation.purpose}</p>
                            </div>
                            {reservation.destination && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> Destination
                                    </p>
                                    <p className="font-medium">{reservation.destination}</p>
                                </div>
                            )}
                            {reservation.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                                    <p className="whitespace-pre-line">{reservation.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {canApprove && (
                                <ApproveRejectButtons reservationId={reservation.id} />
                            )}
                            {canCancel && (
                                <CancelReservationButton reservationId={reservation.id} />
                            )}
                            {!canCancel && !canApprove && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Aucune action disponible
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* User Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Demandeur
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium">{reservation.user.name}</p>
                            <p className="text-sm text-muted-foreground">{reservation.user.email}</p>
                            {reservation.user.department && (
                                <p className="text-sm text-muted-foreground">{reservation.user.department}</p>
                            )}
                            {reservation.user.phone && (
                                <p className="text-sm text-muted-foreground">{reservation.user.phone}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Historique
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                                    <div>
                                        <p className="text-sm font-medium">Réservation créée</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(reservation.createdAt).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {reservation.updatedAt !== reservation.createdAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Dernière mise à jour</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(reservation.updatedAt).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
