import { z } from "zod";

export const ReservationStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
} as const;

export const reservationSchema = z.object({
    vehicleId: z.string().min(1, "Veuillez sélectionner un véhicule"),
    startDate: z.coerce.date({
        required_error: "La date de début est requise",
    }),
    endDate: z.coerce.date({
        required_error: "La date de fin est requise",
    }),
    purpose: z
        .string()
        .min(10, "Le motif doit contenir au moins 10 caractères")
        .max(500, "Le motif est trop long"),
    destination: z.string().max(200).optional(),
    notes: z.string().max(1000).optional(),
}).refine((data) => data.endDate > data.startDate, {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
});

export const updateReservationStatusSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"]),
    notes: z.string().optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;
