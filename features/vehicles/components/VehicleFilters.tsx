"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { vehicleTypeLabels, fuelTypeLabels, transmissionLabels, vehicleStatusLabels } from "../types/vehicle.types";
import type { VehicleFilter } from "../schemas/vehicle.schema";

interface VehicleFiltersProps {
    onFilterChange: (filters: VehicleFilter) => void;
    initialFilters?: VehicleFilter;
}

export function VehicleFilters({ onFilterChange, initialFilters }: VehicleFiltersProps) {
    const [filters, setFilters] = useState<VehicleFilter>(initialFilters || {});
    const [showFilters, setShowFilters] = useState(false);

    const updateFilter = (key: keyof VehicleFilter, value: string | undefined) => {
        const newFilters = { ...filters, [key]: value || undefined };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        setFilters({});
        onFilterChange({});
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== "");

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par marque, modèle ou plaque..."
                        value={filters.search || ""}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Toggle Filters */}
                <Button
                    variant={showFilters ? "secondary" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                    {hasActiveFilters && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                            {Object.values(filters).filter(v => v !== undefined && v !== "").length}
                        </span>
                    )}
                </Button>

                {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters}>
                        <X className="w-4 h-4 mr-2" />
                        Effacer
                    </Button>
                )}
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl animate-fade-up">
                    <Select
                        value={filters.type || ""}
                        onValueChange={(value) => updateFilter("type", value || undefined)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Type de véhicule" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(vehicleTypeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.fuelType || ""}
                        onValueChange={(value) => updateFilter("fuelType", value || undefined)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Carburant" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(fuelTypeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.transmission || ""}
                        onValueChange={(value) => updateFilter("transmission", value || undefined)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Transmission" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(transmissionLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.status || ""}
                        onValueChange={(value) => updateFilter("status", value || undefined)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(vehicleStatusLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
