"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Car,
    Calendar,
    LayoutDashboard,
    User,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Véhicules", href: "/dashboard/vehicles", icon: Car },
    { name: "Réservations", href: "/dashboard/reservations", icon: Calendar },
    { name: "Profil", href: "/dashboard/profile", icon: User },
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
                    {!isCollapsed && (
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Car className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-lg text-sidebar-foreground">Vroom</span>
                        </Link>
                    )}
                    {isCollapsed && (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                            <Car className="w-5 h-5 text-primary-foreground" />
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-2 mt-2">
                    {navigation.map((item) => {
                        const isActive = pathname.split("/")[pathname.split("/").length - 1] === item.href.split("/")[item.href.split("/").length - 1];
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0", isCollapsed && "mx-auto")} />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Toggle button */}
                <div className="p-2 border-t border-sidebar-border">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full justify-center"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4" />
                                <span className="ml-2">Réduire</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </aside>
    );
}
