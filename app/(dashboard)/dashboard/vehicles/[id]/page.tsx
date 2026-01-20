import { notFound } from "next/navigation";
import Link from "next/link";
import { Car, Fuel, Users, Settings2, Calendar, ArrowLeft, MapPin } from "lucide-react";
import { getVehicleById } from "@/features/vehicles/actions/vehicle.actions";
import {
    vehicleTypeLabels,
    fuelTypeLabels,
    transmissionLabels,
    vehicleStatusLabels,
    vehicleStatusColors
} from "@/features/vehicles/types/vehicle.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function VehicleDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const vehicle = await getVehicleById(id);

    if (!vehicle) {
        notFound();
    }

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/vehicles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {vehicle.brand} {vehicle.model}
                    </h1>
                    <p className="text-muted-foreground">
                        {vehicle.year} • {vehicle.licensePlate}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Vehicle Image */}
                    <Card className="overflow-hidden">
                        <div className="relative h-64 md:h-80 bg-gradient-to-br from-muted to-muted/50">
                            {vehicle.imageUrl ? (
                                <img
                                    src={vehicle.imageUrl}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Car className="w-24 h-24 text-muted-foreground/50" />
                                </div>
                            )}
                            <Badge
                                variant={vehicleStatusColors[vehicle.status]}
                                className="absolute top-4 right-4 text-sm px-3 py-1"
                            >
                                {vehicleStatusLabels[vehicle.status]}
                            </Badge>
                        </div>
                    </Card>

                    {/* Specifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Spécifications</CardTitle>
                            <CardDescription>Caractéristiques techniques du véhicule</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl">
                                    <Car className="w-6 h-6 text-primary mb-2" />
                                    <span className="text-sm text-muted-foreground">Type</span>
                                    <span className="font-medium">{vehicleTypeLabels[vehicle.type]}</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl">
                                    <Fuel className="w-6 h-6 text-primary mb-2" />
                                    <span className="text-sm text-muted-foreground">Carburant</span>
                                    <span className="font-medium">{fuelTypeLabels[vehicle.fuelType]}</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl">
                                    <Users className="w-6 h-6 text-primary mb-2" />
                                    <span className="text-sm text-muted-foreground">Places</span>
                                    <span className="font-medium">{vehicle.seats}</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl">
                                    <Settings2 className="w-6 h-6 text-primary mb-2" />
                                    <span className="text-sm text-muted-foreground">Transmission</span>
                                    <span className="font-medium">{transmissionLabels[vehicle.transmission]}</span>
                                </div>
                            </div>

                            {vehicle.mileage && (
                                <>
                                    <Separator className="my-6" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Kilométrage</span>
                                        <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                                    </div>
                                </>
                            )}

                            {vehicle.color && (
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-muted-foreground">Couleur</span>
                                    <span className="font-medium">{vehicle.color}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Features */}
                    {vehicle.features.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Équipements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.features.map((feature) => (
                                        <Badge key={feature} variant="secondary" className="text-sm">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Description */}
                    {vehicle.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {vehicle.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Reservation Action */}
                    <Card className="shadow-glow">
                        <CardHeader>
                            <CardTitle>Réserver ce véhicule</CardTitle>
                            <CardDescription>
                                {vehicle.status === "AVAILABLE"
                                    ? "Véhicule disponible à la réservation"
                                    : "Véhicule actuellement indisponible"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/dashboard/reservations/new?vehicleId=${vehicle.id}`}>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    disabled={vehicle.status !== "AVAILABLE"}
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Réserver maintenant
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Upcoming Reservations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Réservations</CardTitle>
                            <CardDescription>Prochaines réservations de ce véhicule</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {vehicle.reservations.length > 0 ? (
                                <div className="space-y-3">
                                    {vehicle.reservations.slice(0, 5).map((reservation) => (
                                        <div
                                            key={reservation.id}
                                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">{reservation.user.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(reservation.startDate).toLocaleDateString("fr-FR", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                    {" - "}
                                                    {new Date(reservation.endDate).toLocaleDateString("fr-FR", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </p>
                                            </div>
                                            <Badge variant={reservation.status === "APPROVED" ? "success" : "warning"}>
                                                {reservation.status === "APPROVED" ? "Approuvée" : "En attente"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Aucune réservation prévue
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
