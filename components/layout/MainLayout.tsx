"use client"

import React, { useState } from 'react'
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export const MainLayout = ({ children, session }: { children: React.ReactNode, session: any }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={cn("transition-all duration-300 w-full", isCollapsed ? "ml-16" : "ml-64")}>
                <Header user={session.user} />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
