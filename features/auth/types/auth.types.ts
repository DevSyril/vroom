import { User, Role } from "@prisma/client";

export type SafeUser = Omit<User, "password">;

export interface AuthSession {
    user: SafeUser;
    expires: string;
}

export interface AuthContextType {
    user: SafeUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
