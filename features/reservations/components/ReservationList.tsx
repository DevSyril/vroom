import { Calendar } from "lucide-react";
import { ReservationCard } from "./ReservationCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReservationWithRelations } from "../types/reservation.types";

interface ReservationListProps {
    reservations: ReservationWithRelations[];
}

export function ReservationList({ reservations }: ReservationListProps) {
    if (reservations.length === 0) {
        return (
            <EmptyState
                icon={Calendar}
                title="Aucune réservation"
                description="Vous n'avez pas encore effectué de réservation. Commencez par réserver un véhicule."
                action={
                    <Link href="/dashboard/reservations/new">
                        <Button>Nouvelle réservation</Button>
                    </Link>
                }
            />
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
        </div>
    );
}
