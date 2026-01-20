"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Vehicle } from "@prisma/client";
import { Calendar, Car, Loader2, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ConflictAlert } from "./ConflictAlert";
import { createReservation, checkConflict } from "../actions/reservation.actions";
import { getAvailableVehicles } from "@/features/vehicles/actions/vehicle.actions";
import type { ReservationConflict } from "../types/reservation.types";

interface ReservationFormProps {
    vehicles: Vehicle[];
    preselectedVehicleId?: string;
}

export function ReservationForm({ vehicles, preselectedVehicleId }: ReservationFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingConflict, setIsCheckingConflict] = useState(false);
    const [error, setError] = useState("");
    const [conflict, setConflict] = useState<ReservationConflict | null>(null);
    const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>(vehicles);

    const [formData, setFormData] = useState({
        vehicleId: preselectedVehicleId || searchParams.get("vehicleId") || "",
        startDate: "",
        endDate: "",
        purpose: "",
        destination: "",
        notes: "",
    });

    useEffect(() => {
        const checkForConflicts = async () => {
            if (formData.vehicleId && formData.startDate && formData.endDate) {
                setIsCheckingConflict(true);
                const result = await checkConflict(
                    formData.vehicleId,
                    new Date(formData.startDate),
                    new Date(formData.endDate)
                );
                setConflict(result);
                setIsCheckingConflict(false);
            } else {
                setConflict(null);
            }
        };

        const timer = setTimeout(checkForConflicts, 500);
        return () => clearTimeout(timer);
    }, [formData.vehicleId, formData.startDate, formData.endDate]);

    useEffect(() => {
        const updateAvailableVehicles = async () => {
            if (formData.startDate && formData.endDate) {
                const available = await getAvailableVehicles(
                    new Date(formData.startDate),
                    new Date(formData.endDate)
                );
                setAvailableVehicles(available);
            } else {
                setAvailableVehicles(vehicles);
            }
        };

        updateAvailableVehicles();
    }, [formData.startDate, formData.endDate, vehicles]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await createReservation({
            vehicleId: formData.vehicleId,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
            purpose: formData.purpose,
            destination: formData.destination || undefined,
            notes: formData.notes || undefined,
        });

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            router.push("/dashboard/reservations");
            router.refresh();
        }
    };

    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Dates de réservation
                            </CardTitle>
                            <CardDescription>
                                Sélectionnez les dates de début et de fin de votre réservation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Date de début</Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    min={new Date().toISOString().slice(0, 16)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Date de fin</Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    min={formData.startDate || new Date().toISOString().slice(0, 16)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="w-5 h-5 text-primary" />
                                Véhicule
                            </CardTitle>
                            <CardDescription>
                                Choisissez un véhicule parmi ceux disponibles
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="vehicle">Véhicule</Label>
                                <Select
                                    value={formData.vehicleId}
                                    onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un véhicule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableVehicles.map((vehicle) => (
                                            <SelectItem key={vehicle.id} value={vehicle.id}>
                                                {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {isCheckingConflict && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Vérification de la disponibilité...
                                </div>
                            )}

                            {conflict && <ConflictAlert conflict={conflict} />}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Détails de la mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="purpose">Motif de la réservation *</Label>
                                <Input
                                    id="purpose"
                                    placeholder="Ex: Réunion client à Lomé, Livraison de matériel..."
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    required
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground">Minimum 10 caractères</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="destination" className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Destination
                                </Label>
                                <Input
                                    id="destination"
                                    placeholder="Ex: Lomé, Kara, Sokodé..."
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes additionnelles</Label>
                                <textarea
                                    id="notes"
                                    className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Informations complémentaires..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isLoading || (conflict?.hasConflict ?? false)}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Création...
                                </>
                            ) : (
                                "Créer la réservation"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Sidebar - Vehicle Summary */}
                <div>
                    {selectedVehicle ? (
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-lg">Récapitulatif</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="h-32 bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden">
                                    {selectedVehicle.imageUrl ? (
                                        <img
                                            src={selectedVehicle.imageUrl}
                                            alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Car className="w-12 h-12 text-muted-foreground/50" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold">
                                        {selectedVehicle.brand} {selectedVehicle.model}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedVehicle.licensePlate}
                                    </p>
                                </div>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Places</span>
                                        <span>{selectedVehicle.seats}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Type</span>
                                        <span>{selectedVehicle.type}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="sticky top-24">
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Sélectionnez un véhicule pour voir les détails</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </form>
    );
}
