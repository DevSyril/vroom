import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Calendar, Clock, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

async function getStats(userId: string) {
    const [totalReservations, pendingReservations, activeReservations, availableVehicles] = await Promise.all([
        prisma.reservation.count({ where: { userId } }),
        prisma.reservation.count({ where: { userId, status: "PENDING" } }),
        prisma.reservation.count({
            where: {
                userId,
                status: "APPROVED",
                startDate: { lte: new Date() },
                endDate: { gte: new Date() }
            }
        }),
        prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
    ]);

    return { totalReservations, pendingReservations, activeReservations, availableVehicles };
}

async function getUpcomingReservations(userId: string) {
    return prisma.reservation.findMany({
        where: {
            userId,
            startDate: { gte: new Date() },
            status: { in: ["PENDING", "APPROVED"] },
        },
        include: {
            vehicle: true,
        },
        orderBy: { startDate: "asc" },
        take: 5,
    });
}

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return null;
    }

    const [stats, upcomingReservations] = await Promise.all([
        getStats(userId),
        getUpcomingReservations(userId),
    ]);

    const statCards = [
        {
            title: "Réservations totales",
            value: stats.totalReservations,
            icon: Calendar,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "En attente",
            value: stats.pendingReservations,
            icon: Clock,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
        },
        {
            title: "En cours",
            value: stats.activeReservations,
            icon: TrendingUp,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            title: "Véhicules disponibles",
            value: stats.availableVehicles,
            icon: Car,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
    ];

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Bonjour, {session.user.name?.split(" ")[0]} 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Bienvenue sur votre tableau de bord de réservation
                    </p>
                </div>
                <Link href="/dashboard/reservations/new">
                    <Button size="lg" className="shadow-glow">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle réservation
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="hover-lift">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Upcoming Reservations */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Réservations à venir</CardTitle>
                        <CardDescription>Vos prochaines réservations de véhicules</CardDescription>
                    </div>
                    <Link href="/dashboard/reservations">
                        <Button variant="ghost" size="sm">
                            Voir tout
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {upcomingReservations.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingReservations.map((reservation) => (
                                <div
                                    key={reservation.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <Car className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {reservation.vehicle.brand} {reservation.vehicle.model}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(reservation.startDate).toLocaleDateString("fr-FR", {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                                {" - "}
                                                {new Date(reservation.endDate).toLocaleDateString("fr-FR", {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            reservation.status === "APPROVED"
                                                ? "success"
                                                : reservation.status === "PENDING"
                                                    ? "warning"
                                                    : "secondary"
                                        }
                                    >
                                        {reservation.status === "APPROVED"
                                            ? "Approuvée"
                                            : reservation.status === "PENDING"
                                                ? "En attente"
                                                : reservation.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Aucune réservation à venir</p>
                            <Link href="/dashboard/reservations/new">
                                <Button variant="outline" className="mt-4">
                                    Faire une réservation
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
