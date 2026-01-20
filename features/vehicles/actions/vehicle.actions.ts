"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { vehicleSchema, vehicleFilterSchema, type VehicleInput, type VehicleFilter } from "../schemas/vehicle.schema";
import { revalidatePath } from "next/cache";

export async function getVehicles(filter?: VehicleFilter) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Non authentifié");
    }

    const where: Record<string, unknown> = {};

    if (filter) {
        const validated = vehicleFilterSchema.safeParse(filter);
        if (validated.success) {
            const { type, fuelType, transmission, status, minSeats, search } = validated.data;

            if (type) where.type = type;
            if (fuelType) where.fuelType = fuelType;
            if (transmission) where.transmission = transmission;
            if (status) where.status = status;
            if (minSeats) where.seats = { gte: minSeats };
            if (search) {
                where.OR = [
                    { brand: { contains: search, mode: "insensitive" } },
                    { model: { contains: search, mode: "insensitive" } },
                    { licensePlate: { contains: search, mode: "insensitive" } },
                ];
            }
        }
    }

    return prisma.vehicle.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            reservations: {
                where: {
                    status: { in: ["PENDING", "APPROVED"] },
                    endDate: { gte: new Date() },
                },
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    status: true,
                },
            },
        },
    });
}

export async function getVehicleById(id: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Non authentifié");
    }

    return prisma.vehicle.findUnique({
        where: { id },
        include: {
            reservations: {
                where: {
                    status: { in: ["PENDING", "APPROVED"] },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: { startDate: "desc" },
            },
        },
    });
}

export async function createVehicle(data: VehicleInput) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Non autorisé");
    }

    const validated = vehicleSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.errors[0].message };
    }

    const vehicle = await prisma.vehicle.create({
        data: validated.data,
    });

    revalidatePath("/dashboard/vehicles");
    return { success: true, vehicle };
}

export async function updateVehicle(id: string, data: Partial<VehicleInput>) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Non autorisé");
    }

    const vehicle = await prisma.vehicle.update({
        where: { id },
        data,
    });

    revalidatePath("/dashboard/vehicles");
    revalidatePath(`/dashboard/vehicles/${id}`);
    return { success: true, vehicle };
}

export async function deleteVehicle(id: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Non autorisé");
    }

    await prisma.vehicle.delete({
        where: { id },
    });

    revalidatePath("/dashboard/vehicles");
    return { success: true };
}

export async function getAvailableVehicles(startDate: Date, endDate: Date) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Non authentifié");
    }

    return prisma.vehicle.findMany({
        where: {
            status: "AVAILABLE",
            reservations: {
                none: {
                    status: { in: ["PENDING", "APPROVED"] },
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
            },
        },
        orderBy: { brand: "asc" },
    });
}
