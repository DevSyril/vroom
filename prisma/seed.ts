import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create users
    const hashedPassword = await bcrypt.hash("Password123", 12);

    const admin = await prisma.user.upsert({
        where: { email: "admin@togodatalab.com" },
        update: {},
        create: {
            email: "admin@togodatalab.com",
            name: "Admin Système",
            password: hashedPassword,
            role: "ADMIN",
            department: "IT",
            phone: "+228 90 00 00 01",
        },
    });

    const manager = await prisma.user.upsert({
        where: { email: "manager@togodatalab.com" },
        update: {},
        create: {
            email: "manager@togodatalab.com",
            name: "Jean Koffi",
            password: hashedPassword,
            role: "MANAGER",
            department: "Logistique",
            phone: "+228 90 00 00 02",
        },
    });

    const employee1 = await prisma.user.upsert({
        where: { email: "employe1@togodatalab.com" },
        update: {},
        create: {
            email: "employe1@togodatalab.com",
            name: "Marie Amouzou",
            password: hashedPassword,
            role: "EMPLOYEE",
            department: "Commercial",
            phone: "+228 90 00 00 03",
        },
    });

    const employee2 = await prisma.user.upsert({
        where: { email: "employe2@togodatalab.com" },
        update: {},
        create: {
            email: "employe2@togodatalab.com",
            name: "Kokou Mensah",
            password: hashedPassword,
            role: "EMPLOYEE",
            department: "Technique",
            phone: "+228 90 00 00 04",
        },
    });

    console.log("✅ Users created");

    // Create vehicles
    const vehicles = await Promise.all([
        prisma.vehicle.upsert({
            where: { licensePlate: "TG-2024-001" },
            update: {},
            create: {
                brand: "Toyota",
                model: "Hilux",
                year: 2023,
                licensePlate: "TG-2024-001",
                type: "TRUCK",
                fuelType: "DIESEL",
                seats: 5,
                transmission: "MANUAL",
                color: "Blanc",
                mileage: 15000,
                status: "AVAILABLE",
                features: ["GPS", "Climatisation", "Radio", "4x4"],
                description: "Pick-up robuste idéal pour les missions sur terrain difficile.",
            },
        }),
        prisma.vehicle.upsert({
            where: { licensePlate: "TG-2024-002" },
            update: {},
            create: {
                brand: "Toyota",
                model: "Corolla",
                year: 2022,
                licensePlate: "TG-2024-002",
                type: "SEDAN",
                fuelType: "GASOLINE",
                seats: 5,
                transmission: "AUTOMATIC",
                color: "Noir",
                mileage: 25000,
                status: "AVAILABLE",
                features: ["GPS", "Climatisation", "Bluetooth", "Caméra de recul"],
                description: "Berline confortable pour les déplacements urbains et interurbains.",
            },
        }),
        prisma.vehicle.upsert({
            where: { licensePlate: "TG-2024-003" },
            update: {},
            create: {
                brand: "Hyundai",
                model: "Tucson",
                year: 2023,
                licensePlate: "TG-2024-003",
                type: "SUV",
                fuelType: "HYBRID",
                seats: 5,
                transmission: "AUTOMATIC",
                color: "Gris",
                mileage: 8000,
                status: "AVAILABLE",
                features: ["GPS", "Climatisation", "Apple CarPlay", "Sièges chauffants", "Toit ouvrant"],
                description: "SUV hybride économique et confortable.",
            },
        }),
        prisma.vehicle.upsert({
            where: { licensePlate: "TG-2024-004" },
            update: {},
            create: {
                brand: "Mercedes",
                model: "Sprinter",
                year: 2021,
                licensePlate: "TG-2024-004",
                type: "VAN",
                fuelType: "DIESEL",
                seats: 12,
                transmission: "MANUAL",
                color: "Blanc",
                mileage: 45000,
                status: "AVAILABLE",
                features: ["GPS", "Climatisation", "Grande capacité de chargement"],
                description: "Van spacieux pour le transport de groupe ou de matériel.",
            },
        }),
        prisma.vehicle.upsert({
            where: { licensePlate: "TG-2024-005" },
            update: {},
            create: {
                brand: "Renault",
                model: "Kangoo",
                year: 2022,
                licensePlate: "TG-2024-005",
                type: "UTILITY",
                fuelType: "DIESEL",
                seats: 2,
                transmission: "MANUAL",
                color: "Bleu",
                mileage: 30000,
                status: "AVAILABLE",
                features: ["GPS", "Climatisation", "Grand espace de chargement"],
                description: "Utilitaire pratique pour les livraisons et transports de matériel.",
            },
        }),
        prisma.vehicle.upsert({
            where: { licensePlate: "TG-2024-006" },
            update: {},
            create: {
                brand: "Nissan",
                model: "X-Trail",
                year: 2023,
                licensePlate: "TG-2024-006",
                type: "SUV",
                fuelType: "GASOLINE",
                seats: 7,
                transmission: "AUTOMATIC",
                color: "Rouge",
                mileage: 12000,
                status: "IN_USE",
                features: ["GPS", "Climatisation", "7 places", "4x4"],
                description: "SUV 7 places pour les déplacements en équipe.",
            },
        }),
        prisma.vehicle.upsert({
            where: { licensePlate: "TG-2024-007" },
            update: {},
            create: {
                brand: "Ford",
                model: "Ranger",
                year: 2020,
                licensePlate: "TG-2024-007",
                type: "TRUCK",
                fuelType: "DIESEL",
                seats: 5,
                transmission: "MANUAL",
                color: "Vert",
                mileage: 60000,
                status: "MAINTENANCE",
                features: ["GPS", "Climatisation", "4x4", "Treuil"],
                description: "Pick-up tout-terrain en cours de maintenance.",
            },
        }),
    ]);

    console.log("✅ Vehicles created");

    // Create some reservations
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const inTwoWeeks = new Date(now);
    inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);

    await prisma.reservation.createMany({
        data: [
            {
                userId: employee1.id,
                vehicleId: vehicles[5].id, // X-Trail (IN_USE)
                startDate: new Date(now.setHours(8, 0, 0, 0)),
                endDate: new Date(now.setHours(18, 0, 0, 0)),
                purpose: "Réunion client à Kara avec l'équipe commerciale",
                destination: "Kara",
                status: "APPROVED",
            },
            {
                userId: employee2.id,
                vehicleId: vehicles[0].id, // Hilux
                startDate: tomorrow,
                endDate: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
                purpose: "Installation d'équipement technique dans les bureaux régionaux",
                destination: "Sokodé",
                status: "PENDING",
            },
            {
                userId: employee1.id,
                vehicleId: vehicles[1].id, // Corolla
                startDate: nextWeek,
                endDate: new Date(nextWeek.getTime() + 24 * 60 * 60 * 1000),
                purpose: "Visite de partenaires commerciaux",
                destination: "Lomé",
                status: "PENDING",
            },
            {
                userId: manager.id,
                vehicleId: vehicles[2].id, // Tucson
                startDate: inTwoWeeks,
                endDate: new Date(inTwoWeeks.getTime() + 3 * 24 * 60 * 60 * 1000),
                purpose: "Audit des installations régionales",
                destination: "Atakpamé, Kpalimé",
                status: "APPROVED",
            },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Reservations created");

    console.log("🎉 Database seeded successfully!");
    console.log("\n📝 Test accounts:");
    console.log("   Admin: admin@togodatalab.com / Password123");
    console.log("   Manager: manager@togodatalab.com / Password123");
    console.log("   Employé: employe1@togodatalab.com / Password123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
