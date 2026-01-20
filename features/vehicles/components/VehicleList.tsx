"use client";

import { useState, useEffect } from "react";
import { Vehicle } from "@prisma/client";
import { Car } from "lucide-react";
import { VehicleCard } from "./VehicleCard";
import { VehicleFilters } from "./VehicleFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { getVehicles } from "../actions/vehicle.actions";
import type { VehicleFilter } from "../schemas/vehicle.schema";

interface VehicleListProps {
    initialVehicles: Vehicle[];
}

export function VehicleList({ initialVehicles }: VehicleListProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [isLoading, setIsLoading] = useState(false);

    const handleFilterChange = async (filters: VehicleFilter) => {
        setIsLoading(true);
        try {
            const filteredVehicles = await getVehicles(filters);
            setVehicles(filteredVehicles);
        } catch (error) {
            console.error("Failed to filter vehicles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <VehicleFilters onFilterChange={handleFilterChange} />

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : vehicles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Car}
                    title="Aucun véhicule trouvé"
                    description="Essayez de modifier vos filtres de recherche ou vérifiez ultérieurement."
                />
            )}
        </div>
    );
}
