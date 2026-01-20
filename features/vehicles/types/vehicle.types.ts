import { Vehicle, VehicleType, VehicleStatus, FuelType, Transmission, ReservationStatus } from "@prisma/client";

export type VehicleWithReservations = Vehicle & {
    reservations: {
        id: string;
        startDate: Date;
        endDate: Date;
        status: ReservationStatus;
    }[];
};

export interface VehicleAvailability {
    vehicleId: string;
    isAvailable: boolean;
    nextAvailableDate?: Date;
    conflictingReservations?: string[];
}

export const vehicleTypeLabels: Record<VehicleType, string> = {
    SEDAN: "Berline",
    SUV: "SUV",
    VAN: "Van",
    TRUCK: "Camion",
    UTILITY: "Utilitaire",
};

export const fuelTypeLabels: Record<FuelType, string> = {
    GASOLINE: "Essence",
    DIESEL: "Diesel",
    ELECTRIC: "Électrique",
    HYBRID: "Hybride",
};

export const transmissionLabels: Record<Transmission, string> = {
    MANUAL: "Manuelle",
    AUTOMATIC: "Automatique",
};

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
    AVAILABLE: "Disponible",
    IN_USE: "En utilisation",
    MAINTENANCE: "En maintenance",
    UNAVAILABLE: "Indisponible",
};

export const vehicleStatusColors: Record<VehicleStatus, "success" | "warning" | "destructive" | "secondary"> = {
    AVAILABLE: "success",
    IN_USE: "warning",
    MAINTENANCE: "destructive",
    UNAVAILABLE: "secondary",
};
