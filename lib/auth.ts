import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/features/auth/schemas/auth.schema";

type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: Role;
        };
    }

    interface User {
        role: Role;
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id: string;
        role: Role;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email et mot de passe requis");
                }

                const validated = loginSchema.safeParse(credentials);
                if (!validated.success) {
                    throw new Error("Données invalides");
                }

                const user = await prisma.user.findUnique({
                    where: { email: validated.data.email },
                });

                if (!user || !user.password) {
                    throw new Error("Email ou mot de passe incorrect");
                }

                const isPasswordValid = await bcrypt.compare(
                    validated.data.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Email ou mot de passe incorrect");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
});
