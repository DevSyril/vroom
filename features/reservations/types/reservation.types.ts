import { Reservation, ReservationStatus, User, Vehicle } from "@prisma/client";

export type ReservationWithRelations = Reservation & {
    user: Pick<User, "id" | "name" | "email">;
    vehicle: Pick<Vehicle, "id" | "brand" | "model" | "licensePlate" | "imageUrl">;
};

export interface ReservationConflict {
    hasConflict: boolean;
    conflictingReservations?: ReservationWithRelations[];
    message?: string;
}

export interface ReservationStats {
    total: number;
    pending: number;
    approved: number;
    completed: number;
    cancelled: number;
}

export const reservationStatusLabels: Record<ReservationStatus, string> = {
    PENDING: "En attente",
    APPROVED: "Approuvée",
    REJECTED: "Refusée",
    COMPLETED: "Terminée",
    CANCELLED: "Annulée",
};

export const reservationStatusColors: Record<ReservationStatus, "success" | "warning" | "destructive" | "secondary" | "info"> = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "destructive",
    COMPLETED: "secondary",
    CANCELLED: "destructive",
};
