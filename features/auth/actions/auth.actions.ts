"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function register(data: RegisterInput) {
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
        return { error: validated.error.errors[0].message };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: validated.data.email },
    });

    if (existingUser) {
        return { error: "Un utilisateur avec cet email existe déjà" };
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 12);

    const user = await prisma.user.create({
        data: {
            name: validated.data.name,
            email: validated.data.email,
            password: hashedPassword,
            department: validated.data.department,
            phone: validated.data.phone,
        },
    });

    return { success: true, userId: user.id };
}

export async function login(email: string, password: string) {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email ou mot de passe incorrect" };
                case "CallbackRouteError":
                    if (error.cause?.err?.message) {
                        return { error: error.cause.err?.message };
                    }
                    return { error: "Erreur de connexion" };
                default:
                    return { error: "Une erreur est survenue" };
            }
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirect: false });
}
