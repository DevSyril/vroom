import { z } from "zod";

export const VehicleType = {
    SEDAN: "SEDAN",
    SUV: "SUV",
    VAN: "VAN",
    TRUCK: "TRUCK",
    UTILITY: "UTILITY",
} as const;

export const FuelType = {
    GASOLINE: "GASOLINE",
    DIESEL: "DIESEL",
    ELECTRIC: "ELECTRIC",
    HYBRID: "HYBRID",
} as const;

export const Transmission = {
    MANUAL: "MANUAL",
    AUTOMATIC: "AUTOMATIC",
} as const;

export const VehicleStatus = {
    AVAILABLE: "AVAILABLE",
    IN_USE: "IN_USE",
    MAINTENANCE: "MAINTENANCE",
    UNAVAILABLE: "UNAVAILABLE",
} as const;

export const vehicleSchema = z.object({
    brand: z.string().min(1, "La marque est requise"),
    model: z.string().min(1, "Le modèle est requis"),
    year: z
        .number()
        .min(1900, "Année invalide")
        .max(new Date().getFullYear() + 1, "Année invalide"),
    licensePlate: z
        .string()
        .min(1, "La plaque d'immatriculation est requise")
        .regex(/^[A-Z0-9-]+$/i, "Format de plaque invalide"),
    type: z.enum(["SEDAN", "SUV", "VAN", "TRUCK", "UTILITY"]),
    fuelType: z.enum(["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"]),
    seats: z.number().min(1).max(50),
    transmission: z.enum(["MANUAL", "AUTOMATIC"]),
    color: z.string().optional(),
    mileage: z.number().min(0).optional(),
    status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "UNAVAILABLE"]).default("AVAILABLE"),
    features: z.array(z.string()).default([]),
    imageUrl: z.string().url().optional().or(z.literal("")),
    description: z.string().max(1000).optional(),
});

export const vehicleFilterSchema = z.object({
    type: z.enum(["SEDAN", "SUV", "VAN", "TRUCK", "UTILITY"]).optional(),
    fuelType: z.enum(["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"]).optional(),
    transmission: z.enum(["MANUAL", "AUTOMATIC"]).optional(),
    status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "UNAVAILABLE"]).optional(),
    minSeats: z.number().optional(),
    search: z.string().optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type VehicleFilter = z.infer<typeof vehicleFilterSchema>;
