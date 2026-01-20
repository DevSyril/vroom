import { prisma } from "@/lib/prisma";
import type { ReservationConflict } from "../types/reservation.types";

export async function checkReservationConflict(
    vehicleId: string,
    startDate: Date,
    endDate: Date,
    excludeReservationId?: string
): Promise<ReservationConflict> {
    const conflictingReservations = await prisma.reservation.findMany({
        where: {
            vehicleId,
            id: excludeReservationId ? { not: excludeReservationId } : undefined,
            status: {
                in: ["PENDING", "APPROVED"],
            },
            OR: [
                {
                    AND: [
                        { startDate: { lte: startDate } },
                        { endDate: { gte: startDate } },
                    ],
                },
                {
                    AND: [
                        { startDate: { lte: endDate } },
                        { endDate: { gte: endDate } },
                    ],
                },
                {
                    AND: [
                        { startDate: { gte: startDate } },
                        { endDate: { lte: endDate } },
                    ],
                },
            ],
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            vehicle: {
                select: {
                    id: true,
                    brand: true,
                    model: true,
                    licensePlate: true,
                    imageUrl: true,
                },
            },
        },
    });

    return {
        hasConflict: conflictingReservations.length > 0,
        conflictingReservations:
            conflictingReservations.length > 0
                ? conflictingReservations
                : undefined,
        message:
            conflictingReservations.length > 0
                ? `Le véhicule est déjà réservé pour ${conflictingReservations.length} période(s) qui chevauchent votre sélection`
                : undefined,
    };
}
