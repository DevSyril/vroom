import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getVehicles } from "@/features/vehicles/actions/vehicle.actions";
import { ReservationForm } from "@/features/reservations/components/ReservationForm";
import { Button } from "@/components/ui/button";

export default async function NewReservationPage() {
    const vehicles = await getVehicles({ status: "AVAILABLE" });

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/reservations">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nouvelle Réservation</h1>
                    <p className="text-muted-foreground mt-1">
                        Réservez un véhicule pour votre mission
                    </p>
                </div>
            </div>

            <ReservationForm vehicles={vehicles} />
        </div>
    );
}
