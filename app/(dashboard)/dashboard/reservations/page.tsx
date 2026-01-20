import { getReservations } from "@/features/reservations/actions/reservation.actions";
import { ReservationList } from "@/features/reservations/components/ReservationList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ReservationsPage() {
    const session = await auth();
    const reservations = await getReservations();

    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

    // Grouper par statut
    const pendingReservations = reservations.filter((r) => r.status === "PENDING");
    const approvedReservations = reservations.filter((r) => r.status === "APPROVED");
    const completedReservations = reservations.filter((r) => r.status === "COMPLETED");
    const cancelledReservations = reservations.filter((r) => r.status === "CANCELLED" || r.status === "REJECTED");

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Réservations</h1>
                    <p className="text-muted-foreground mt-1">
                        Gérez vos réservations de véhicules
                    </p>
                </div>
                <Link href="/dashboard/reservations/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle réservation
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">
                        Toutes ({reservations.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        En attente ({pendingReservations.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approuvées ({approvedReservations.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        Terminées ({completedReservations.length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled">
                        Annulées ({cancelledReservations.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <ReservationList reservations={reservations} />
                </TabsContent>

                <TabsContent value="pending">
                    <ReservationList reservations={pendingReservations} />
                </TabsContent>

                <TabsContent value="approved">
                    <ReservationList reservations={approvedReservations} />
                </TabsContent>

                <TabsContent value="completed">
                    <ReservationList reservations={completedReservations} />
                </TabsContent>

                <TabsContent value="cancelled">
                    <ReservationList reservations={cancelledReservations} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
