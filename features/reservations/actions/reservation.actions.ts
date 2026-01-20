"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reservationSchema, updateReservationStatusSchema, type ReservationInput, type UpdateReservationStatusInput } from "../schemas/reservation.schema";
import { checkReservationConflict } from "../utils/conflict-detection";
import { revalidatePath } from "next/cache";

export async function getReservations(userId?: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Non authentifié");
    }

    const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGER";

    return prisma.reservation.findMany({
        where: userId || !isAdmin ? { userId: userId || session.user.id } : undefined,
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
        orderBy: { startDate: "desc" },
    });
}

export async function getReservationById(id: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Non authentifié");
    }

    const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    department: true,
                    phone: true,
                },
            },
            vehicle: true,
        },
    });

    if (!reservation) {
        return null;
    }

    // Check authorization
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGER";
    if (!isAdmin && reservation.userId !== session.user.id) {
        throw new Error("Non autorisé");
    }

    return reservation;
}

export async function createReservation(data: ReservationInput) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Non authentifié");
    }

    const validated = reservationSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.errors[0].message };
    }

    // Check for date in the past
    if (validated.data.startDate < new Date()) {
        return { error: "La date de début ne peut pas être dans le passé" };
    }

    // Check for conflicts
    const conflict = await checkReservationConflict(
        validated.data.vehicleId,
        validated.data.startDate,
        validated.data.endDate
    );

    if (conflict.hasConflict) {
        return { error: conflict.message };
    }

    const reservation = await prisma.reservation.create({
        data: {
            ...validated.data,
            userId: session.user.id,
        },
        include: {
            vehicle: true,
        },
    });

    revalidatePath("/dashboard/reservations");
    revalidatePath("/dashboard");
    return { success: true, reservation };
}

export async function updateReservationStatus(id: string, data: UpdateReservationStatusInput) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Non authentifié");
    }

    const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGER";

    const reservation = await prisma.reservation.findUnique({
        where: { id },
    });

    if (!reservation) {
        return { error: "Réservation non trouvée" };
    }

    // Only admin/manager can approve/reject, owner can cancel
    if (!isAdmin && reservation.userId !== session.user.id) {
        return { error: "Non autorisé" };
    }

    if (!isAdmin && data.status !== "CANCELLED") {
        return { error: "Vous pouvez uniquement annuler votre réservation" };
    }

    const validated = updateReservationStatusSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.errors[0].message };
    }

    const updated = await prisma.reservation.update({
        where: { id },
        data: {
            status: validated.data.status,
            notes: validated.data.notes || reservation.notes,
        },
    });

    revalidatePath("/dashboard/reservations");
    revalidatePath("/dashboard");
    return { success: true, reservation: updated };
}

export async function cancelReservation(id: string) {
    return updateReservationStatus(id, { status: "CANCELLED" });
}

export async function checkConflict(vehicleId: string, startDate: Date, endDate: Date) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Non authentifié");
    }

    return checkReservationConflict(vehicleId, startDate, endDate);
}
