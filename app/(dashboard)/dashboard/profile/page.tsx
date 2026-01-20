import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Building, Calendar, Shield } from "lucide-react";

const roleLabels = {
    ADMIN: "Administrateur",
    MANAGER: "Manager",
    EMPLOYEE: "Employé",
};

const roleColors = {
    ADMIN: "destructive" as const,
    MANAGER: "warning" as const,
    EMPLOYEE: "secondary" as const,
};

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            _count: {
                select: {
                    reservations: true,
                },
            },
        },
    });

    if (!user) {
        return null;
    }

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const stats = await prisma.reservation.groupBy({
        by: ["status"],
        where: { userId: user.id },
        _count: true,
    });

    const statsByStatus = stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6 animate-fade-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
                <p className="text-muted-foreground mt-1">
                    Gérez vos informations personnelles
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage src={user.avatar || ""} alt={user.name} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <Badge variant={roleColors[user.role]} className="mt-2">
                                {roleLabels[user.role]}
                            </Badge>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium text-sm">{user.email}</p>
                                </div>
                            </div>

                            {user.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Téléphone</p>
                                        <p className="font-medium text-sm">{user.phone}</p>
                                    </div>
                                </div>
                            )}

                            {user.department && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                        <Building className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Département</p>
                                        <p className="font-medium text-sm">{user.department}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Membre depuis</p>
                                    <p className="font-medium text-sm">
                                        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistiques de réservation</CardTitle>
                            <CardDescription>Aperçu de vos réservations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-muted/50 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-primary">
                                        {user._count.reservations}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                </div>
                                <div className="p-4 bg-amber-500/10 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-amber-600">
                                        {statsByStatus["PENDING"] || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">En attente</p>
                                </div>
                                <div className="p-4 bg-emerald-500/10 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-emerald-600">
                                        {statsByStatus["APPROVED"] || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Approuvées</p>
                                </div>
                                <div className="p-4 bg-blue-500/10 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-blue-600">
                                        {statsByStatus["COMPLETED"] || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Terminées</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                Rôle et permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                                    <div>
                                        <p className="font-medium">Rôle actuel</p>
                                        <p className="text-sm text-muted-foreground">
                                            {roleLabels[user.role]}
                                        </p>
                                    </div>
                                    <Badge variant={roleColors[user.role]}>
                                        {roleLabels[user.role]}
                                    </Badge>
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${user.role !== "EMPLOYEE" ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                                        <span className={user.role !== "EMPLOYEE" ? "" : "text-muted-foreground"}>
                                            Approuver les réservations
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${user.role === "ADMIN" ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                                        <span className={user.role === "ADMIN" ? "" : "text-muted-foreground"}>
                                            Gérer les véhicules
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${user.role === "ADMIN" ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                                        <span className={user.role === "ADMIN" ? "" : "text-muted-foreground"}>
                                            Gérer les utilisateurs
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
