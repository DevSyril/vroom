import { getVehicles } from "@/features/vehicles/actions/vehicle.actions";
import { VehicleList } from "@/features/vehicles/components/VehicleList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function VehiclesPage() {
    const session = await auth();
    const vehicles = await getVehicles();
    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Véhicules</h1>
                    <p className="text-muted-foreground mt-1">
                        Parcourez notre flotte de {vehicles.length} véhicules disponibles
                    </p>
                </div>
                {isAdmin && (
                    <Link href="/dashboard/vehicles/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un véhicule
                        </Button>
                    </Link>
                )}
            </div>

            <VehicleList initialVehicles={vehicles} />
        </div>
    );
}
