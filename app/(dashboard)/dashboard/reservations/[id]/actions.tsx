"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cancelReservation, updateReservationStatus } from "@/features/reservations/actions/reservation.actions";

interface CancelReservationButtonProps {
    reservationId: string;
}

export function CancelReservationButton({ reservationId }: CancelReservationButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleCancel = async () => {
        setIsLoading(true);
        const result = await cancelReservation(reservationId);
        setIsLoading(false);
        if (result.success) {
            setIsOpen(false);
            router.refresh();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                    <X className="w-4 h-4 mr-2" />
                    Annuler la réservation
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Annuler la réservation ?</DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible. La réservation sera marquée comme annulée et le véhicule sera libéré.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                        Retour
                    </Button>
                    <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Annulation...
                            </>
                        ) : (
                            "Confirmer l'annulation"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ApproveRejectButtonsProps {
    reservationId: string;
}

export function ApproveRejectButtons({ reservationId }: ApproveRejectButtonsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null);

    const handleApprove = async () => {
        setIsLoading("approve");
        const result = await updateReservationStatus(reservationId, { status: "APPROVED" });
        setIsLoading(null);
        if (result.success) {
            router.refresh();
        }
    };

    const handleReject = async () => {
        setIsLoading("reject");
        const result = await updateReservationStatus(reservationId, { status: "REJECTED" });
        setIsLoading(null);
        if (result.success) {
            router.refresh();
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                onClick={handleApprove}
                disabled={isLoading !== null}
                className="flex-1"
            >
                {isLoading === "approve" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Check className="w-4 h-4 mr-2" />
                        Approuver
                    </>
                )}
            </Button>
            <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isLoading !== null}
                className="flex-1"
            >
                {isLoading === "reject" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <X className="w-4 h-4 mr-2" />
                        Refuser
                    </>
                )}
            </Button>
        </div>
    );
}
