import { Vehicle } from "@prisma/client";
import { Car, Fuel, Users, Settings2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    vehicleTypeLabels,
    fuelTypeLabels,
    transmissionLabels,
    vehicleStatusLabels,
    vehicleStatusColors
} from "../types/vehicle.types";

interface VehicleCardProps {
    vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
    return (
        <Card className="hover-lift overflow-hidden group">
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                {vehicle.imageUrl ? (
                    <img
                        src={vehicle.imageUrl}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-16 h-16 text-muted-foreground/50" />
                    </div>
                )}
                <Badge
                    variant={vehicleStatusColors[vehicle.status]}
                    className="absolute top-3 right-3"
                >
                    {vehicleStatusLabels[vehicle.status]}
                </Badge>
            </div>

            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">
                            {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.licensePlate}
                        </p>
                    </div>
                    <Badge variant="outline">{vehicleTypeLabels[vehicle.type]}</Badge>
                </div>
            </CardHeader>

            <CardContent className="pb-2">
                <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Fuel className="w-4 h-4" />
                        <span>{fuelTypeLabels[vehicle.fuelType]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{vehicle.seats} places</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Settings2 className="w-4 h-4" />
                        <span>{transmissionLabels[vehicle.transmission]}</span>
                    </div>
                </div>

                {vehicle.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {vehicle.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                            </Badge>
                        ))}
                        {vehicle.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{vehicle.features.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-4">
                <Link href={`/dashboard/vehicles/${vehicle.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                        Voir les détails
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
